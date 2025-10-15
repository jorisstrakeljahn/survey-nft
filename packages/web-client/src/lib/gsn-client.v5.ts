// src/lib/gsn-client.v4.ts
import { ethers } from 'ethers';
import {
  CHAIN_ID, POLYGON_HEX,
  PAYMASTER_ADDRESS, PREFERRED_RELAYS
} from '@/config/addresses';

type Eip1193 = { request: (args: { method: string; params?: any[] | object }) => Promise<any> };

function getEthereum(): Eip1193 {
  const eth = (window as any).ethereum as Eip1193 | undefined;
  if (!eth || typeof eth.request !== 'function') {
    throw new Error('MetaMask / EIP-1193 Provider nicht gefunden.');
  }
  return eth;
}

async function ensurePolygon(eth: Eip1193) {
  const id = await eth.request({ method: 'eth_chainId' });
  if (id !== POLYGON_HEX) {
    try {
      await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: POLYGON_HEX }] });
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
        });
      } else {
        throw e;
      }
    }
  }
}

export async function getGsnSigner() {
  const eth = getEthereum();
  await eth.request({ method: 'eth_requestAccounts' });
  await ensurePolygon(eth);

  const RP = (window as any).gsn?.RelayProvider || (window as any).RelayProvider;
  if (!RP) throw new Error('OpenGSN (UMD) nicht geladen – fehlt <script src="/vendor/gsn-umd.js">?');

  const config = {
    paymasterAddress:  PAYMASTER_ADDRESS,

    // ⬇️ wichtig gegen 10k-Log-Limit
    relayLookupWindowBlocks:       10_000,  // wie in deinem claim.js
    relayRegistrationLookupBlocks: 10_000,
    pastEventsQueryMaxPageSize:     5_000,

    preferredRelays:   PREFERRED_RELAYS,   // z.B. enzyme
    auditorsCount:     0,
    loggerConfiguration: { logLevel: 'error' },
  } as any;

  const gsnProvider = await RP.newProvider({ provider: eth, config }).init();

  // ethers v5
  const provider = new ethers.providers.Web3Provider(gsnProvider as any, 'any');
  return provider.getSigner();
}

export async function gsnTx(
  address: string,
  abi: readonly string[],
  method: string,
  args: any[] = [],
  overrides: Record<string, any> = {}
) {
  const signer = await getGsnSigner();
  const c = new ethers.Contract(address, abi, signer);
  const tx = await (c as any)[method](...args, overrides);
  return tx.wait();
}

export function readRpc() {
  return new ethers.providers.JsonRpcProvider(
    'https://polygon-rpc.com',
    { name: 'matic', chainId: CHAIN_ID }
  );
}
