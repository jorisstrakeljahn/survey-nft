<template>
  <div class="admin-page">
    <main class="admin-page__main">
      <header class="admin-page__header">
        <h1>{{ t('admin.title') }}</h1>

        <div class="badges">
          <span class="badge" :class="isDeleter ? 'badge--ok' : 'badge--warn'">
            {{ isDeleter ? t('admin.badges.deleter') : t('admin.badges.noDeleter') }}
          </span>

          <span class="badge" :class="canManage ? 'badge--ok' : 'badge--muted'">
            {{ canManage ? t('admin.badges.roleAdmin') : t('admin.badges.noRoleAdmin') }}
          </span>
        </div>
      </header>

      <!-- Suche Wallet + Rollenverwaltung NEBENEINANDER -->
      <div class="row-two">
        <!-- Wallet Suche (ohne Buttons; Enter/ESC + Autosearch) -->
        <section class="box">
          <h2>{{ t('admin.search.title') }}</h2>

          <div class="search">
            <input
              v-model="walletInput"
              :placeholder="t('admin.search.placeholder')"
              @keyup.enter="loadWallet"
              @keydown.esc="clear"
            />
          </div>

          <div v-if="searchError" class="help help--error">
            {{ searchError }}
          </div>
        </section>

        <!-- Rollenverwaltung (Enter = prüfen, Buttons: grant/revoke) -->
        <section class="box">
          <h2>{{ t('admin.roles.title') }}</h2>
          <div class="help">{{ t('admin.roles.help') }}</div>

          <div class="roles-line">
            <input
              v-model="roleAddr"
              :placeholder="t('admin.roles.placeholder')"
              @keyup.enter="checkRole"
              @keydown.esc="roleAddr=''; roleMsg=''"
            />
            <div class="roles-actions">
              <button
                class="btn"
                :disabled="!canManage || !isAddress(roleAddr)"
                @click="grantRole"
                title="Grant"
              >
                {{ t('admin.roles.grant') }}
              </button>
              <button
                class="btn btn--ghost"
                :disabled="!canManage || !isAddress(roleAddr)"
                @click="revokeRole"
                title="Revoke"
              >
                {{ t('admin.roles.revoke') }}
              </button>
            </div>
          </div>

          <div class="help" v-if="roleMsg">{{ roleMsg }}</div>
        </section>
      </div>

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

      <!-- KOMBINIERTE BOX: Aktion „Alles löschen“ + NFT-Tabelle -->
      <section v-if="!isLoading && hasResult && tokens.length > 0" class="box">
        <div class="box-head">
          <h2 class="box-title">{{ t('admin.table.title') }}</h2>
          <button
            class="btn btn--danger"
            :disabled="!isDeleter"
            @click="confirmBurnAll"
          >
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
              <!-- Metadaten & Explorer im gleichen Stil -->
              <button class="link-btn" @click="openMeta(tkn)">
                {{ t('admin.table.metadata') }}
              </button>
              <button class="link-btn" @click="openExplorer(tkn.tokenId)">
                {{ t('admin.table.explorer') }}
              </button>
            </div>
            <div class="cell">
              <button
                class="btn btn--danger"
                :disabled="!isDeleter"
                @click="confirmBurnOne(tkn.tokenId)"
              >
                {{ t('admin.table.burn') }}
              </button>
            </div>
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
    </main>

    <app-footer />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import AppFooter from '@/common/AppFooter.vue'
import Loader from '@/common/Loader.vue'
import NftMetadataModal from '@/common/NftMetadataModal.vue'
import { useErc721 } from '@/composables/contracts/use-erc721'
import { config } from '@/config'

type Token = {
  tokenId: number
  owner: `0x${string}`
  uri?: string
  points?: number
}

const { t } = useI18n({ useScope: 'global' })
const erc721Address = config.ERC721_ADDRESS as string

const {
  getMyAddress,
  loadTokensOf,
  getTokenURI,
  getTokenPoints,
  hasDeleterRole,
  grantDeleterRole,
  revokeDeleterRole,
  getDeleterRoleAdmin,
  burnAny,
  burnAllFor,
} = useErc721()

const chainId = Number(config.SUPPORTED_CHAIN_ID || 137)
const explorerBase = computed(() =>
  chainId === 137
    ? 'https://polygonscan.com'
    : chainId === 80001
      ? 'https://mumbai.polygonscan.com'
      : 'https://polygonscan.com',
)

const me = ref<`0x${string}` | ''>('')
const isLoading = ref(false)
const error = ref(false)

const walletInput = ref('')
const target = ref<`0x${string}` | ''>('')
const searchError = ref('')

const tokens = ref<Token[]>([])
const totalPoints = computed(() =>
  tokens.value.reduce((s, t) => s + (t.points || 0), 0),
)
const hasResult = computed(() => !!target.value)

const isDeleter = ref(false)
const canManage = ref(false)

const showMeta = ref(false)
const metaToken = ref<Token | null>(null)

async function openMeta (tkn: Token) {
  if (!tkn.uri) tkn.uri = await getTokenURI(tkn.tokenId)
  if (tkn.points == null) tkn.points = await getTokenPoints(tkn.tokenId)
  metaToken.value = tkn
  showMeta.value = true
}

/** Explorer in neuem Tab (identischer Stil wie Metadaten) */
function openExplorer (tokenId: number) {
  const url = `${explorerBase.value}/token/${erc721Address}?a=${tokenId}`
  window.open(url, '_blank', 'noopener')
}

/** Chunksize intern, UI zeigt nur „Alles löschen“ */
const CHUNK_SIZE = 50

const roleAddr = ref('')
const roleMsg = ref('')

function short (addr?: string) {
  if (!addr) return ''
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}
function isAddress (s: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(s.trim())
}

async function initMyRole () {
  me.value = (await getMyAddress()) || ''
  isDeleter.value = await hasDeleterRole()
  canManage.value = await getDeleterRoleAdmin()
}

async function loadWallet () {
  searchError.value = ''
  error.value = false

  const a = walletInput.value.trim()
  if (!isAddress(a)) {
    searchError.value = t('admin.search.invalid')
    return
  }

  try {
    isLoading.value = true
    target.value = a as `0x${string}`

    const list = await loadTokensOf(target.value)
    for (const tkn of list) {
      if (tkn.points == null) tkn.points = await getTokenPoints(tkn.tokenId)
      if (!tkn.uri) tkn.uri = await getTokenURI(tkn.tokenId)
    }
    tokens.value = list
  } catch (e: unknown) {
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
  error.value = false
  searchError.value = ''
}

/* -------- Autosearch (vollständige 0x-Adresse) -------- */
let searchTimer: number | undefined
watch(walletInput, (val) => {
  if (searchTimer) window.clearTimeout(searchTimer)
  const trimmed = val.trim()
  if (!trimmed) { clear(); return }
  if (trimmed.length === 42 && isAddress(trimmed)) {
    searchTimer = window.setTimeout(() => { void loadWallet() }, 200)
  }
})

/* -------- Aktionen (mit Bestätigung) -------- */

async function burnOne (id: number) {
  if (!isDeleter.value) return
  try {
    isLoading.value = true
    await burnAny(id)
    await loadWallet()
  } catch (e: unknown) {
    // eslint-disable-next-line no-console
    console.error(e)
    isLoading.value = false
  }
}

async function confirmBurnOne (id: number) {
  if (!isDeleter.value) return
  const ok = window.confirm(`Soll Token #${id} wirklich gelöscht werden?`)
  if (!ok) return
  await burnOne(id)
}

/** „Alles löschen“: intern in CHUNK_SIZE-Schritten, bis keine Tokens mehr */
async function burnAllForTarget () {
  if (!isDeleter.value || !target.value) return
  try {
    isLoading.value = true
    let safety = 40 // hard stop
    while (safety-- > 0) {
      await loadWallet()
      const count = tokens.value.length
      if (!count) break
      const n = Math.min(CHUNK_SIZE, count)
      await burnAllFor(target.value, n)
    }
    await loadWallet()
  } catch (e: unknown) {
    // eslint-disable-next-line no-console
    console.error(e)
    isLoading.value = false
  }
}

async function confirmBurnAll () {
  if (!isDeleter.value || !target.value) return
  const count = tokens.value.length
  const ok = window.confirm(`Wirklich ALLE (${count}) NFTs für ${short(target.value)} löschen?`)
  if (!ok) return
  await burnAllForTarget()
}

/* -------- Rollen -------- */

async function checkRole () {
  roleMsg.value = ''
  const a = roleAddr.value.trim()
  if (!isAddress(a)) {
    roleMsg.value = t('admin.roles.invalid')
    return
  }
  const has = await hasDeleterRole(a as `0x${string}`)
  roleMsg.value = has ? t('admin.badges.deleter') : t('admin.badges.noDeleter')
}

async function grantRole () {
  roleMsg.value = ''
  const a = roleAddr.value.trim()
  if (!canManage.value) {
    roleMsg.value = t('admin.roles.noPerm')
    return
  }
  if (!isAddress(a)) {
    roleMsg.value = t('admin.roles.invalid')
    return
  }
  try {
    isLoading.value = true
    await grantDeleterRole(a as `0x${string}`)
    roleMsg.value = t('admin.roles.granted', { addr: short(a) })
  } catch (e: unknown) {
    roleMsg.value = t('admin.roles.error')
  } finally {
    isLoading.value = false
  }
}

async function revokeRole () {
  roleMsg.value = ''
  const a = roleAddr.value.trim()
  if (!canManage.value) {
    roleMsg.value = t('admin.roles.noPerm')
    return
  }
  if (!isAddress(a)) {
    roleMsg.value = t('admin.roles.invalid')
    return
  }
  try {
    isLoading.value = true
    await revokeDeleterRole(a as `0x${string}`)
    roleMsg.value = t('admin.roles.revoked', { addr: short(a) })
  } catch (e: unknown) {
    roleMsg.value = t('admin.roles.error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => { void initMyRole() })
</script>

<style lang="scss" scoped>
.admin-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.admin-page__main {
  flex: 1;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 24px 16px 32px 16px;
}

.admin-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;

  h1 { margin: 0 }
}

.badges { display: flex; gap: 8px; flex-wrap: wrap }
.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: .8rem; font-weight: 800;
  border: 1px solid #e5e5e5;
}
.badge--ok   { background: #e8fff3; color: #065f46; border-color: #bbf7d0 }
.badge--warn { background: #fff7ed; color: #9a3412; border-color: #fed7aa }
.badge--muted{ background: #f6f6f6; color: #444 }

/* Zwei Boxen nebeneinander (responsive) */
.row-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
@media (max-width: 900px) {
  .row-two { grid-template-columns: 1fr; }
}

.box {
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
  padding: 14px;
}

/* Kopfzeile innerhalb der kombinierten Box */
.box-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.box-title { margin: 0 }

/* Suche */
.search { display: flex; gap: 8px; flex-wrap: wrap }
.search input { flex: 1; min-width: 240px; padding: 10px 12px; border: 1px solid #e5e5e5; border-radius: 10px }

/* Rollenverwaltung */
.roles-line {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
}
.roles-line input { padding: 10px 12px; border: 1px solid #e5e5e5; border-radius: 10px }
.roles-actions { display: flex; gap: 8px }

/* Buttons */
.btn {
  padding: 6px 10px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  background: #fff;
  font-weight: 700;
  cursor: pointer;
}
.btn--ghost  { background: #fafafa }
.btn--danger { background: #fee2e2; border-color: #fecaca; color: #7f1d1d }

/* Hinweise / States */
.help { font-size: .95rem; color: #555; margin-top: 8px }
.help--error { color: #b00020 }

/* KPIs */
.kpis { display: grid; gap: 10px; grid-template-columns: repeat(3,1fr); margin-bottom: 12px }
.kpi {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}
.kpi__label { color: #666; font-size: .9rem }
.kpi__value { font-size: 1.2rem; font-weight: 800 }

/* Tabelle */
.table { width: 100% }
.thead, .trow {
  display: grid;
  grid-template-columns: 120px 120px 1fr 140px;
  gap: 8px;
  align-items: center;
}
.thead {
  font-weight: 800;
  padding-bottom: 6px;
  border-bottom: 1px solid #eee;
}
.trow { padding: 8px 0; border-bottom: 1px solid #f2f2f2 }
.cell--links { display: flex; gap: 10px; flex-wrap: wrap }

/* link & link-btn Styles (für einheitliche Optik) */
.link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 700;
}
.link:hover { text-decoration: underline; }

.link-btn {
  background: transparent;
  border: 0;
  padding: 0;
  font: inherit;
  cursor: pointer;
  color: #2563eb;
}
.link-btn:hover { text-decoration: underline; }

/* Loader / Error */
.state { text-align: center; padding: 28px 16px }
.state--error h3 { color: #b00020 }
.admin__loader { margin: 24px 0 }
</style>
