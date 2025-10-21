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
  <section v-if="!isLoading && error" class="state state--error">
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
      <button class="btn btn--danger" :disabled="!isDeleter" @click="confirmBurnAll">
        {{ t('admin.actions.burnAll') }}
      </button>
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
          <button class="btn btn--danger" :disabled="!isDeleter" @click="confirmBurnOne(tkn.tokenId)">
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

// Gasless writes via GSN (only used for burn actions)
import { gsnTx } from '@/lib/gsn-client.v5'
import { NFT_ADDRESS } from '@/config/addresses'
import { ABI_SURVEY_NFT } from '@/abi/surveyNft'

/** i18n from global scope so navbar language switches take effect immediately */
const { t } = useI18n({ useScope: 'global' })

/** Permission props from layout */
defineProps<{ canManage?: boolean; isDeleter?: boolean }>()

/** Token shape (minimal fields we need for UI) */
type Token = { tokenId: number; owner: `0x${string}`; uri?: string; points?: number }

/** Read-only helpers from composable (no writes here) */
const { loadTokensOf, getTokenURI, getTokenPoints } = useErc721()

/** Explorer base + contract address (driven by configured chain id) */
const chainId = Number(config.SUPPORTED_CHAIN_ID || 137)
const erc721Address = config.ERC721_ADDRESS as string

// Lint-friendly alternative to nested ternaries: centralized lookup
const POLYGON_EXPLORERS: Record<number, string> = {
  137:   'https://polygonscan.com',
  80001: 'https://mumbai.polygonscan.com'
}
const explorerBase = computed(() => POLYGON_EXPLORERS[chainId] ?? POLYGON_EXPLORERS[137])

/** UI state */
const isLoading = ref(false)
const error = ref(false)
const walletInput = ref('')
const target = ref<`0x${string}` | ''>('')
const searchError = ref('')

const tokens = ref<Token[]>([])
const totalPoints = computed(() => tokens.value.reduce((s, t) => s + (t.points || 0), 0))
const hasResult = computed(() => !!target.value)

const showMeta = ref(false)
const metaToken = ref<Token | null>(null)

/** Small helpers */
function short (addr?: string) { return addr ? `${addr.slice(0,6)}…${addr.slice(-4)}` : '' }
function isAddress (s: string) { return /^0x[a-fA-F0-9]{40}$/.test(s.trim()) }

/** Lazy-load metadata for a single token and open modal */
async function openMeta (tkn: Token) {
  if (!tkn.uri)   tkn.uri   = await getTokenURI(tkn.tokenId)
  if (tkn.points == null) tkn.points = await getTokenPoints(tkn.tokenId)
  metaToken.value = tkn
  showMeta.value = true
}

/** Open token in the block explorer (contract page with token filter) */
function openExplorer (tokenId: number) {
  window.open(`${explorerBase.value}/token/${erc721Address}?a=${tokenId}`, '_blank', 'noopener')
}

/** Load all tokens for the searched wallet, enrich with points/uri */
async function loadWallet () {
  searchError.value = ''; error.value = false
  const a = walletInput.value.trim()
  if (!isAddress(a)) { searchError.value = t('admin.search.invalid'); return }

  try {
    isLoading.value = true
    target.value = a as `0x${string}`

    // Fetch list, then fill missing fields (points/uri) on demand
    const list = await loadTokensOf(target.value)
    for (const tkn of list) {
      if (tkn.points == null) tkn.points = await getTokenPoints(tkn.tokenId)
      if (!tkn.uri)           tkn.uri   = await getTokenURI(tkn.tokenId)
    }
    tokens.value = list
  } catch (e) {
    // Keep user-facing error minimal; details go to console
    // eslint-disable-next-line no-console
    console.error(e)
    error.value = true
  } finally {
    isLoading.value = false
  }
}

/** Reset UI to initial state */
function clear () {
  walletInput.value = ''
  target.value = ''
  tokens.value = []
  error.value = false
  searchError.value = ''
}

/** Auto-search when a full 0x address has been typed (tiny debounce) */
let searchTimer: number | undefined
watch(walletInput, (val) => {
  if (searchTimer) window.clearTimeout(searchTimer)
  const trimmed = val.trim()
  if (!trimmed) { clear(); return }
  if (trimmed.length === 42 && isAddress(trimmed)) {
    searchTimer = window.setTimeout(() => { void loadWallet() }, 200)
  }
})

/** --- Burn actions (gasless via GSN) ----------------------------------- */

/** Burn a single token id, then refresh the list */
async function burnOne (id: number) {
  try {
    isLoading.value = true
    await gsnTx(NFT_ADDRESS, ABI_SURVEY_NFT, 'burnAny', [id])
    await loadWallet()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[burnAny(gsn)]', e)
    isLoading.value = false
  }
}
async function confirmBurnOne (id: number) {
  if (!confirm(`${t('admin.table.burn')} #${id}?`)) return
  await burnOne(id)
}

/**
 * Burn all tokens for the current wallet in manageable chunks.
 * If your contract exposes burnAllFor(address, count), we loop in CHUNK_SIZE
 * to keep transactions reasonably sized; otherwise, use burnAny(...) per token.
 */
const CHUNK_SIZE = 50
async function burnAllForTarget () {
  if (!target.value) return
  try {
    isLoading.value = true
    let safety = 40 // hard stop to avoid endless loops in edge cases
    while (safety-- > 0) {
      await loadWallet()
      const count = tokens.value.length
      if (!count) break
      const n = Math.min(CHUNK_SIZE, count)
      await gsnTx(NFT_ADDRESS, ABI_SURVEY_NFT, 'burnAllFor', [target.value, n])
      // No extra delay required; gsnTx awaits the receipt internally.
    }
    await loadWallet()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[burnAllFor(gsn)]', e)
    isLoading.value = false
  }
}
async function confirmBurnAll () {
  const count = tokens.value.length
  if (!confirm(`${t('admin.actions.burnAll')} (${count})?`)) return
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
</style>
