<template>
  <div class="nfts-page">
    <app-navbar />

    <main class="nfts-page__main">
      <header class="nfts-page__header">
        <h1>{{ t('nfts.title') }}</h1>
        <button class="btn" @click="loadMyNfts" :disabled="isLoading">
          {{ t('nfts.actions.refresh') }}
        </button>
      </header>

      <!-- Summary -->
      <section class="summary" v-if="!isLoading && !isError">
        <div class="summary__card">
          <div class="summary__item">
            <div class="summary__label">{{ t('nfts.summary.points') }}</div>
            <div class="summary__value">{{ totalPoints }}</div>
          </div>
          <div class="summary__item">
            <div class="summary__label">{{ t('nfts.summary.nfts') }}</div>
            <div class="summary__value">{{ tokens.length }}</div>
          </div>
          <div class="summary__item" v-if="lastTokenId">
            <div class="summary__label">{{ t('nfts.summary.lastActivity') }}</div>
            <div class="summary__value">{{ lastTokenId }}</div>
          </div>
        </div>
      </section>

      <!-- Loader -->
      <loader v-if="isLoading" class="nfts-page__loader" />

      <!-- Error -->
      <section v-if="!isLoading && isError" class="state state--error">
        <h3>{{ t('nfts.error.title') }}</h3>
        <p>{{ t('nfts.error.text') }}</p>
      </section>

      <!-- Empty -->
      <section v-if="!isLoading && !isError && tokens.length === 0" class="state state--empty">
        <h3>{{ t('nfts.empty.title') }}</h3>
        <p>{{ t('nfts.empty.text') }}</p>
      </section>

      <!-- Grid -->
      <section v-if="!isLoading && !isError && tokens.length > 0" class="grid">
        <article v-for="tkn in tokens" :key="tkn.tokenId" class="card">
          <div class="card__image-wrap">
            <img
              v-if="images[tkn.tokenId]"
              :src="images[tkn.tokenId]"
              :alt="`Token #${tkn.tokenId}`"
              class="card__image"
              loading="lazy"
            />
            <div v-else class="card__placeholder"></div>

            <span class="badge" :class="`badge--p${tkn.points || 0}`">
              {{ t('nfts.card.points', { n: tkn.points || 0 }) }}
            </span>
          </div>

          <div class="card__meta">
            <div class="card__row">
              <span class="card__label">{{ t('nfts.card.tokenId') }}</span>
              <span class="card__value">{{ tkn.tokenId }}</span>
            </div>

            <div class="card__links">
              <a
                v-if="tkn.uri"
                :href="tkn.uri"
                target="_blank"
                rel="noopener"
                class="link"
              >
                {{ t('nfts.card.metadata') }}
              </a>

              <a
                :href="`${explorerBase}/token/${erc721Address}?a=${tkn.tokenId}`"
                target="_blank"
                rel="noopener"
                class="link"
              >
                {{ t('nfts.card.explorer') }}
              </a>
            </div>
          </div>
        </article>
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

type Token = { tokenId: number, owner: `0x${string}`, uri?: string, points?: number }

const { t } = useI18n({ useScope: 'global' })
const { loadTokensOf, getMyAddress } = useErc721()

const isLoading = ref(false)
const isError = ref(false)
const myAddress = ref<`0x${string}` | ''>('')
const tokens = ref<Token[]>([])
const images = ref<Record<number, string>>({})

const erc721Address = config.ERC721_ADDRESS as string

const chainId = Number(config.SUPPORTED_CHAIN_ID || 137)
const explorerBase = computed(() =>
  chainId === 137
    ? 'https://polygonscan.com'
    : chainId === 80001
      ? 'https://mumbai.polygonscan.com'
      : 'https://polygonscan.com'
)

const totalPoints = computed(() =>
  tokens.value.reduce((sum, t) => sum + (t.points || 0), 0)
)

const lastTokenId = computed(() =>
  tokens.value.length ? Math.max(...tokens.value.map(t => t.tokenId)) : null
)

async function fetchTokenImage (tokenId: number, uri?: string) {
  if (!uri) return
  try {
    const res = await fetch(uri, { cache: 'no-store' })
    if (!res.ok) return
    const meta = await res.json()
    const img = meta?.image as string | undefined
    if (img) images.value[tokenId] = img
  } catch { /* ignore */ }
}

async function loadMyNfts () {
  isLoading.value = true
  isError.value = false
  try {
    myAddress.value = (await getMyAddress()) || ''
    const list = await loadTokensOf()
    tokens.value = list
    // metadaten-bilder lazy nachladen
    await Promise.all(list.map(t => fetchTokenImage(t.tokenId, t.uri)))
  } catch (e) {
    console.error(e)
    isError.value = true
  }
  isLoading.value = false
}

onMounted(loadMyNfts)
</script>

<style lang="scss" scoped>
/* Seite: volle Höhe + Spaltenlayout: Header / Main / Footer */
.nfts-page {
  min-height: 100vh;           /* oder 100svh für Mobile-Safe */
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Main nimmt restlichen Platz ein und ist zentriert */
.nfts-page__main {
  flex: 1;                     /* <-- wichtig: drückt Footer nach unten */
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;              /* zentriert */
  padding: 24px 16px 32px 16px;
}

/* Headline + Refresh */
.nfts-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;

  h1 { font-size: 1.75rem; margin: 0 }
  .btn {
    padding: 10px 14px;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
    background: #fff;
    font-weight: 700;
    cursor: pointer;
  }
}

/* Summary Cards */
.summary { margin-bottom: 16px }
.summary__card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 14px;
}
.summary__item { text-align: center }
.summary__label { color: #666; font-size: .9rem }
.summary__value { font-size: 1.4rem; font-weight: 800 }

/* Loader / States */
.nfts-page__loader { margin: 24px 0 }
.state { text-align: center; padding: 28px 16px }
.state--error h3 { color: #b00020 }
.state--empty h3 { color: #333 }

/* Grid der Karten */
.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

/* Karte */
.card {
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
}
.card__image-wrap { position: relative; aspect-ratio: 16 / 10; background: #fafafa }
.card__image { width: 100%; height: 100%; object-fit: cover; display: block }
.card__placeholder {
  width: 100%; height: 100%;
  background: repeating-linear-gradient(45deg,#f6f6f6,#f6f6f6 10px,#f0f0f0 10px,#f0f0f0 20px);
}

/* Punkte-Badge */
.badge {
  position: absolute; bottom: 8px; left: 8px;
  padding: 6px 10px; border-radius: 999px;
  font-size: .8rem; font-weight: 800; color: #fff; background: #333;
}
.badge--p1 { background: #64748b }
.badge--p2 { background: #10b981 }
.badge--p3 { background: #2563eb }

/* Meta */
.card__meta { padding: 12px 14px }
.card__row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px }
.card__label { color: #666; font-size: .9rem }
.card__value { font-weight: 800 }

/* Links */
.card__links { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 6px }
.link { color: #2563eb; text-decoration: none; font-weight: 700 }
.link:hover { text-decoration: underline }

/* Responsive */
@media (max-width: 530px) {
  .summary__card { grid-template-columns: 1fr }
  .grid { grid-template-columns: 1fr }
}
</style>
