// Minimaler EIP-1193 Typ
export interface Eip1193Provider {
  request?: (args: {
    method: string; params?: unknown[] | Record<string, unknown>
  }) => Promise<unknown>
  on?: (...args: unknown[]) => void
  isMetaMask?: boolean
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider
  }
}

export {}
