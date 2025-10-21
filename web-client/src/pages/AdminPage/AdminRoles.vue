<!-- src/pages/AdminPage/AdminRoles.vue -->
<template>
  <section class="box">
    <h2>{{ t('admin.roles.title') }}</h2>
    <div class="help">{{ t('admin.roles.help') }}</div>

    <!-- Inline role editor: enter address, grant/revoke, clear -->
    <div class="roles-line">
      <input
        v-model="roleAddr"
        :placeholder="t('admin.roles.placeholder')"
        @keyup.enter="checkRole"
        @keydown.esc="clear"
      />
      <div class="roles-actions">
        <button
          class="btn"
          :disabled="!canManage || !isAddress(roleAddr) || isBusy"
          @click="grantRole"
        >
          {{ t('admin.roles.grant') }}
        </button>
        <button
          class="btn btn--ghost"
          :disabled="!canManage || !isAddress(roleAddr) || isBusy"
          @click="revokeRole"
        >
          {{ t('admin.roles.revoke') }}
        </button>
        <button class="btn btn--ghost" :disabled="isBusy" @click="clear">
          {{ t('common.clear') }}
        </button>
      </div>
    </div>

    <!-- Inline status / loader -->
    <div class="help" :class="{ 'help--error': isErr }" v-if="roleMsg">
      {{ roleMsg }}
    </div>
    <Loader v-if="isBusy" style="margin-top:8px;" />
  </section>

  <!-- Role members overview (derived from on-chain events) -->
  <section class="box" style="margin-top:12px;">
    <h3>{{ t('admin.rolesView.heading') }}</h3>

    <!-- Long-running scan state with progress & cancel -->
    <div v-if="scan.active" class="scanbox">
      <div class="scanrow">
        <strong>{{ t('admin.rolesView.progress.scanning', { role: scan.roleLabel }) }}</strong>
        <span>
          {{ scan.pct }}%
          ({{ scan.processed.toLocaleString() }}/{{ scan.total.toLocaleString() }}
          {{ t('admin.rolesView.progress.blocks') }})
        </span>
      </div>
      <div class="progress"><div class="bar" :style="{ width: scan.pct + '%' }"></div></div>
      <div class="scanrow">
        <span>{{ t('admin.rolesView.progress.foundLabel') }} {{ scan.found }}</span>
        <button class="btn btn--ghost" @click="cancelScan()" :disabled="!scan.active">
          {{ t('admin.rolesView.progress.cancel') }}
        </button>
      </div>
    </div>

    <!-- Quick mode reduces scan window to recent N blocks -->
    <label class="scanrow" style="margin:8px 0;">
      <input type="checkbox" v-model="quickMode" :disabled="scan.active" />
      <span style="margin-left:6px;">
        {{ t('admin.rolesView.quick', { count: QUICK_BLOCKS.toLocaleString() }) }}
      </span>
    </label>

    <!-- Members loading/err states -->
    <div v-if="membersLoading"><Loader /></div>

    <template v-else>
      <div class="role-block">
        <h4>{{ t('admin.rolesView.roleNames.deleter') }}</h4>
        <ul v-if="deleters.length">
          <li v-for="a in deleters" :key="a" class="mono">{{ a }}</li>
        </ul>
        <div v-else class="help">{{ t('admin.rolesView.noneFound') }}</div>
      </div>

      <div class="role-block" style="margin-top:10px;">
        <h4>{{ t('admin.rolesView.roleNames.admin') }}</h4>
        <ul v-if="admins.length">
          <li v-for="a in admins" :key="a" class="mono">{{ a }}</li>
        </ul>
        <div v-else class="help">{{ t('admin.rolesView.noneFound') }}</div>
      </div>

      <div class="help help--error" v-if="membersErr" style="margin-top:8px;">
        {{ membersErr }}
      </div>
    </template>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ethers } from 'ethers'
import Loader from '@/common/Loader.vue'
import { gsnTx, readRpc } from '@/lib/gsn-client.v5'
import { NFT_ADDRESS, SURVEY_NFT_DEPLOY_BLOCK } from '@/config/addresses'
import { ABI_SURVEY_NFT } from '@/abi/surveyNft'

const { t } = useI18n({ useScope: 'global' })
defineProps<{ canManage?: boolean; isDeleter?: boolean }>()

/** --- UI state (input, inline status, busy flag) --- */
const roleAddr = ref(''); const roleMsg = ref(''); const isErr = ref(false); const isBusy = ref(false)

/** --- Role IDs --- */
const deleterRole = ref<string>('')                 // loaded from contract (DELETER_ROLE)
const DEFAULT_ADMIN_ROLE = '0x' + '00'.repeat(32)   // OpenZeppelin AccessControl default admin (0x00…00)

/** --- Members view state --- */
const membersLoading = ref(false)
const membersErr = ref<string|null>(null)
const deleters = ref<string[]>([])
const admins  = ref<string[]>([])

/** --- Scan progress state & controls --- */
const scan = reactive({
  active:false, roleLabel:'', processed:0, total:0, pct:0, found:0
})
let _scanCancel = false
function cancelScan(){ _scanCancel = true }

/** Quick mode: scan only recent N blocks to keep UI responsive on first load */
const QUICK_BLOCKS = 200_000
const quickMode = ref(true)

/** --- Small helpers (sleep, hex, EIP-1193 access, address checks) --- */
const sleep = (ms:number)=> new Promise(r=>setTimeout(r, ms))
const toHex = (n:number)=> '0x' + Math.max(0,n).toString(16)

/** Prefer EIP-1193 provider from the user (MetaMask/Wallet) for getLogs throttling */
function getEth() {
  const eth = (window as any).ethereum
  if (!eth?.request) throw new Error('MetaMask/EIP-1193 nicht verfügbar')
  return eth
}
async function getLatestBlockViaWallet(): Promise<number> {
  const hex = await getEth().request({ method: 'eth_blockNumber' })
  return parseInt(String(hex), 16)
}
function isAddress (s: string) { return /^0x[a-fA-F0-9]{40}$/.test((s || '').trim()) }
function short (addr: string) { return addr ? `${addr.slice(0,6)}…${addr.slice(-4)}` : '' }
function clear () { roleAddr.value=''; roleMsg.value=''; isErr.value=false }

/** --- One-time contract read: fetch DELETER_ROLE id --- */
async function loadDeleterRole () {
  const rpc = readRpc()
  const c = new ethers.Contract(NFT_ADDRESS, ['function DELETER_ROLE() view returns (bytes32)'], rpc)
  deleterRole.value = await c.DELETER_ROLE()
}

/** --- Single address check against DELETER_ROLE --- */
async function hasDeleterRole (addr: string): Promise<boolean> {
  if (!deleterRole.value) await loadDeleterRole()
  const rpc = readRpc()
  const c = new ethers.Contract(
    NFT_ADDRESS,
    ['function hasRole(bytes32 role, address account) view returns (bool)'],
    rpc
  )
  return c.hasRole(deleterRole.value, addr)
}

/**
 * --- Wallet-backed, paginated getLogs with backoff & progress ---
 * We query logs directly via the user's provider (EIP-1193) to avoid strict
 * public RPC rate limits. On errors (throttling/window too wide), we halve the
 * window and retry; if already minimal, we skip the window to keep UI snappy.
 */
async function getLogsPagedViaWalletOR(
  address: string,
  topics: (string | string[])[],
  fromBlock: number,
  toBlock: number,
  onPage?: (logs:any[], range:{from:number;to:number})=>void,
  onProgress?: (info:{processed:number; total:number})=>void,
) {
  let step = 2000          // start small to reduce throttling risk
  let cur  = fromBlock
  const total = Math.max(0, toBlock - fromBlock + 1)
  let processed = 0
  const out:any[] = []

  while (cur <= toBlock) {
    if (_scanCancel) throw new Error('scan_cancelled')
    const end = Math.min(cur + step - 1, toBlock)
    const filter = { address, fromBlock: toHex(cur), toBlock: toHex(end), topics }
    try {
      const page = await getEth().request({ method:'eth_getLogs', params:[filter] })
      out.push(...page)
      onPage?.(page, { from:cur, to:end })
      processed += (end - cur + 1)
      onProgress?.({ processed, total })
      cur = end + 1
      await sleep(150) // cooperative yielding
    } catch (e: unknown) {
      // Visible handling + diagnostics for linters and support
      const msg = e instanceof Error ? e.message : String(e)
      console.warn('AdminRoles window failed — backing off', { msg, step, cur, end })

      // Backoff: halve the window; if already minimal, skip to preserve UX
      step = Math.max(Math.floor(step / 2), 500)
      if (step <= 500) {
        processed += (end - cur + 1)
        onProgress?.({ processed, total })
        cur = end + 1
      }
      await sleep(300)
    }
  }
  return out
}

/**
 * --- Reconstruct role members from RoleGranted/RoleRevoked events ---
 * Uses a local cache (last scanned block + members) per role to keep rescans fast.
 * UI stays responsive via progress updates and a cancel path.
 */
async function loadRoleMembersViaEvents () {
  membersErr.value = null
  membersLoading.value = true
  deleters.value = []; admins.value = []

  try {
    const latestChain = await getLatestBlockViaWallet()
    const latestStart = quickMode.value
      ? Math.max(SURVEY_NFT_DEPLOY_BLOCK, latestChain - QUICK_BLOCKS)
      : SURVEY_NFT_DEPLOY_BLOCK

    if (!deleterRole.value) await loadDeleterRole()

    const iface = new ethers.utils.Interface([
      'event RoleGranted(bytes32 indexed role,address indexed account,address indexed sender)',
      'event RoleRevoked(bytes32 indexed role,address indexed account,address indexed sender)',
    ])
    const TOPIC_GRANTED = iface.getEventTopic('RoleGranted')
    const TOPIC_REVOKED = iface.getEventTopic('RoleRevoked')

    // Scans one role id and returns the current member set (sorted)
    async function scanRole(roleId: string, label:string, seed:string[] = []) {
      const cacheKey = `roles:${NFT_ADDRESS}:${roleId}`
      const cached = JSON.parse(localStorage.getItem(cacheKey) || '{}') as { members?: string[]; last?: number }
      const start = Math.max(latestStart, (cached.last ?? latestStart) + 1)
      const set = new Set<string>([...seed, ...(cached.members || [])].map(s => s.toLowerCase()))

      // Init progress
      scan.active = true; scan.roleLabel = label; _scanCancel = false
      scan.processed = 0; scan.total = Math.max(0, latestChain - start + 1); scan.pct = scan.total ? 0 : 100
      scan.found = set.size

      // We OR the topics so a single window returns both grant & revoke events
      const topics:(string|string[])[] = [[TOPIC_GRANTED, TOPIC_REVOKED], roleId]

      if (start <= latestChain) {
        await getLogsPagedViaWalletOR(
          NFT_ADDRESS, topics, start, latestChain,
          // onPage: fold logs into the current member set
          (logs) => {
            for (const lg of logs) {
              const parsed = iface.parseLog(lg)
              const acc = ethers.utils.getAddress(parsed.args.account).toLowerCase()
              if (parsed.name === 'RoleGranted') set.add(acc)
              else set.delete(acc)
            }
            scan.found = set.size
          },
          // onProgress: update progress bar
          ({ processed, total }) => {
            scan.processed = processed
            scan.total = total
            scan.pct = total ? Math.min(100, Math.round(processed/total*100)) : 100
          }
        )
        localStorage.setItem(cacheKey, JSON.stringify({ members: Array.from(set), last: latestChain }))
      } else {
        // Already up-to-date
        scan.pct = 100
      }

      scan.active = false
      return Array.from(set).sort()
    }

    // 1) DELETER_ROLE members
    deleters.value = await scanRole(deleterRole.value, t('admin.rolesView.roleNames.deleter'), deleters.value)
    // 2) DEFAULT_ADMIN_ROLE members
    admins.value   = await scanRole(DEFAULT_ADMIN_ROLE, t('admin.rolesView.roleNames.admin'), admins.value)

  } catch (e:any) {
    // User-cancel is expected; anything else is an error worth surfacing
    membersErr.value = e?.message === 'scan_cancelled'
      ? t('admin.rolesView.scan.cancelled')
      : t('admin.rolesView.scan.failed')
  } finally {
    scan.active = false
    membersLoading.value = false
  }
}

/** --- UI actions --------------------------------------------------------- */

/** Quick single-check: does the given address have DELETER_ROLE? */
async function checkRole () {
  roleMsg.value = ''; isErr.value = false
  const a = roleAddr.value.trim()
  if (!isAddress(a)) { roleMsg.value = t('admin.roles.invalid'); isErr.value = true; return }
  try {
    isBusy.value = true
    const has = await hasDeleterRole(a)
    roleMsg.value = has ? t('admin.badges.deleter') : t('admin.badges.noDeleter')
  } catch {
    roleMsg.value = t('admin.roles.error'); isErr.value = true
  } finally {
    isBusy.value = false
  }
}

/** Grant DELETER_ROLE (gasless via GSN), then verify and refresh list lazily */
async function grantRole () {
  roleMsg.value=''; isErr.value=false
  const a = roleAddr.value.trim()
  if (!isAddress(a)) { roleMsg.value = t('admin.roles.invalid'); isErr.value = true; return }
  try {
    isBusy.value = true
    if (!deleterRole.value) await loadDeleterRole()
    await gsnTx(NFT_ADDRESS, ABI_SURVEY_NFT, 'grantRole', [deleterRole.value, a])

    // Optimistic UI update
    const al = a.toLowerCase()
    if (!deleters.value.includes(al)) {
      deleters.value = [...deleters.value, al].sort()
    }

    // Verify (read) and message
    const has = await hasDeleterRole(a)
    roleMsg.value = has ? t('admin.roles.granted', { addr: short(a) }) : t('admin.roles.error')
    isErr.value = !has

    // Reconcile in the background (event-driven)
    loadRoleMembersViaEvents().catch(()=>{})
  } catch {
    roleMsg.value = t('admin.roles.error'); isErr.value = true
  } finally {
    isBusy.value = false
  }
}

/** Revoke DELETER_ROLE (gasless via GSN), then verify and refresh list lazily */
async function revokeRole () {
  roleMsg.value=''; isErr.value=false
  const a = roleAddr.value.trim()
  if (!isAddress(a)) { roleMsg.value = t('admin.roles.invalid'); isErr.value = true; return }
  try {
    isBusy.value = true
    if (!deleterRole.value) await loadDeleterRole()
    await gsnTx(NFT_ADDRESS, ABI_SURVEY_NFT, 'revokeRole', [deleterRole.value, a])

    // Optimistic UI update
    const al = a.toLowerCase()
    deleters.value = deleters.value.filter(x => x !== al)

    // Verify (read) and message
    const has = await hasDeleterRole(a)
    roleMsg.value = !has ? t('admin.roles.revoked', { addr: short(a) }) : t('admin.roles.error')
    isErr.value = has

    // Reconcile in the background (event-driven)
    loadRoleMembersViaEvents().catch(()=>{})
  } catch {
    roleMsg.value = t('admin.roles.error'); isErr.value = true
  } finally {
    isBusy.value = false
  }
}

/** --- Init: prefetch role id, then build members lists (with cache) --- */
onMounted(async () => {
  try { await loadDeleterRole() } finally { await loadRoleMembersViaEvents() }
})

/** Future hook: re-scan on quickMode change if desired */
watch(() => quickMode.value, () => { /* optional: trigger a fresh scan */ })
</script>


<style scoped>
.box {
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
  padding: 14px;
}

.help {
  font-size: 0.95rem;
  color: #555;
  margin-top: 8px;
}

.help--error {
  color: #b00020;
}

.roles-line {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
}

.roles-line input {
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  min-width: 260px;
}

.roles-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 6px 10px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  background: #fff;
  font-weight: 700;
  cursor: pointer;
}

.btn--ghost {
  background: #fafafa;
}

.role-block ul {
  margin: 6px 0 0 0;
  padding: 0 0 0 16px;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}

.scanbox {
  border: 1px dashed #eee;
  border-radius: 10px;
  padding: 10px;
  margin: 8px 0;
  background: #fafafa;
}

.scanrow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.progress {
  height: 8px;
  border-radius: 999px;
  background: #eee;
  margin: 6px 0;
  overflow: hidden;
}

.progress .bar {
  height: 100%;
  background: #4f46e5;
  transition: width .2s ease;
}
</style>
