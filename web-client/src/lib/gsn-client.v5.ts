// src/lib/gsn-client.v5.ts
import { ethers } from 'ethers'
import {
  CHAIN_ID,
  POLYGON_HEX,
  PAYMASTER_ADDRESS,
  PREFERRED_RELAYS,
  FORWARDER_ADDRESS
} from '@/config/addresses'
import { ensureGsnLoaded } from '@/utils/gsn-loader'

/* ------------------ Debug + Timing ------------------ */
// Aktiviert, wenn VITE_GSN_DEBUG ODER VITE_ADMIN_DEBUG truthy ist
const RAW_DBG = (import.meta as any)?.env?.VITE_GSN_DEBUG ?? (import.meta as any)?.env?.VITE_ADMIN_DEBUG ?? ''
const DEBUG = /^(1|true|yes|on)$/i.test(String(RAW_DBG))
const log  = (...a:any[]) => { if (DEBUG) console.log('[GSN]', ...a) }
const warn = (...a:any[]) => { if (DEBUG) console.warn('[GSN]', ...a) }
const err  = (...a:any[]) => { if (DEBUG) console.error('[GSN]', ...a) }
const now  = () => performance.now()
const fmt  = (ms:number) => `${ms.toFixed(0)} ms (${(ms/1000).toFixed(3)} s)`

/* ------------------ Ethers v5/v6 compat -------------- */
const E:any = ethers as any
const JsonRpcProviderCtor = E.JsonRpcProvider ?? E.providers?.JsonRpcProvider
const BrowserProviderCtor = E.BrowserProvider ?? E.providers?.Web3Provider
function requireCtor(name:string, ctor:any){ if(!ctor) throw new Error(`Ethers ctor missing: ${name}`); return ctor }

/* ------------------ EIP-1193 helpers ----------------- */
type Eip1193 = { request: (args:{method:string; params?:any[]|object}) => Promise<any> }
function getEthereum():Eip1193 {
  const eth = (window as any).ethereum as Eip1193|undefined
  if(!eth || typeof eth.request!=='function') throw new Error('MetaMask / EIP-1193 Provider not found.')
  return eth
}
async function ensurePolygon(eth:Eip1193){
  const id = await eth.request({ method:'eth_chainId' })
  if(id !== POLYGON_HEX){
    try {
      await eth.request({ method:'wallet_switchEthereumChain', params:[{ chainId: POLYGON_HEX }] })
    } catch (e:any) {
      if(e?.code === 4902){
        await eth.request({ method:'wallet_addEthereumChain', params:[{
            chainId: POLYGON_HEX, chainName:'Polygon Mainnet',
            nativeCurrency:{ name:'MATIC', symbol:'MATIC', decimals:18 },
            rpcUrls:['https://polygon-rpc.com'], blockExplorerUrls:['https://polygonscan.com/']
          }]})
      } else { throw e }
    }
  }
}

/* -------------- GSN tuning: kleines Fenster  ---------- */
const DEFAULT_GSN_TUNING = {
  relayLookupWindowBlocks:       20_000,
  relayRegistrationLookupBlocks: 20_000,
  pastEventsQueryMaxPageSize:     1_000,
  auditorsCount: 0,
  gasPriceFactorPercent: 120,
  loggerConfiguration: { logLevel: 'error' as const },
}

/* -------------- Factory: RelayProvider + Ethers -------- */
export async function getGsnEthers(configOverrides:Record<string,any> = {}){
  const t0 = now()
  log('getGsnEthers(): ensure bundle + build provider…')

  const tBundle = now()
  await ensureGsnLoaded()
  log('getGsnEthers(): bundle loaded in', fmt(now()-tBundle))

  const RP = (window as any).gsn?.RelayProvider || (window as any).RelayProvider
  if(!RP) throw new Error('OpenGSN (UMD) not loaded – missing <script src="/vendor/gsn-umd.js">?')

  const effectiveCfg = {
    paymasterAddress:  PAYMASTER_ADDRESS,
    forwarderAddress:  FORWARDER_ADDRESS,
    preferredRelays:   PREFERRED_RELAYS,
    ...DEFAULT_GSN_TUNING,
    ...configOverrides
  }
  // Immer einmal konfigur. Snapshot ausgeben – hilft enorm beim Debuggen
  console.info('[GSN] config snapshot', {
    preferredRelays: effectiveCfg.preferredRelays,
    relayLookupWindowBlocks: effectiveCfg.relayLookupWindowBlocks,
    relayRegistrationLookupBlocks: effectiveCfg.relayRegistrationLookupBlocks,
    pastEventsQueryMaxPageSize: effectiveCfg.pastEventsQueryMaxPageSize
  })

  const tInit = now()
  const relayProvider = await RP.newProvider({ provider:(window as any).ethereum, config: effectiveCfg }).init()
  log('getGsnEthers(): provider init (discovery) took', fmt(now()-tInit))

  const BP = requireCtor('BrowserProvider/Web3Provider', BrowserProviderCtor)
  const tSigner = now()
  const provider = new BP(relayProvider)
  const signer = await provider.getSigner()
  log('getGsnEthers(): getSigner took', fmt(now()-tSigner), '| total', fmt(now()-t0), '| ethers', (ethers as any).version)

  return { provider, signer, relayProvider }
}

/* -------------- Staged sender -------------------------- */
export type GsnSendResult = {
  txHash: string
  waitReceipt: (confirmations?:number)=>Promise<any>
}

export async function gsnSendTx(
  contractAddress:string,
  abi:any[],
  method:string,
  args:any[] = [],
  confirmations = 1
): Promise<GsnSendResult> {
  const t0 = now()
  const { signer } = await getGsnEthers()
  const c = new ethers.Contract(contractAddress, abi, signer)

  const tCall = now()
  log('gsnSendTx(): call', { method, args })
  const tx:any = await (c as any)[method](...args)
  const tHash = now()
  const txHash:string = tx.hash
  log('gsnSendTx(): tx submitted', { txHash, callLatency: fmt(tHash - tCall), e2eToHash: fmt(tHash - t0) })

  const waitReceipt = async (conf = confirmations) => {
    const tWait = now()
    try {
      const receipt = await tx.wait(conf)
      log('gsnSendTx(): tx confirmed', { txHash, conf, mineLatency: fmt(now()-tWait), totalE2E: fmt(now()-t0) })
      return receipt
    } catch(e){
      err('gsnSendTx(): waitReceipt failed', e)
      throw e
    }
  }
  return { txHash, waitReceipt }
}

/* -------------- Back-compat wrapper -------------------- */
export async function gsnTx(address:string, abi:any[], method:string, args:any[] = [], overrides:Record<string,any> = {}){
  const res = await gsnSendTx(address, abi, method, overrides ? [...args, overrides] : args, 1)
  return res.waitReceipt(1)
}

/* -------------- Explicit signer (user gesture) ---------- */
export async function getGsnSigner(){
  const eth = getEthereum()
  await eth.request({ method:'eth_requestAccounts' })
  await ensurePolygon(eth)

  const RP = (window as any).gsn?.RelayProvider || (window as any).RelayProvider
  if(!RP) throw new Error('OpenGSN (UMD) not loaded – missing <script src="/vendor/gsn-umd.js">?')

  const effectiveCfg = { paymasterAddress: PAYMASTER_ADDRESS, preferredRelays: PREFERRED_RELAYS, ...DEFAULT_GSN_TUNING }
  log('getGsnSigner(): config', effectiveCfg)

  const tInit = now()
  const gsnProvider = await RP.newProvider({ provider: eth, config: effectiveCfg }).init()
  log('getGsnSigner(): provider init took', fmt(now()-tInit))

  const BP = requireCtor('BrowserProvider/Web3Provider', BrowserProviderCtor)
  const provider = new BP(gsnProvider)
  const signer = await provider.getSigner()
  log('getGsnSigner(): signer ready')
  return signer
}

/* -------------- Read-only RPC -------------------------- */
export function readRpc(){
  const JRP = requireCtor('JsonRpcProvider', JsonRpcProviderCtor)
  const rpc = new JRP('https://polygon-rpc.com', { name:'matic', chainId: Number(CHAIN_ID) || 137 })
  log('readRpc(): created')
  return rpc
}

/* -------------- Helpers -------------------------------- */
export function txExplorerUrl(txHash:string){
  const id = Number(CHAIN_ID || 137)
  const base = id === 80001 ? 'https://mumbai.polygonscan.com' : 'https://polygonscan.com'
  return `${base}/tx/${txHash}`
}
