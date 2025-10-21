import { ethers } from 'ethers'
import { config } from '@/config'

type Hex = `0x${string}`

export async function getCurrentChainIdHex(
  provider: ethers.providers.Web3Provider,
): Promise<Hex> {
  return (await provider.send('eth_chainId', [])) as Hex
}

export function getExpectedChainIdDec(): number {
  return Number(config.SUPPORTED_CHAIN_ID) || 137
}

export function toHex(id: number | string): Hex {
  const n = Number(id)
  return ('0x' + n.toString(16)) as Hex
}

export function hexToDec(hex: string): number {
  return parseInt(hex, 16)
}

export async function isOnSupportedChain(
  provider: ethers.providers.Web3Provider,
): Promise<boolean> {
  const currentHex = await getCurrentChainIdHex(provider)
  const current = hexToDec(currentHex)
  const expected = getExpectedChainIdDec()
  return current === expected
}

export function chainLabelFromId(id?: number | string): string {
  const n = Number(id)
  if (n === 137) return 'Polygon Mainnet'
  if (n === 80001) return 'Polygon Mumbai'
  return `Chain ${id ?? 'unbekannt'}`
}
