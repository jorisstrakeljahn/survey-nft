// TypeScript: env.d.ts
interface ImportMetaEnv {
  readonly VITE_CHAIN_ID_HEX?: string;
  readonly VITE_CHAIN_ID_DEC?: string;
  readonly VITE_NETWORK_NAME?: string;
  readonly VITE_RPC_URL?: string;
  readonly VITE_BLOCK_EXPLORER?: string;
  readonly VITE_ERC721_ADDRESS?: string;
  readonly VITE_FORWARDER_ADDRESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    ethereum?: unknown;
  }
}
export {};
