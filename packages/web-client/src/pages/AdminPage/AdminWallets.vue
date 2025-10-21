<!-- src/pages/AdminPage/AdminWallets.vue -->
<template>
  <!-- Suche -->
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

  <!-- Loader / Fehler / Empty -->
  <loader v-if="isLoading" class="admin__loader" />
  <section v-if="!isLoading && error" class="state state--error">
    <h3>{{ t('admin.error.title') }}</h3>
    <p>{{ t('admin.error.text') }}</p>
  </section>
  <section v-if="!isLoading && hasResult && tokens.length === 0" class="state state--empty">
    <h3>{{ t('admin.empty.title') }}</h3>
    <p>{{ t('admin.empty.text') }}</p>
  </section>

  <!-- Löschaktionen + Tabelle -->
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

  <!-- Deaktivierte / geburnte Tokens -->
  <section v-if="!isLoading && hasResult && burnedTokens.length > 0" class="box">
    <div class="box-head">
      <h2 class="box-title">Deaktivierte / verbrauchte Tokens</h2>
    </div>
    <p class="help">
      Diese Tokens wurden deaktiviert (Burn). Sie zählen nicht mehr, bleiben aber für die Nachverfolgung sichtbar.
    </p>

    <loader v-if="isLoadingBurned" class="admin__loader" />

    <div class="table" v-if="!isLoadingBurned">
      <div class="thead">
        <div>Token</div>
        <div>Punkte</div>
        <div>Links</div>
        <div><!-- leer: keine Aktion --></div>
      </div>

      <div class="trow trow--muted" v-for="row in burnedTokens" :key="row.tokenId">
        <div class="cell">{{ row.tokenId }}</div>
        <div class="cell">{{ row.points ?? '–' }}</div>
        <div class="cell cell--links">
          <!-- für Burnt nur Explorer-Link; Metadata-Aufruf kann nach Burn scheitern -->
          <button class="link-btn" @click="openExplorer(row.tokenId)">Explorer</button>
        </div>
        <div class="cell"><!-- keine Buttons --></div>
      </div>
    </div>
  </section>


  <!-- Metadata-Modal -->
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

// ⬇️ GSN für gaslose Writes
import {gsnTx, readRpc} from '@/lib/gsn-client.v5'
import {NFT_ADDRESS, SURVEY_NFT_DEPLOY_BLOCK} from '@/config/addresses'
import { ABI_SURVEY_NFT } from '@/abi/surveyNft'
import {ethers} from "ethers";
import {getLogsChunked, pad32, TOPIC, ZERO32} from "@/lib/logs";

/** i18n global, damit der Switch aus der Navbar sofort greift */
const { t } = useI18n({ useScope: 'global' })

/** Props vom Layout (Rollen) */
defineProps<{ canManage?: boolean; isDeleter?: boolean }>()

/** Typ für Tokens */
type Token = { tokenId: number; owner: `0x${string}`; uri?: string; points?: number }

/** Contract-Helpers (nur READS hier aus dem Composable) */
const { loadTokensOf, getTokenURI, getTokenPoints } = useErc721()

/** Explorer-Base + Contract-Adresse */
const chainId = Number(config.SUPPORTED_CHAIN_ID || 137)
const erc721Address = config.ERC721_ADDRESS as string
const explorerBase = computed(() =>
  chainId === 137 ? 'https://polygonscan.com'
    : chainId === 80001 ? 'https://mumbai.polygonscan.com'
      : 'https://polygonscan.com'
)

/** UI-State */
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

const burnedTokens = ref<Array<{
  tokenId: number
  mintedTx: string
  burnedTx: string
  mintedBlock: number
  burnedBlock: number
  points?: number
  surveyId?: string
}>>([])
const isLoadingBurned = ref(false)

function parseBlockLike(v: unknown): number | undefined {
  if (v == null) return undefined
  if (typeof v === 'number') return v
  if (typeof v === 'string') {
    const n = v.startsWith('0x') ? parseInt(v, 16) : parseInt(v, 10)
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}

const deployBlock = (() => {
  const raw = (config as any).ERC721_DEPLOY_BLOCK ?? SURVEY_NFT_DEPLOY_BLOCK
  const n = parseBlockLike(raw)
  return (n && n > 0) ? n : SURVEY_NFT_DEPLOY_BLOCK
})()

const nftRead = new ethers.Contract(erc721Address, ABI_SURVEY_NFT, readRpc())

async function tryGetPointsAtBlock(tokenId: number, blockTag: number) {
  try {
    const pts = await nftRead.getTokenPoints(tokenId, { blockTag })
    return Number(pts.toString())
  } catch {
    return undefined
  }
}

/** Utils */
function short (addr?: string) { return addr ? `${addr.slice(0,6)}…${addr.slice(-4)}` : '' }
function isAddress (s: string) { return /^0x[a-fA-F0-9]{40}$/.test(s.trim()) }

/** Aktionen: READS */
async function openMeta (tkn: Token) {
  if (!tkn.uri) tkn.uri = await getTokenURI(tkn.tokenId)
  if (tkn.points == null) tkn.points = await getTokenPoints(tkn.tokenId)
  metaToken.value = tkn
  showMeta.value = true
}

function openExplorer (tokenId: number) {
  window.open(`${explorerBase.value}/token/${erc721Address}?a=${tokenId}`, '_blank', 'noopener')
}

async function loadWallet () {
  searchError.value = ''; error.value = false
  const a = walletInput.value.trim()
  if (!isAddress(a)) { searchError.value = t('admin.search.invalid'); return }
  try {
    isLoading.value = true
    target.value = a as `0x${string}`

    const list = await loadTokensOf(target.value)
    for (const tkn of list) {
      if (tkn.points == null) tkn.points = await getTokenPoints(tkn.tokenId)
      if (!tkn.uri) tkn.uri = await getTokenURI(tkn.tokenId)
    }
    tokens.value = list

    burnedTokens.value = []
    void loadBurnedForTarget(target.value)

  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    error.value = true
  } finally {
    isLoading.value = false
  }
}


function clear () {
  walletInput.value = ''
  target.value = ''
  tokens.value = []
  burnedTokens.value = []
  isLoadingBurned.value = false
  error.value = false
  searchError.value = ''
}

/** Autosearch: wenn komplette 0x-Adresse eingetippt */
let searchTimer: number | undefined
watch(walletInput, (val) => {
  if (searchTimer) window.clearTimeout(searchTimer)
  const trimmed = val.trim()
  if (!trimmed) { clear(); return }
  if (trimmed.length === 42 && isAddress(trimmed)) {
    searchTimer = window.setTimeout(() => { void loadWallet() }, 200)
  }
})

/** Burn-Aktionen – jetzt GASLOS via GSN */
async function burnOne (id: number) {
  try {
    isLoading.value = true
    // gaslos: burnAny(tokenId)
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
 * Burn-All gaslos:
 * Falls dein Contract die Methode `burnAllFor(address user, uint256 count)` hat (was dein bisheriger Code impliziert),
 * nutzen wir sie in CHUNKS, damit einzelne Transaktionen nicht zu groß werden.
 * Alternativ könntest du statt dessen jedes Token einzeln via burnAny(...) loopen.
 */
const CHUNK_SIZE = 50
async function burnAllForTarget () {
  if (!target.value) return
  try {
    isLoading.value = true
    let safety = 40 // Hard-Stop gegen Endlosschleifen
    while (safety-- > 0) {
      await loadWallet()
      const count = tokens.value.length
      if (!count) break
      const n = Math.min(CHUNK_SIZE, count)
      // gaslos: burnAllFor(target, n)
      await gsnTx(NFT_ADDRESS, ABI_SURVEY_NFT, 'burnAllFor', [target.value, n])
      // kleine Pause ist i. d. R. nicht nötig; GSN wartet ohnehin auf das Receipt in gsnTx
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

async function getPointsFromHistory(tokenId: number, mintedBlock: number, mintTxHash: string) {
  // 1) Erst historischer Read (robust, auch bei GSN)
  const p1 = await tryGetPointsAtBlock(tokenId, mintedBlock)
  if (p1 != null) return { points: p1 }

  // 2) Fallback: Tx decodieren (funktioniert, wenn direkter Call war)
  try {
    const provider = readRpc()
    const tx = await provider.getTransaction(mintTxHash)
    const parsed = tx?.data ? claimIface.parseTransaction({ data: tx.data, value: tx.value }) : null
    if (parsed && CLAIM_FUNCTION_NAMES.includes(parsed.name as any)) {
      const surveyId = parsed.args?.[0]?.toString?.()
      const points = parsed.args?.[1] != null ? Number(parsed.args[1]) : undefined
      return { surveyId, points }
    }
  } catch {}
  return {}
}

const CLAIM_FUNCTION_NAMES = ['claimNFT', 'claim', 'claimFor', 'claimWithSig'] as const
const claimIface = new ethers.utils.Interface(ABI_SURVEY_NFT)

async function tryDecodePointsFromTx(provider: ethers.providers.Provider, txHash: string) {
  try {
    const tx = await provider.getTransaction(txHash)
    if (!tx?.data) return {}
    const parsed = claimIface.parseTransaction({ data: tx.data, value: tx.value })
    if (!parsed) return {}
    if (!CLAIM_FUNCTION_NAMES.includes(parsed.name as any)) return {}
    const surveyId = parsed.args?.[0]?.toString?.()
    const pointsRaw = parsed.args?.[1]
    const points = pointsRaw != null ? Number(pointsRaw.toString()) : undefined
    return { surveyId, points }
  } catch {
    return {}
  }
}

async function loadBurnedForTarget(wallet: `0x${string}`) {
  burnedTokens.value = []
  if (!wallet) return
  isLoadingBurned.value = true
  try {
    const provider = readRpc()

    // Mint-Logs: Transfer(0x0 -> wallet), Burn-Logs: Transfer(wallet -> 0x0)
    const STEP = 2_000
    const [mints, burns] = await Promise.all([
      getLogsChunked({
        address: erc721Address,
        topics: [TOPIC.Transfer, ZERO32, pad32(wallet)],
        fromBlock: deployBlock,
        step: STEP,                 // 👈 wichtig
      }),
      getLogsChunked({
        address: erc721Address,
        topics: [TOPIC.Transfer, pad32(wallet), ZERO32],
        fromBlock: deployBlock,
        step: STEP,                 // 👈 wichtig
      }),
    ])

    // Index burns by tokenId
    const burnById = new Map<string, ethers.providers.Log>()
    for (const b of burns) burnById.set(ethers.BigNumber.from(b.topics[3]).toString(), b)

    const rows: typeof burnedTokens.value = []
    for (const m of mints) {
      const tokenId = ethers.BigNumber.from(m.topics[3]).toNumber()
      const b = burnById.get(String(tokenId))
      if (!b) continue // nur geburnte anzeigen

      const { surveyId, points } = await getPointsFromHistory(tokenId, m.blockNumber!, m.transactionHash)
      rows.push({
        tokenId,
        mintedTx: m.transactionHash,
        burnedTx: b.transactionHash,
        mintedBlock: m.blockNumber!,
        burnedBlock: b.blockNumber!,
        surveyId, points,
      })
    }

    rows.sort((a,b) => b.burnedBlock - a.burnedBlock)
    burnedTokens.value = rows
  } finally {
    isLoadingBurned.value = false
  }
}
</script>

<style scoped>
/* kompakte, wiederverwendbare Styles */
.box{border:1px solid #eee;border-radius:12px;background:#fff;padding:14px;margin-bottom:16px}
.box-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
.box-title{margin:0}
.search{display:flex;gap:8px;flex-wrap:wrap}
.search input{flex:1;min-width:240px;padding:10px 12px;border:1px solid #e5e5e5;border-radius:10px}
.btn{padding:6px 10px;border:1px solid #e5e5e5;border-radius:10px;background:#fff;font-weight:700;cursor:pointer}
.btn--ghost{background:#fafafa}
.btn--danger{background:#fee2e2;border-color:#fecaca;color:#7f1d1d}
.help{font-size:.95rem;color:#555;margin-top:8px}
.help--error{color:#b00020}
.kpis{display:grid;gap:10px;grid-template-columns:repeat(3,1fr);margin:12px 0}
.kpi{background:#fff;border:1px solid #eee;border-radius:12px;padding:12px;text-align:center}
.kpi__label{color:#666;font-size:.9rem}
.kpi__value{font-size:1.2rem;font-weight:800}
.table{width:100%}
.thead,.trow{display:grid;grid-template-columns:120px 120px 1fr 140px;gap:8px;align-items:center}
.thead{font-weight:800;padding-bottom:6px;border-bottom:1px solid #eee}
.trow{padding:8px 0;border-bottom:1px solid #f2f2f2}
.cell--links{display:flex;gap:10px;flex-wrap:wrap}
.link-btn{background:transparent;border:0;padding:0;font:inherit;cursor:pointer;color:#2563eb}
.link-btn:hover{text-decoration:underline}
.state{text-align:center;padding:28px 16px}
.state--error h3{color:#b00020}
.admin__loader{margin:24px 0}
.trow--muted{ color:#6b7280 }
</style>
