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

  // AccessControl
  'function getRoleAdmin(bytes32 role) view returns (bytes32)',
  'function grantRole(bytes32 role, address account)',
  'function revokeRole(bytes32 role, address account)',

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

  // optional / EIP-2771
  'function isTrustedForwarder(address forwarder) view returns (bool)',

  // optional (falls Ownable; wird via safeCall benutzt)
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

/* -------------------------------------------------------- */
/* Helpers                                                  */
/* -------------------------------------------------------- */

/** Zahlensicher: wandelt bigint | BigNumber | number | string → number */
function toNum(x: unknown): number {
  if (typeof x === 'bigint') return Number(x)
  // v5 BigNumber-Case
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (x && typeof (x as any).toNumber === 'function') return (x as any).toNumber()
  if (typeof x === 'number') return x
  if (typeof x === 'string') return Number(x)
  return Number(x as any)
}

/** Safe-Wrapper: gibt undefined statt Fehler zurück */
async function safeCall<T>(fn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await fn()
  } catch {
    return undefined
  }
}

/* -------------------------------------------------------- */
/* Provider/Signer/Contract (ethers v5 kompatibel)          */
/* -------------------------------------------------------- */

async function getWeb3Provider(): Promise<ethers.providers.Web3Provider> {
  const w = window as unknown as { ethereum?: Eip1193Provider }
  const eth = w.ethereum
  if (!eth) throw new Error('MetaMask nicht gefunden.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new ethers.providers.Web3Provider(eth as unknown as any, 'any')
}

/** Netz prüfen/wechseln (v5) */
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
      throw new Error('Falsches Netzwerk. Bitte auf die unterstützte Chain wechseln.')
    }
  }
}

/** Signer + Contract laden (optional andere Contract-Adresse) */
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

/* -------------------------------------------------------- */
/* Öffentliches API                                         */
/* -------------------------------------------------------- */

export function useErc721(overrideAddress?: string) {
  /** Basisinfos */
  async function getInfo() {
    const { contract } = await getSignerAndContract(overrideAddress)
    const [name, symbol, totalRaw] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.totalSupply(),
    ])
    return { name, symbol, totalSupply: toNum(totalRaw) }
  }

  /** Token-IDs eines Owners */
  async function getTokenIdsOf(owner?: HexAddress) {
    const { contract, user } = await getSignerAndContract(overrideAddress)
    const target = owner ?? user
    const balRaw = await contract.balanceOf(target)
    const count = toNum(balRaw)

    const ids: number[] = []
    for (let i = 0; i < count; i++) {
      const idRaw = await contract.tokenOfOwnerByIndex(target, i)
      ids.push(toNum(idRaw))
    }
    return ids
  }

  /** Tokens mit URI/Punkten laden */
  async function loadTokensOf(owner?: HexAddress): Promise<LoadedToken[]> {
    const { contract, user } = await getSignerAndContract(overrideAddress)
    const target = owner ?? user
    const ids = await getTokenIdsOf(target)
    const out: LoadedToken[] = []

    for (const id of ids) {
      const [uri, ptsRaw, own] = await Promise.all([
        safeCall<string>(() => contract.tokenURI(id)),
        safeCall<unknown>(() => contract.tokenPoints(id)), // uint8 (v6 -> bigint, v5 -> BigNumber)
        contract.ownerOf(id),
      ])

      out.push({
        tokenId: id,
        owner: own as HexAddress,
        uri: uri ?? undefined,
        points: ptsRaw != null ? toNum(ptsRaw) : undefined,
      })
    }
    return out
  }

  /** Doppel-Claim verhindern */
  async function isAlreadyMinted(surveyId: Bigish, owner?: HexAddress) {
    const { contract, user } = await getSignerAndContract(overrideAddress)
    const addr = owner ?? user
    return await contract.minted(addr, surveyId)
  }

  /** Claim (Frontend-Fallback; dein Live-Claim kommt am Ende der Umfrage) */
  async function claim(surveyId: Bigish, points: 1 | 2 | 3) {
    const { contract, user } = await getSignerAndContract(overrideAddress)
    const already: boolean = await contract.minted(user, surveyId)
    if (already) throw new Error('Für diese Umfrage wurde bereits geclaimt.')
    const tx = await contract.claimNFT(surveyId, points)
    return await tx.wait()
  }

  /** Eigenes NFT burnen (nur Owner) */
  async function burnOwn(tokenId: Bigish) {
    const { contract, user } = await getSignerAndContract(overrideAddress)
    const owner: HexAddress = await contract.ownerOf(tokenId)
    if (owner.toLowerCase() !== user.toLowerCase()) {
      throw new Error('Du bist nicht der Eigentümer dieses Tokens.')
    }
    const tx = await contract.burn(tokenId)
    return await tx.wait()
  }

  /** Global: tokenByIndex (z. B. Explorer/Indexer-Light) */
  async function tokenByIndexGlobal(index: number) {
    const { contract } = await getSignerAndContract(overrideAddress)
    const idRaw = await contract.tokenByIndex(index)
    return toNum(idRaw)
  }

  /** Admin: beliebiges Token burnen (DELETER_ROLE) */
  async function burnAny(tokenId: Bigish) {
    const { contract } = await getSignerAndContract(overrideAddress)
    const tx = await contract.burnAny(tokenId)
    return await tx.wait()
  }

  /** Admin: alle Tokens einer Wallet burnen (DELETER_ROLE) */
  async function burnAllFor(holder: HexAddress, maxCount = 50) {
    const { contract } = await getSignerAndContract(overrideAddress)
    const tx = await contract.burnAllFor(holder, maxCount)
    return await tx.wait()
  }

  /** Rollenprüfung (DELETER_ROLE für addr oder aktuellen User) */
  async function hasDeleterRole(addr?: HexAddress) {
    const { contract, user } = await getSignerAndContract(overrideAddress)
    const role: string = await contract.DELETER_ROLE()
    const who = addr ?? user
    return await contract.hasRole(role, who)
  }

  /** EIP-2771 Forwarder-Vertrauen (optional) */
  async function isForwarderTrusted(forwarder?: HexAddress) {
    const { contract } = await getSignerAndContract(overrideAddress)
    const fwd =
      forwarder || (import.meta.env.VITE_FORWARDER_ADDR as HexAddress) || undefined
    if (!fwd) throw new Error('Kein Forwarder gesetzt.')
    return await contract.isTrustedForwarder(fwd)
  }

  /** Eigene Wallet-Adresse */
  async function getMyAddress(): Promise<HexAddress> {
    const { signer } = await getSignerAndContract(overrideAddress)
    return (await signer.getAddress()) as HexAddress
  }

  /** TokenURI lesen */
  async function getTokenURI(tokenId: Bigish) {
    const { contract } = await getSignerAndContract(overrideAddress)
    return await contract.tokenURI(tokenId)
  }

  /** Punkte je Token (robust) */
  async function getTokenPoints(tokenId: Bigish) {
    const { contract } = await getSignerAndContract(overrideAddress)
    const p = await contract.tokenPoints(tokenId) // v6: bigint, v5: BigNumber
    return toNum(p)
  }

  /* ---------- Owner-Adapter ---------- */

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

  /* ---------- Legacy/Convenience ---------- */

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
    return { tokenId: Number(tokenId), owner: owner as HexAddress, uri, points }
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

  /* ---------- Rollen-Helpers ---------- */

  async function getDeleterRoleId() {
    const { contract } = await getSignerAndContract(overrideAddress)
    return await contract.DELETER_ROLE()
  }

  // Prüfen, ob verbundene Wallet Admin dieses Roles ist
  async function getDeleterRoleAdmin(): Promise<boolean> {
    const { contract, user } = await getSignerAndContract(overrideAddress)
    const role = await contract.DELETER_ROLE()
    const adminRole = await contract.getRoleAdmin(role)
    const has = await contract.hasRole(adminRole, user)
    return !!has
  }

  async function grantDeleterRole(addr: `0x${string}`) {
    const { contract } = await getSignerAndContract(overrideAddress)
    const role = await contract.DELETER_ROLE()
    const tx = await contract.grantRole(role, addr)
    return await tx.wait()
  }

  async function revokeDeleterRole(addr: `0x${string}`) {
    const { contract } = await getSignerAndContract(overrideAddress)
    const role = await contract.DELETER_ROLE()
    const tx = await contract.revokeRole(role, addr)
    return await tx.wait()
  }

  /* ---------- Export ---------- */

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

    // Rollen-Helpers:
    getDeleterRoleAdmin,
    grantDeleterRole,
    revokeDeleterRole,
    getDeleterRoleId,
  }
}
