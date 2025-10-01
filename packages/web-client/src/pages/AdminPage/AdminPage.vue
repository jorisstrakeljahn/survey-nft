<template>
  <div class="admin-page">
    <main class="admin-page__main">
      <header class="admin-page__header">
        <h1>{{ t('admin.title') }}</h1>

        <div class="badges">
          <span
            class="badge"
            :class="isDeleter ? 'badge--ok' : 'badge--warn'"
          >
            {{ isDeleter ? t('admin.badges.deleter') : t('admin.badges.noDeleter') }}
          </span>

          <span
            class="badge"
            :class="canManage ? 'badge--ok' : 'badge--muted'"
          >
            {{ canManage ? t('admin.badges.roleAdmin') : t('admin.badges.noRoleAdmin') }}
          </span>
        </div>
      </header>

      <!-- Wallet Suche -->
      <section class="box">
        <h2>{{ t('admin.search.title') }}</h2>

        <div class="search">
          <input
            v-model="walletInput"
            :placeholder="t('admin.search.placeholder')"
            @keyup.enter="loadWallet"
          />
          <button class="btn" @click="loadWallet" :disabled="isLoading">
            {{ t('admin.search.load') }}
          </button>
          <button class="btn btn--ghost" @click="clear">
            {{ t('common.clear') }}
          </button>
        </div>

        <div v-if="searchError" class="help help--error">
          {{ searchError }}
        </div>
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

      <!-- Aktionen für gefundene Wallet -->
      <section v-if="!isLoading && hasResult && tokens.length > 0" class="box">
        <h2>{{ t('admin.actions.title') }}</h2>

        <div class="actions">
          <div class="action-line">
            <div class="action-line__left">
              <div class="hint">{{ t('admin.actions.infoGasless') }}</div>
            </div>
            <div class="action-line__right">
              <input
                v-model.number="maxChunk"
                type="number"
                min="1"
                class="input-n"
                :placeholder="t('admin.actions.maxCountPh')"
              />
              <button
                class="btn btn--danger"
                :disabled="!isDeleter"
                @click="burnAllForTarget"
              >
                {{ t('admin.actions.burnAll') }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Tabelle der Tokens -->
      <section v-if="!isLoading && hasResult && tokens.length > 0" class="box">
        <h2>{{ t('admin.table.title') }}</h2>

        <div class="table">
          <div class="thead">
            <div>{{ t('admin.table.points') }}</div>
            <div>{{ t('admin.table.links') }}</div>
            <div>{{ t('admin.table.action') }}</div>
          </div>

          <div
            class="trow"
            v-for="tkn in tokens"
            :key="tkn.tokenId"
          >
            <div class="cell">{{ tkn.tokenId }}</div>
            <div class="cell">{{ tkn.points ?? 0 }}</div>
            <div class="cell cell--links">
              <a
                v-if="tkn.uri"
                class="link"
                :href="tkn.uri"
                target="_blank"
                rel="noopener"
              >
                {{ t('admin.table.metadata') }}
              </a>
              <a
                class="link"
                :href="`${explorerBase}/token/${erc721Address}?a=${tkn.tokenId}`"
                target="_blank"
                rel="noopener"
              >
                {{ t('admin.table.explorer') }}
              </a>
            </div>
            <div class="cell">
              <button
                class="btn btn--danger"
                :disabled="!isDeleter"
                @click="burnOne(tkn.tokenId)"
              >
                {{ t('admin.table.burn') }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Rollenverwaltung -->
      <section class="box">
        <h2>{{ t('admin.roles.title') }}</h2>
        <div class="help">
          {{ t('admin.roles.help') }}
        </div>

        <div class="roles-line">
          <input
            v-model="roleAddr"
            :placeholder="t('admin.roles.placeholder')"
          />
          <button
            class="btn"
            :disabled="!canManage"
            @click="grantRole"
          >
            {{ t('admin.roles.grant') }}
          </button>
          <button
            class="btn btn--ghost"
            :disabled="!canManage"
            @click="revokeRole"
          >
            {{ t('admin.roles.revoke') }}
          </button>
        </div>

        <div class="help" v-if="roleMsg">
          {{ roleMsg }}
        </div>
      </section>
    </main>

    <app-footer />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import AppNavbar from '@/common/AppNavbar.vue'
import AppFooter from '@/common/AppFooter.vue'
import Loader from '@/common/Loader.vue'
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
  // neue Methoden aus dem Patch (siehe Punkt 2 unten)
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

const isDeleter = ref(false)     // darf burn ausführen
const canManage = ref(false)     // darf Rollen vergeben (Admin des Deleter-Roles)
const maxChunk = ref<number>(50)

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
  canManage.value = await getDeleterRoleAdmin() // true, wenn me Admin dieses Roles ist
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

    // Tokens des Ziels holen
    const list = await loadTokensOf(target.value)

    // sicherstellen, dass points/uri gefüllt sind (Fallback)
    for (const tkn of list) {
      if (tkn.points == null) {
        tkn.points = await getTokenPoints(tkn.tokenId)
      }
      if (!tkn.uri) {
        tkn.uri = await getTokenURI(tkn.tokenId)
      }
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

async function burnAllForTarget () {
  if (!isDeleter.value || !target.value) return
  try {
    isLoading.value = true
    await burnAllFor(target.value, Math.max(1, maxChunk.value || 50))
    await loadWallet()
  } catch (e: unknown) {
    // eslint-disable-next-line no-console
    console.error(e)
    isLoading.value = false
  }
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
  max-width: 1100px;
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

.box {
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
  padding: 14px;
  margin-bottom: 16px;
}
.search { display: flex; gap: 8px; flex-wrap: wrap }
.search input,
.roles-line input {
  flex: 1;
  min-width: 260px;
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
}
.btn {
  padding: 10px 14px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  background: #fff;
  font-weight: 700;
  cursor: pointer;
}
.btn--ghost  { background: #fafafa }
.btn--danger { background: #fee2e2; border-color: #fecaca; color: #7f1d1d }

.help {
  font-size: .95rem; color: #555; margin-top: 8px;
}
.help--error { color: #b00020 }

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

.actions { display: grid; gap: 8px }
.action-line {
  display: flex; gap: 12px; justify-content: space-between; align-items: center; flex-wrap: wrap
}
.input-n { width: 120px; text-align: right }

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
.link { color: #2563eb; text-decoration: none; font-weight: 700 }
.link:hover { text-decoration: underline }

.state { text-align: center; padding: 28px 16px }
.state--error h3 { color: #b00020 }

.admin__loader { margin: 24px 0 }

.roles-line { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px }
</style>
