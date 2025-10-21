// src/lib/logs.ts
import { ethers } from 'ethers'
import { readRpc } from '@/lib/gsn-client.v5'

export const TOPIC = {
  Transfer: ethers.utils.id('Transfer(address,address,uint256)'),
  RoleGranted: ethers.utils.id('RoleGranted(bytes32,address,address)'),
  RoleRevoked: ethers.utils.id('RoleRevoked(bytes32,address,address)'),
}
export const ZERO32 = ethers.utils.hexZeroPad(ethers.constants.AddressZero, 32)
export const pad32 = (addr: string) => ethers.utils.hexZeroPad(addr, 32)

function isRangeError(e: any) {
  const msg = String(e?.message || '').toLowerCase()
  return (
    e?.code === -32062 || e?.code === -32005 || // provider-spezifische Codes
    msg.includes('block range is too large') ||
    msg.includes('response size exceeded') ||
    msg.includes('limit exceeded') ||
    msg.includes('query timeout') ||
    msg.includes('timeout')
  )
}

/** Holt Logs fensterweise und schrumpft das Fenster automatisch bei RPC-Fehlern. */
export async function getLogsChunked(opts: {
  address: string
  topics: (string | string[] | null)[]
  fromBlock: number
  toBlock?: number
  step?: number
}) {
  const provider = readRpc()
  const latest = opts.toBlock ?? (await provider.getBlockNumber())
  let step = Math.max( (opts.step ?? 2_000), 128 )  // Default konservativ
  const out: ethers.providers.Log[] = []

  for (let from = opts.fromBlock; from <= latest; ) {
    let to = Math.min(latest, from + step)
    try {
      const logs = await provider.getLogs({
        address: opts.address,
        topics: opts.topics,
        fromBlock: from,
        toBlock: to,
      })
      out.push(...logs)
      from = to + 1 // nächster Chunk (ohne Überschneidung)
    } catch (e) {
      if (!isRangeError(e) || step <= 128) throw e
      // Fenster halbieren und denselben Bereich nochmal versuchen
      step = Math.floor(step / 2)
      // (from bleibt gleich, to wird im nächsten Loop kleiner gesetzt)
    }
  }
  return out
}
