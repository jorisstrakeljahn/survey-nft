import { ethers } from 'ethers'
import { config } from '@/config'

/**
 * Minimal-ABI für SurveyNFT
 * (ERC721Enumerable + URIStorage + AccessControl + Custom)
 */
const SURVEY_NFT_ABI = [
  // Standard & Enumerable & URI
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function tokenByIndex(uint256 index) view returns (uint256)',

  // Custom
  'function claimNFT(uint256 surveyId, uint8 points) external',
  'function minted(address user, uint256 surveyId) view returns (bool)',
  'function tokenPoints(uint256 tokenId) view returns (uint8)',

  // Burn & Admin
  'function burn(uint256 tokenId) external',
  'function burnAny(uint256 tokenId) external',
  'function burnAllFor(address holder, uint256 maxCount) external',
  'function DELETER_ROLE() view returns (bytes32)',
  'function hasRole(bytes32 role, address account) view returns (bool)',

  // optional
  'function isTrustedForwarder(address forwarder) view returns (bool)',
  // optional (nur falls Ownable, wird via safeCall benutzt)
  'function owner() view returns (address)',
] as const

export type HexAddress = `0x${string}`
export type Bigish = bigint | number | string

export interface LoadedToken {
  tokenId: number
  owner: HexAddress
  uri?: string
  points?: number
}

/** EIP-1193 Provider Typ (vermeidet "any") */
type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on?: (...args: unknown[]) => void
}

/**
 * Provider/Signer/Contract (ethers v5)
 */
async function getWeb3Provider(): Promise<ethers.providers.Web3Provider> {
  const w = window as unknown as { ethereum?: Eip1193Provider }
  const eth = w.ethereum
  if (!eth) throw new Error('MetaMask nicht gefunden.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new ethers.providers.Web3Provider(eth as unknown as any, 'any')
}

/**
 * Netz prüfen/wechseln (ethers v5)
 */
async function ensureChain(
  provider: ethers.providers.Web3Provider,
  supportedChainId?: number | string,
) {
  if (!supportedChainId) return
  const wantHex =
    typeof supportedChainId === 'string'
      ? '0x' + parseInt(supportedChainId, 10).toString(16)
      : '0x' + supportedChainId.toString(16)

  const current = await provider.send('eth_chainId', [])
  if (current !== wantHex) {
    try {
      await provider.send('wallet_switchEthereumChain', [{ chainId: wantHex }])
    } catch {
      throw new Error(
        'Falsches Netzwerk. Bitte auf die unterstützte Chain wechseln.',
      )
    }
  }
}

/**
 * Signer + Contract laden
 * addressParam: überschreibt config.ERC721_ADDRESS (optional)
 */
async function getSignerAndContract(addressParam?: string) {
  const provider = await getWeb3Provider()
  await provider.send('eth_requestAccounts', [])
  await ensureChain(provider, Number(config.SUPPORTED_CHAIN_ID))

  const signer = provider.getSigner()
  const nftAddress = (addressParam || config.ERC721_ADDRESS) as string
  if (!nftAddress) {
    throw new Error('VITE_ERC721_ADDRESS fehlt in der .env / config.')
  }

  const contract = new ethers.Contract(nftAddress, SURVEY_NFT_ABI, signer)
  const user = (await signer.getAddress()) as HexAddress

  return { provider, signer, contract, user }
}

/**
 * Öffentliches API
 * useErc721(address?) -> alle Methoden auf dein SurveyNFT
 */
export function useErc721(overrideAddress?: string) {
  async function getInfo() {
    const { contract } = await getSignerAndContract(overrideAddress)
    const [name, symbol, total] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.totalSupply(),
    ])
    return { name, symbol, totalSupply: Number(total) }
  }

  async function getTokenIdsOf(owner?: HexAddress) {
    const { contract, user } = await getSignerAndContract(overrideAddress)
    const target = owner ?? user
    const bal: ethers.BigNumber = await contract.balanceOf(target)
    const count = bal.toNumber()

    const ids: number[] = []
    for (let i = 0; i < count; i++) {
      const id: ethers.BigNumber = await contract.tokenOfOwnerByIndex(target, i)
      ids.push(id.toNumber())
    }
    return ids
  }

  async function loadTokensOf(owner?: HexAddress): Promise<LoadedToken[]> {
    const { contract, user } = await getSignerAndContract(overrideAddress)
    const target = owner ?? user
    const ids = await getTokenIdsOf(target)
    const out: LoadedToken[] = []

    for (const id of ids) {
      const [uri, pts, own] = await Promise.all([
        safeCall<string>(() => contract.tokenURI(id)),
        safeCall<number>(async () => {
          const x: ethers.BigNumber = await contract.tokenPoints(id)
          return x.toNumber()
        }),
        contract.ownerOf(id),
      ])
      out.push({
        tokenId: id,
        owner: own as HexAddress,
        uri: uri ?? undefined,
        points: typeof pts === 'number' ? pts : undefined,
      })
    }
    return out
  }

  async function isAlreadyMinted(surveyId: Bigish, owner?: HexAddress) {
    const { contract, user } = await getSignerAndContract(overrideAddress)
    const addr = owner ?? user
    const res: boolean = await contract.minted(addr, surveyId)
    return res
  }

  async function claim(surveyId: Bigish, points: 1 | 2 | 3) {
    const { contract, user } = await getSignerAndContract(overrideAddress)
    const already: boolean = await contract.minted(user, surveyId)
    if (already) throw new Error('Für diese Umfrage wurde bereits geclaimt.')
    const tx = await contract.claimNFT(surveyId, points)
    return await tx.wait()
  }

  async function burnOwn(tokenId: Bigish) {
    const { contract, user } = await getSignerAndContract(overrideAddress)
    const owner: HexAddress = await contract.ownerOf(tokenId)
    if (owner.toLowerCase() !== user.toLowerCase()) {
      throw new Error('Du bist nicht der Eigentümer dieses Tokens.')
    }
    const tx = await contract.burn(tokenId)
    return await tx.wait()
  }

  async function tokenByIndexGlobal(index: number) {
    const { contract } = await getSignerAndContract(overrideAddress)
    const id: ethers.BigNumber = await contract.tokenByIndex(index)
    return id.toNumber()
  }

  async function burnAny(tokenId: Bigish) {
    const { contract } = await getSignerAndContract(overrideAddress)
    const tx = await contract.burnAny(tokenId)
    return await tx.wait()
  }

  async function burnAllFor(holder: HexAddress, maxCount = 50) {
    const { contract } = await getSignerAndContract(overrideAddress)
    const tx = await contract.burnAllFor(holder, maxCount)
    return await tx.wait()
  }

  async function hasDeleterRole(addr?: HexAddress) {
    const { contract, user } = await getSignerAndContract(overrideAddress)
    const role: string = await contract.DELETER_ROLE()
    const who = addr ?? user
    const res: boolean = await contract.hasRole(role, who)
    return res
  }

  async function isForwarderTrusted(forwarder?: HexAddress) {
    const { contract } = await getSignerAndContract(overrideAddress)
    const fwd =
      forwarder ||
      (import.meta.env.VITE_FORWARDER_ADDR as HexAddress) ||
      undefined
    if (!fwd) throw new Error('Kein Forwarder gesetzt.')
    const res: boolean = await contract.isTrustedForwarder(fwd)
    return res
  }

  async function getMyAddress(): Promise<HexAddress> {
    const { signer } = await getSignerAndContract(overrideAddress)
    return (await signer.getAddress()) as HexAddress
  }

  async function getTokenURI(tokenId: Bigish) {
    const { contract } = await getSignerAndContract(overrideAddress)
    return await contract.tokenURI(tokenId)
  }

  async function getTokenPoints(tokenId: Bigish) {
    const { contract } = await getSignerAndContract(overrideAddress)
    const p: ethers.BigNumber = await contract.tokenPoints(tokenId)
    return p.toNumber()
  }

  // --------- Owner/Adapter ---------

  async function getOwnerOf(tokenId: Bigish) {
    const { contract } = await getSignerAndContract(overrideAddress)
    const addr = await contract.ownerOf(tokenId)
    return addr as HexAddress
  }

  // Überladener Adapter:
  // - getOwner(tokenId)   -> token owner
  // - getOwner()         -> contract owner (falls Ownable), sonst undefined
  async function getOwner(): Promise<HexAddress | undefined>
  async function getOwner(tokenId: Bigish): Promise<HexAddress>
  async function getOwner(arg?: Bigish): Promise<HexAddress | undefined> {
    if (typeof arg !== 'undefined') {
      return await getOwnerOf(arg)
    }
    const { contract } = await getSignerAndContract(overrideAddress)
    const addr = await safeCall<string>(() => contract.owner())
    return addr as HexAddress | undefined
  }

  // --------- weitere Adapter/Legacy-Namen ---------

  async function getTotalSupply() {
    const i = await getInfo()
    return i.totalSupply
  }

  async function getBalanceOf(owner?: HexAddress) {
    const ids = await getTokenIdsOf(owner)
    return ids.length
  }

  async function getNft(tokenId: Bigish) {
    const [owner, uri, points] = await Promise.all([
      getOwner(tokenId),
      getTokenURI(tokenId),
      getTokenPoints(tokenId),
    ])
    return { tokenId: Number(tokenId), owner, uri, points }
  }

  async function listNfts(owner?: HexAddress) {
    return await loadTokensOf(owner)
  }

  async function claimNFT(surveyId: Bigish, points: 1 | 2 | 3) {
    return await claim(surveyId, points)
  }

  async function burnToken(tokenId: Bigish) {
    return await burnOwn(tokenId)
  }

  async function burnAnyToken(tokenId: Bigish) {
    return await burnAny(tokenId)
  }

  async function burnAllForHolder(holder: HexAddress, maxCount = 50) {
    return await burnAllFor(holder, maxCount)
  }

  async function hasRoleDeleter(addr?: HexAddress) {
    return await hasDeleterRole(addr)
  }

  async function isAlreadyClaimed(surveyId: Bigish, owner?: HexAddress) {
    return await isAlreadyMinted(surveyId, owner)
  }

  async function getTokenByIndex(index: number): Promise<number> {
    return await tokenByIndexGlobal(index)
  }

  return {
    // moderne Methoden
    getInfo,
    getMyAddress,
    isForwarderTrusted,
    getTokenByIndex,

    getTokenIdsOf,
    loadTokensOf,
    getTokenURI,
    getTokenPoints,
    isAlreadyMinted,

    claim,
    burnOwn,
    burnAny,
    burnAllFor,

    hasDeleterRole,

    // Owner/Adapter
    getOwnerOf,
    getOwner,

    // Legacy/Convenience
    getTotalSupply,
    getBalanceOf,
    tokenByIndexGlobal,
    getNft,
    listNfts,
    claimNFT,
    burnToken,
    burnAnyToken,
    burnAllForHolder,
    hasRoleDeleter,
    isAlreadyClaimed,
  }
}

/** Safe-Wrapper: gibt undefined statt Fehler zurück */
async function safeCall<T>(fn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await fn()
  } catch {
    return undefined
  }
}
