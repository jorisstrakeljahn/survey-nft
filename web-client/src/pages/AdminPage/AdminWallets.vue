<!-- src/pages/AdminPage/AdminWallets.vue -->
<template>
  <!-- Search -->
  <section class="box">
    <h2>{{ t('admin.search.title') }}</h2>
    <div class="search">
      <input
        v-model="walletInput"
        :placeholder="t('admin.search.placeholder')"
        @keyup.enter="loadWallet"
        @keydown.esc="clear"
      />
      <button class="btn" @click="loadWallet">{{ t('admin.search.load') }}</button>
      <button class="btn btn--ghost" @click="clear">{{ t('common.clear') }}</button>
    </div>
    <div v-if="searchError" class="help help--error">{{ searchError }}</div>
  </section>

  <!-- KPIs -->
  <section v-if="hasResult" class="kpis">
    <div class="kpi">
      <div class="kpi__label">{{ t('admin.kpis.address') }}</div>
      <div class="kpi__value">{{ short(target) }}</div>
    </div>
    <div class="kpi">
      <div class="kpi__label">{{ t('admin.kpis.nfts') }}</div>
      <div class="kpi__value">{{ tokens.length }}</div>
    </div>
    <div class="kpi">
      <div class="kpi__label">{{ t('admin.kpis.points') }}</div>
      <div class="kpi__value">{{ totalPoints }}</div>
    </div>
  </section>

  <!-- Loader / Error / Empty -->
  <loader v-if="isLoading" class="admin__loader" />
  <section v-if="!isLoading && hasError" class="state state--error">
    <h3>{{ t('admin.error.title') }}</h3>
    <p>{{ t('admin.error.text') }}</p>
  </section>
  <section v-if="!isLoading && hasResult && tokens.length === 0" class="state state--empty">
    <h3>{{ t('admin.empty.title') }}</h3>
    <p>{{ t('admin.empty.text') }}</p>
  </section>

  <!-- Burn actions + table -->
  <section v-if="!isLoading && hasResult && tokens.length > 0" class="box">
    <div class="box-head">
      <h2 class="box-title">{{ t('admin.table.title') }}</h2>
      <button class="btn btn--danger" :disabled="!isDeleter || isSending" @click="confirmBurnAll">
        {{ t('admin.actions.burnAll') }}
      </button>
    </div>

    <div v-if="pending.length" class="pending">
      <div class="pending__item" v-for="p in pending" :key="p.hash">
        <span class="pending__label">{{ p.label }}</span>
        <a class="link-btn" :href="txExplorerUrl(p.hash)" target="_blank" rel="noopener">Explorer</a>
        <span class="pill" :class="{
      'pill--pending': p.state==='pending',
      'pill--ok': p.state==='confirmed',
      'pill--err': p.state==='failed'
    }">
      {{ p.state }}
    </span>
      </div>
    </div>

    <div class="table">
      <div class="thead">
        <div>{{ t('admin.table.token') }}</div>
        <div>{{ t('admin.table.points') }}</div>
        <div>{{ t('admin.table.links') }}</div>
        <div>{{ t('admin.table.action') }}</div>
      </div>

      <div class="trow" v-for="tkn in tokens" :key="tkn.tokenId">
        <div class="cell">{{ tkn.tokenId }}</div>
        <div class="cell">{{ tkn.points ?? 0 }}</div>
        <div class="cell cell--links">
          <button class="link-btn" @click="openMeta(tkn)">{{ t('admin.table.metadata') }}</button>
          <button class="link-btn" @click="openExplorer(tkn.tokenId)">{{ t('admin.table.explorer') }}</button>
        </div>
        <div class="cell">
          <button class="btn btn--danger" :disabled="!isDeleter || isSending || isRowBusy(tkn.tokenId)" @click="confirmBurnOne(tkn.tokenId)">
            {{ t('admin.table.burn') }}
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Metadata modal -->
  <nft-metadata-modal
    v-if="showMeta && metaToken"
    :open="showMeta"
    @close="showMeta = false"
    :token-id="metaToken.tokenId"
    :token-uri="metaToken.uri"
    :owner="metaToken.owner"
    :points="metaToken.points"
    :contract-address="erc721Address"
    :explorer-base="explorerBase"
  />
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Loader from '@/common/Loader.vue'
import NftMetadataModal from '@/common/NftMetadataModal.vue'
import { useErc721 } from '@/composables/contracts/use-erc721'
import { config } from '@/config'
import { gsnSendTx, txExplorerUrl } from '@/lib/gsn-client.v5'
import { NFT_ADDRESS } from '@/config/addresses'
import { ABI_SURVEY_NFT } from '@/abi/surveyNft'

/* ------------------------ Debug + Timing ------------------------ */
/** Aktivieren mit VITE_ADMIN_DEBUG=true (Vite-Env) */
const ADMIN_DEBUG =
  String((import.meta as any)?.env?.VITE_ADMIN_DEBUG ?? '').toLowerCase() === 'true'
const dbg  = (...a: any[]) => { if (ADMIN_DEBUG) console.log('[AdminWallets]', ...a) }
const dbgW = (...a: any[]) => { if (ADMIN_DEBUG) console.warn('[AdminWallets]', ...a) }
const dbgE = (...a: any[]) => { if (ADMIN_DEBUG) console.error('[AdminWallets]', ...a) }

/** Timing-Helfer */
const now = () => performance.now()
const fmt = (ms: number) => `${ms.toFixed(0)} ms (${(ms/1000).toFixed(3)} s)`
const split = (t0: number) => fmt(now() - t0)

/* i18n */
const { t } = useI18n({ useScope: 'global' })

/* Props */
defineProps<{ canManage?: boolean; isDeleter?: boolean }>()

/* Token type */
type Token = { tokenId: number; owner: `0x${string}`; uri?: string; points?: number }

/* Composable */
const { loadTokensOf, getTokenURI, getTokenPoints } = useErc721()

/* Explorer base */
const chainId = Number(config.SUPPORTED_CHAIN_ID || 137)
const erc721Address = config.ERC721_ADDRESS as string
dbg('init:', { chainId, erc721Address, NFT_ADDRESS })

const POLYGON_EXPLORERS: Record<number, string> = {
  137: 'https://polygonscan.com',
  80001: 'https://mumbai.polygonscan.com'
}
const explorerBase = computed(() => POLYGON_EXPLORERS[chainId] ?? POLYGON_EXPLORERS[137])

/* --------------------------- State ----------------------------- */
const isLoading = ref(false)
const hasError  = ref(false)
const walletInput = ref('')
const target = ref<`0x${string}` | ''>('')
const searchError = ref('')

const tokens = ref<Token[]>([])
const totalPoints = computed(() => tokens.value.reduce((s, t) => s + (t.points || 0), 0))
const hasResult = computed(() => !!target.value)

const showMeta = ref(false)
const metaToken = ref<Token | null>(null)

/* Pending activity */
type PendingState = 'pending' | 'confirmed' | 'failed'
type PendingOp = { hash: string; label: string; state: PendingState }
const pending = ref<PendingOp[]>([])
const isSending = ref(false)
const inFlight = ref<Set<number>>(new Set())

function isRowBusy(id: number) { return inFlight.value.has(id) }

function addPending(label: string, hash: string) {
  const next: PendingOp = { hash, label, state: 'pending' }
  dbg('pending:add', { label, hash, explorer: txExplorerUrl(hash) })
  pending.value = [next, ...pending.value].slice(0, 6)
}
function resolvePending(hash: string, ok: boolean) {
  const idx = pending.value.findIndex(p => p.hash === hash)
  if (idx >= 0) {
    pending.value[idx].state = ok ? 'confirmed' : 'failed'
    dbg('pending:update', { hash, state: pending.value[idx].state })
  } else {
    dbgW('pending:update: hash not found', hash)
  }
}

/* Helpers */
function short(addr?: string) { return addr ? `${addr.slice(0,6)}…${addr.slice(-4)}` : '' }
function isAddress(s: string) { return /^0x[a-fA-F0-9]{40}$/.test(s.trim()) }

/* Open metadata */
async function openMeta(tkn: Token) {
  dbg('openMeta: start', { tokenId: tkn.tokenId })
  if (!tkn.uri)   tkn.uri   = await getTokenURI(tkn.tokenId)
  if (tkn.points == null) tkn.points = await getTokenPoints(tkn.tokenId)
  metaToken.value = tkn
  showMeta.value = true
  dbg('openMeta: done', { tokenId: tkn.tokenId, hasUri: !!tkn.uri, points: tkn.points })
}

/* Explorer */
function openExplorer(tokenId: number) {
  const url = `${explorerBase.value}/token/${erc721Address}?a=${tokenId}`
  dbg('openExplorer', { tokenId, url })
  window.open(url, '_blank', 'noopener')
}

/* Load wallet */
async function loadWallet() {
  searchError.value = ''; hasError.value = false
  const a = walletInput.value.trim()
  if (!isAddress(a)) { searchError.value = t('admin.search.invalid'); dbgW('loadWallet: invalid', a); return }

  const t0 = now()
  try {
    isLoading.value = true
    target.value = a as `0x${string}`
    dbg('loadWallet: start', { target: target.value })

    const tList = now()
    const list = await loadTokensOf(target.value)
    dbg('loadWallet: baseList', { count: list.length, sample: list.slice(0,5).map(x => x.tokenId), took: split(tList) })

    const tEnrich = now()
    await Promise.all(list.map(async (tkn) => {
      if (tkn.points == null) tkn.points = await getTokenPoints(tkn.tokenId)
      if (!tkn.uri)           tkn.uri   = await getTokenURI(tkn.tokenId)
    }))
    dbg('loadWallet: enrich', { took: split(tEnrich) })

    tokens.value = list
    dbg('loadWallet: done', { total: tokens.value.length, totalPoints: totalPoints.value, totalTook: split(t0) })
  } catch (e) {
    dbgE('loadWallet: failed', e)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

/* Clear */
function clear() {
  dbg('clear()')
  walletInput.value = ''
  target.value = ''
  tokens.value = []
  hasError.value = false
  searchError.value = ''
}

/* Auto-search on full 0x address */
let searchTimer: number | undefined
watch(walletInput, (val) => {
  if (searchTimer) window.clearTimeout(searchTimer)
  const trimmed = val.trim()
  if (!trimmed) { dbg('watch(walletInput): cleared'); clear(); return }
  if (trimmed.length === 42 && isAddress(trimmed)) {
    dbg('watch(walletInput): auto-load', trimmed)
    searchTimer = window.setTimeout(() => { void loadWallet() }, 200)
  }
})

/* Debug watches */
watch(tokens, (next, prev) => {
  if (!ADMIN_DEBUG) return
  const a = prev?.length ?? 0, b = next?.length ?? 0
  dbg('tokens: changed', `${a} -> ${b}`, { removed: (a - b) > 0 })
})
watch(pending, (next) => { if (ADMIN_DEBUG) dbg('pending: now', next) })

/* ---------------------- Burn actions --------------------------- */
async function burnOne(id: number) {
  const op0 = now()
  dbg('burnOne: start', { id })

  try {
    inFlight.value.add(id)
    isSending.value = true

    const tSend = now()
    dbg('burnOne: send', { id, address: NFT_ADDRESS })
    const { txHash, waitReceipt } = await gsnSendTx(NFT_ADDRESS, ABI_SURVEY_NFT, 'burnAny', [id], 1)
    const tHash = now()

    isSending.value = false
    dbg('burnOne: submitted', {
      id, txHash, explorer: txExplorerUrl(txHash),
      sendLatency: fmt(tHash - tSend), totalToHash: fmt(tHash - op0)
    })
    addPending(`Burn #${id}`, txHash)

    const before = tokens.value.length
    tokens.value = tokens.value.filter(t => t.tokenId !== id)
    const after = tokens.value.length
    dbg('burnOne: optimistic update', { before, after, took: split(tHash) })

    waitReceipt()
      .then(() => {
        const tRcpt = now()
        dbg('burnOne: confirmed', {
          id, txHash,
          mineLatency: fmt(tRcpt - tHash),
          e2e: fmt(tRcpt - op0)
        })
        resolvePending(txHash, true)
      })
      .catch(err => {
        dbgE('burnOne: receipt failed', err)
        resolvePending(txHash, false)
        void loadWallet()
      })
  } catch (e) {
    dbgE('[burnAny(gsn)]', e)
    isSending.value = false
  } finally {
    inFlight.value.delete(id)
    dbg('burnOne: end', { id, e2e: split(op0) })
  }
}

async function confirmBurnOne(id: number) {
  dbg('confirmBurnOne: prompt', { id })
  if (!confirm(`${t('admin.table.burn')} #${id}?`)) { dbg('confirmBurnOne: cancelled'); return }
  await burnOne(id)
}

/* Burn all (chunked) */
const CHUNK_SIZE = 50
async function burnAllForTarget() {
  if (!target.value) { dbgW('burnAllForTarget: no target'); return }
  const op0 = now()
  dbg('burnAllForTarget: start', { target: target.value, chunk: CHUNK_SIZE })

  try {
    let safety = 40
    let totalSent = 0
    while (safety-- > 0) {
      const tLoop = now()
      await loadWallet()
      const count = tokens.value.length
      if (!count) { dbg('burnAllForTarget: nothing to burn (loop)', { e2e: split(op0) }); break }

      const n = Math.min(CHUNK_SIZE, count)
      isSending.value = true
      const tSend = now()
      dbg('burnAllForTarget: send chunk', { n, target: target.value })
      const { txHash, waitReceipt } = await gsnSendTx(NFT_ADDRESS, ABI_SURVEY_NFT, 'burnAllFor', [target.value, n], 1)
      const tHash = now()
      isSending.value = false

      totalSent += n
      dbg('burnAllForTarget: submitted', {
        txHash,
        explorer: txExplorerUrl(txHash),
        chunkSendLatency: fmt(tHash - tSend),
        loopTimeToHash: fmt(tHash - tLoop),
        totalSent
      })
      addPending(`Burn ${n} token(s)`, txHash)

      await waitReceipt()
        .then(async () => {
          const tRcpt = now()
          dbg('burnAllForTarget: confirmed', {
            txHash,
            chunkMineLatency: fmt(tRcpt - tHash),
            chunkE2E: fmt(tRcpt - tLoop),
            totalE2E: fmt(tRcpt - op0)
          })
          resolvePending(txHash, true)
          await loadWallet()
        })
        .catch(async (err) => {
          dbgE('burnAllForTarget: receipt failed', err)
          resolvePending(txHash, false)
          await loadWallet()
        })
    }
  } catch (e) {
    dbgE('[burnAllFor(gsn)]', e)
    isSending.value = false
  } finally {
    dbg('burnAllForTarget: end', { e2e: split(op0) })
  }
}

async function confirmBurnAll() {
  const count = tokens.value.length
  dbg('confirmBurnAll: prompt', { count, target: target.value })
  if (!confirm(`${t('admin.actions.burnAll')} (${count})?`)) { dbg('confirmBurnAll: cancelled'); return }
  await burnAllForTarget()
}
</script>

<style scoped>
.box {
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
  padding: 14px;
  margin-bottom: 16px;
}

.box-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.box-title {
  margin: 0;
}

.search {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.search input {
  flex: 1;
  min-width: 240px;
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
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

.btn--danger {
  background: #fee2e2;
  border-color: #fecaca;
  color: #7f1d1d;
}

.help {
  font-size: 0.95rem;
  color: #555;
  margin-top: 8px;
}

.help--error {
  color: #b00020;
}

.kpis {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3,1fr);
  margin: 12px 0;
}

.kpi {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}

.kpi__label {
  color: #666;
  font-size: 0.9rem;
}

.kpi__value {
  font-size: 1.2rem;
  font-weight: 800;
}

.table {
  width: 100%;
}

.thead,.trow {
  display: grid;
  grid-template-columns: 120px 120px 1fr 140px;
  gap: 8px;
  align-items: center;
}

.thead{
  font-weight: 800;
  padding-bottom: 6px;
  border-bottom: 1px solid #eee;
}

.trow {
  padding: 8px 0;
  border-bottom: 1px solid #f2f2f2;
}

.cell--links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.link-btn {
  background: transparent;
  border: 0;
  padding: 0;
  font: inherit;
  cursor: pointer;
  color: #2563eb;
}

.link-btn:hover {
  text-decoration: underline;
}

.state {
  text-align: center;
  padding: 28px 16px;
}

.state--error h3 {
  color: #b00020;
}

.admin__loader {
  margin: 24px 0;
}

.pending {
  display: grid;
  gap: 6px;
  margin: 8px 0 12px;
}

.pending__item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pending__label {
  font-weight: 600;
}

.pill {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: .8rem;
}

.pill--pending {
  background: #fff7ed;
  color: #9a3412;
  border: 1px solid #fde6c7;
}

.pill--ok {
  background: #e8fff3;
  color: #065f46;
  border: 1px solid #bbf7d0;
}

.pill--err {
  background: #fee2e2;
  color: #7f1d1d;
  border: 1px solid #fecaca;
}
</style>
