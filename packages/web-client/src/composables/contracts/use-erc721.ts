// packages/frontend/src/composables/contracts/use-erc721.ts
import { ethers } from "ethers";
import { config } from "@/config";

/**
 * Minimal-ABI für deinen SurveyNFT (OZ ERC721Enumerable + URIStorage + AccessControl + EIP-2771)
 * Enthält nur die Funktionen, die wir im Frontend brauchen.
 */
const SURVEY_NFT_ABI = [
  // ---- Standard & Enumerable & URI ----
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",

  // ---- Deine Custom-Felder/Funktionen ----
  "function claimNFT(uint256 surveyId, uint8 points) external",
  "function minted(address user, uint256 surveyId) view returns (bool)",
  "function tokenPoints(uint256 tokenId) view returns (uint8)",

  // ---- Burn & Admin ----
  "function burn(uint256 tokenId) external",
  "function burnAny(uint256 tokenId) external",
  "function burnAllFor(address holder, uint256 maxCount) external",
  "function DELETER_ROLE() view returns (bytes32)",
  "function hasRole(bytes32 role, address account) view returns (bool)",

  // ---- (optional) EIP-2771 Info ----
  "function isTrustedForwarder(address forwarder) view returns (bool)"
] as const;

/**
 * Einfache Utility-Types
 */
export type HexAddress = `0x${string}`;
export type Bigish = bigint | number | string;

export interface LoadedToken {
  tokenId: number;
  owner: HexAddress;
  uri?: string;
  points?: number;
}

/**
 * Interne: stelle Provider/Signer/Contract bereit
 */
async function getProvider(): Promise<ethers.BrowserProvider> {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("MetaMask nicht gefunden.");
  }
  return new ethers.BrowserProvider((window as any).ethereum);
}

async function ensureChain(provider: ethers.BrowserProvider, chainIdHex = config.chainIdHex) {
  const current = await provider.send("eth_chainId", []);
  if (chainIdHex && current !== chainIdHex) {
    try {
      await provider.send("wallet_switchEthereumChain", [{ chainId: chainIdHex }]);
    } catch (e: any) {
      if (e?.code === 4902) {
        // optional: hier könnte man wallet_addEthereumChain anbieten
        throw new Error("Falsches Netzwerk. Bitte Polygon Mainnet (137) in MetaMask hinzufügen.");
      }
      throw e;
    }
  }
}

async function getSignerAndContract() {
  const provider = await getProvider();
  await provider.send("eth_requestAccounts", []);
  await ensureChain(provider);

  const signer = await provider.getSigner();
  if (!config.erc721Address) {
    throw new Error("VITE_ERC721_ADDRESS fehlt in der .env / config.");
  }
  const contract = new ethers.Contract(config.erc721Address, SURVEY_NFT_ABI, signer);
  const user = (await signer.getAddress()) as HexAddress;

  return { provider, signer, contract, user };
}

/**
 * Öffentliche API: alle bequemen Operationen für dein Frontend
 */
export function useErc721() {
  /**
   * Info
   */
  async function getInfo() {
    const { contract } = await getSignerAndContract();
    const [name, symbol, total] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.totalSupply(),
    ]);
    return { name, symbol, totalSupply: Number(total) };
  }

  /**
   * Hole alle TokenIds eines Owners (per Enumerable)
   */
  async function getTokenIdsOf(owner?: HexAddress) {
    const { contract, user } = await getSignerAndContract();
    const target = owner ?? user;
    const bal: bigint = await contract.balanceOf(target);
    const ids: number[] = [];
    for (let i = 0n; i < bal; i++) {
      const id: bigint = await contract.tokenOfOwnerByIndex(target, i);
      ids.push(Number(id));
    }
    return ids;
  }

  /**
   * Lade Token-Daten eines Owners (owner, uri, points)
   */
  async function loadTokensOf(owner?: HexAddress): Promise<LoadedToken[]> {
    const { contract, user } = await getSignerAndContract();
    const target = owner ?? user;
    const ids = await getTokenIdsOf(target);
    const out: LoadedToken[] = [];

    for (const id of ids) {
      const [uri, pts, own] = await Promise.all([
        safeCall<string>(() => contract.tokenURI(id)),
        safeCall<number>(() => contract.tokenPoints(id).then((x: bigint | number) => Number(x))),
        contract.ownerOf(id),
      ]);
      out.push({
        tokenId: id,
        owner: own as HexAddress,
        uri: uri ?? undefined,
        points: typeof pts === "number" ? pts : undefined,
      });
    }
    return out;
  }

  /**
   * Prüfe, ob (user, surveyId) bereits geclaimt wurde
   */
  async function isAlreadyMinted(surveyId: Bigish, owner?: HexAddress) {
    const { contract, user } = await getSignerAndContract();
    const addr = owner ?? user;
    const res: boolean = await contract.minted(addr, surveyId);
    return res;
  }

  /**
   * Claim – ruft claimNFT(surveyId, points)
   * Achtung: wirf Fehler, wenn bereits geclaimt.
   */
  async function claim(surveyId: Bigish, points: 1 | 2 | 3) {
    const { contract, user } = await getSignerAndContract();
    const already: boolean = await contract.minted(user, surveyId);
    if (already) throw new Error("Für diese Umfrage wurde bereits geclaimt.");

    const tx = await contract.claimNFT(surveyId, points);
    return await tx.wait();
  }

  /**
   * Burn eigenes NFT
   */
  async function burnOwn(tokenId: Bigish) {
    const { contract, user } = await getSignerAndContract();
    const owner: HexAddress = await contract.ownerOf(tokenId);
    if (owner.toLowerCase() !== user.toLowerCase()) {
      throw new Error("Du bist nicht der Eigentümer dieses Tokens.");
    }
    const tx = await contract.burn(tokenId);
    return await tx.wait();
  }

  /**
   * Admin: Burn jedes NFT (erfordert DELETER_ROLE)
   */
  async function burnAny(tokenId: Bigish) {
    const { contract } = await getSignerAndContract();
    const tx = await contract.burnAny(tokenId);
    return await tx.wait();
  }

  /**
   * Admin: Alle NFTs eines Holders löschen (Chunk via maxCount)
   */
  async function burnAllFor(holder: HexAddress, maxCount = 50) {
    const { contract } = await getSignerAndContract();
    const tx = await contract.burnAllFor(holder, maxCount);
    return await tx.wait();
  }

  /**
   * Rollen: hat verbundener Nutzer DELETER_ROLE?
   */
  async function hasDeleterRole(addr?: HexAddress) {
    const { contract, user } = await getSignerAndContract();
    const role: string = await contract.DELETER_ROLE();
    const who = addr ?? user;
    const res: boolean = await contract.hasRole(role, who);
    return res;
  }

  /**
   * Trusted Forwarder (nur Info)
   */
  async function isForwarderTrusted(forwarder?: HexAddress) {
    const { contract } = await getSignerAndContract();
    const fwd = forwarder ?? (config.forwarderAddress as HexAddress);
    if (!fwd) throw new Error("Kein Forwarder in config gesetzt.");
    const res: boolean = await contract.isTrustedForwarder(fwd);
    return res;
  }

  /**
   * Öffentliche Helfer
   */
  async function getMyAddress(): Promise<HexAddress> {
    const { signer } = await getSignerAndContract();
    return (await signer.getAddress()) as HexAddress;
  }

  async function getTokenURI(tokenId: Bigish) {
    const { contract } = await getSignerAndContract();
    return await contract.tokenURI(tokenId);
  }

  async function getTokenPoints(tokenId: Bigish) {
    const { contract } = await getSignerAndContract();
    const p: bigint = await contract.tokenPoints(tokenId);
    return Number(p);
  }

  return {
    // Infos & Helpers
    getInfo,
    getMyAddress,
    isForwarderTrusted,

    // Lesen
    getTokenIdsOf,
    loadTokensOf,
    getTokenURI,
    getTokenPoints,
    isAlreadyMinted,

    // Schreiben
    claim,
    burnOwn,
    burnAny,
    burnAllFor,

    // Rollen
    hasDeleterRole,
  };
}

/**
 * Safe-Wrapper: gibt undefined zurück statt Fehler zu werfen
 */
async function safeCall<T>(fn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await fn();
  } catch {
    return undefined;
  }
}
