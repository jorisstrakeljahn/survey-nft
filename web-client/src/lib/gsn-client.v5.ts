// src/lib/gsn-client.v5.ts
// GSN + Ethers helper with v5/v6 compatibility, staged send, tuned relay lookups, and debug logging.

import { ethers } from 'ethers'
import {
  CHAIN_ID,
  POLYGON_HEX,
  PAYMASTER_ADDRESS,
  PREFERRED_RELAYS,      // e.g. ['https://your-relay.domain']
  FORWARDER_ADDRESS
} from '@/config/addresses'
import { ensureGsnLoaded } from '@/utils/gsn-loader'

/* ------------------------------------------------------------- */
/* Debug logging                                                  */
/* ------------------------------------------------------------- */
const DEBUG = String((import.meta as any)?.env?.VITE_GSN_DEBUG ?? '').toLowerCase() === 'true'
function log(...args: any[])   { if (DEBUG) console.log('[GSN]', ...args) }
function warn(...args: any[])  { if (DEBUG) console.warn('[GSN]', ...args) }
function error(...args: any[]) { if (DEBUG) console.error('[GSN]', ...args) }

/* ------------------------------------------------------------- */
/* Ethers v5/v6 compatibility                                    */
/* ------------------------------------------------------------- */
const E = ethers as any
const JsonRpcProviderCtor = E.JsonRpcProvider ?? E.providers?.JsonRpcProvider      // v6 || v5
const BrowserProviderCtor = E.BrowserProvider ?? E.providers?.Web3Provider         // v6 || v5
function requireCtor(name: string, ctor: any) {
  if (!ctor) throw new Error(`Ethers constructor missing: ${name}. Check ethers version / bundle.`)
  return ctor
}

/* ------------------------------------------------------------- */
/* Minimal EIP-1193 helpers                                      */
/* ------------------------------------------------------------- */
type Eip1193 = { request: (args: { method: string; params?: any[] | object }) => Promise<any> }

function getEthereum(): Eip1193 {
  const eth = (window as any).ethereum as Eip1193 | undefined
  if (!eth || typeof eth.request !== 'function') {
    throw new Error('MetaMask / EIP-1193 Provider not found.')
  }
  return eth
}

/**
 * Ensure Polygon (only when you explicitly call it from a user gesture flow).
 */
async function ensurePolygon(eth: Eip1193) {
  const id = await eth.request({ method: 'eth_chainId' })
  if (id !== POLYGON_HEX) {
    try {
      await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: POLYGON_HEX }] })
    } catch (e: any) {
      if (e?.code === 4902) {
        await eth.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: POLYGON_HEX,
            chainName: 'Polygon Mainnet',
            nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
            rpcUrls: ['https://polygon-rpc.com'],
            blockExplorerUrls: ['https://polygonscan.com/']
          }]
        })
      } else {
        throw e
      }
    }
  }
}

/* ------------------------------------------------------------- */
/* GSN config tuning (avoid huge event scans / -32005)            */
/* ------------------------------------------------------------- */
const DEFAULT_GSN_TUNING = {
  // Smaller windows so the provider won’t query from block 0
  relayLookupWindowBlocks:       120_000,  // ~ a few days on Polygon; tune as you like
  relayRegistrationLookupBlocks: 120_000,
  // Keep pages small to never hit 10k log limits on RPCs
  pastEventsQueryMaxPageSize:     2_000,
  // Fewer extras, quicker path
  auditorsCount: 0,
  // Slightly aggressive gas to get mined faster (paymaster pays)
  gasPriceFactorPercent: 120,
  loggerConfiguration: { logLevel: 'error' as const },
}

/* ------------------------------------------------------------- */
/* Primary factory: OpenGSN RelayProvider + Ethers provider       */
/* ------------------------------------------------------------- */
export async function getGsnEthers(configOverrides: Record<string, any> = {}) {
  log('getGsnEthers(): ensure GSN bundle + build provider…')

  await ensureGsnLoaded()
  const RP = (window as any).gsn?.RelayProvider || (window as any).RelayProvider
  if (!RP) throw new Error('OpenGSN (UMD) not loaded – missing <script src="/vendor/gsn-umd.js">?')

  const effectiveCfg = {
    paymasterAddress:  PAYMASTER_ADDRESS,
    forwarderAddress:  FORWARDER_ADDRESS,
    preferredRelays:   PREFERRED_RELAYS,
    ...DEFAULT_GSN_TUNING,
    ...configOverrides,
  }
  if (DEBUG) {
    const snapshot = { ...effectiveCfg, preferredRelays: (effectiveCfg.preferredRelays ?? []).length }
    log('GSN config:', snapshot)
  }

  const relayProvider = await RP.newProvider({
    provider: (window as any).ethereum,
    config: effectiveCfg
  }).init()

  const BP = requireCtor('BrowserProvider/Web3Provider', BrowserProviderCtor)
  const provider = new BP(relayProvider)               // v6: BrowserProvider, v5: Web3Provider
  const signer = await provider.getSigner()

  log('getGsnEthers(): ready – ethers=', (ethers as any).version, 'ctor=', BP?.name ?? 'unknown')
  return { provider, signer, relayProvider }
}

/* ------------------------------------------------------------- */
/* Staged sender: txHash immediately, receipt via waitReceipt()  */
/* ------------------------------------------------------------- */
export type GsnSendResult = {
  txHash: string
  waitReceipt: (confirmations?: number) => Promise<any> // neutral typing for v5/v6
}

/**
 * Send a GSN tx and return the tx hash immediately; confirm later.
 * Use confirmations=1 on Polygon for a good UX/security trade-off.
 */
export async function gsnSendTx(
  contractAddress: string,
  abi: any[],
  method: string,
  args: any[] = [],
  confirmations = 1
): Promise<GsnSendResult> {
  const { signer } = await getGsnEthers()
  const c = new ethers.Contract(contractAddress, abi, signer)

  log('gsnSendTx(): call', { contractAddress, method, args, confirmations })
  // dynamic method invocation (neutral typing for v5/v6)
  const tx: any = await (c as any)[method](...args)
  const txHash: string = tx.hash
  log('gsnSendTx(): tx submitted', txHash)

  const waitReceipt = async (conf = confirmations) => {
    try {
      const receipt = await tx.wait(conf)
      log('gsnSendTx(): tx confirmed', { txHash, conf })
      return receipt
    } catch (e) {
      error('gsnSendTx(): waitReceipt failed', e)
      throw e
    }
  }
  return { txHash, waitReceipt }
}

/* Back-compat wrapper (DEPRECATED): wait immediately via staged sender. */
export async function gsnTx(
  address: string,
  abi: any[],
  method: string,
  args: any[] = [],
  overrides: Record<string, any> = {}
) {
  const res = await gsnSendTx(address, abi, method, overrides ? [...args, overrides] : args, 1)
  return res.waitReceipt(1)
}

/* ------------------------------------------------------------- */
/* Explicit signer (requests accounts + ensure chain).           */
/* Only call from user-gesture flows (e.g., a Connect button).   */
/* ------------------------------------------------------------- */
export async function getGsnSigner() {
  const eth = getEthereum()
  await eth.request({ method: 'eth_requestAccounts' })
  await ensurePolygon(eth)

  const RP = (window as any).gsn?.RelayProvider || (window as any).RelayProvider
  if (!RP) throw new Error('OpenGSN (UMD) not loaded – missing <script src="/vendor/gsn-umd.js">?')

  const effectiveCfg = {
    paymasterAddress:  PAYMASTER_ADDRESS,
    preferredRelays:   PREFERRED_RELAYS,
    ...DEFAULT_GSN_TUNING,
  }
  if (DEBUG) log('getGsnSigner(): config', effectiveCfg)

  const gsnProvider = await RP.newProvider({
    provider: eth,
    config: effectiveCfg
  }).init()

  const BP = requireCtor('BrowserProvider/Web3Provider', BrowserProviderCtor)
  const provider = new BP(gsnProvider)
  const signer = await provider.getSigner()
  log('getGsnSigner(): signer ready')
  return signer
}

/* ------------------------------------------------------------- */
/* Read-only JSON-RPC (v6/v5 compatible)                         */
/* ------------------------------------------------------------- */
export function readRpc() {
  const JRP = requireCtor('JsonRpcProvider', JsonRpcProviderCtor)
  const rpc = new JRP('https://polygon-rpc.com', {
    name: 'matic',
    chainId: Number(CHAIN_ID) || 137
  })
  log('readRpc(): created')
  return rpc
}

/* ------------------------------------------------------------- */
/* Helpers                                                       */
/* ------------------------------------------------------------- */
export function txExplorerUrl(txHash: string) {
  const id = Number(CHAIN_ID || 137)
  const base = id === 80001 ? 'https://mumbai.polygonscan.com' : 'https://polygonscan.com'
  return `${base}/tx/${txHash}`
}
