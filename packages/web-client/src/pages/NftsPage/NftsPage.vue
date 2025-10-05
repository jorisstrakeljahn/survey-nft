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
            <div class="summary__label">{{ t('nfts.summary.latestToken') }}</div>
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
              <!-- Details-Button (Modal) -->
              <button class="link-btn" @click="openMeta(tkn)">
                {{ t('nfts.card.metadata') }}
              </button>

              <!-- Explorer im gleichen Stil -->
              <button class="link-btn" @click="openExplorer(tkn.tokenId)">
                {{ t('nfts.card.explorer') }}
              </button>
            </div>
          </div>
        </article>
      </section>
    </main>

    <app-footer />

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
      :image-url="metaToken ? images[metaToken.tokenId] : ''"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import AppNavbar from '@/common/AppNavbar.vue'
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
const { loadTokensOf, getMyAddress, getTokenURI, getTokenPoints } = useErc721()

const isLoading = ref(false)
const isError = ref(false)
const myAddress = ref<`0x${string}` | ''>('')
const tokens = ref<Token[]>([])
const images = ref<Record<number, string>>({})

const showMeta = ref(false)
const metaToken = ref<Token | null>(null)

const erc721Address = config.ERC721_ADDRESS as string
const chainId = Number(config.SUPPORTED_CHAIN_ID || 137)
const explorerBase = computed(() =>
  chainId === 137
    ? 'https://polygonscan.com'
    : chainId === 80001
      ? 'https://mumbai.polygonscan.com'
      : 'https://polygonscan.com',
)

const totalPoints = computed(() =>
  tokens.value.reduce((sum, t) => sum + (t.points || 0), 0),
)

const lastTokenId = computed(() =>
  tokens.value.length ? Math.max(...tokens.value.map(t => t.tokenId)) : null,
)

function toHttp(url: string | undefined) {
  if (!url) return '';
  if (!url.startsWith('ipfs://')) return url;
  // ipfs://<cid>/...  oder ipfs://ipfs/<cid>/...
  const path = url.replace('ipfs://', '').replace(/^ipfs\//, '');
  return `https://ipfs.io/ipfs/${path}`;
}

async function fetchTokenImage(tokenId: number, uri?: string) {
  // Sicherstellen, dass wir eine URI haben
  const tokenUri = uri || await getTokenURI(tokenId);
  if (!tokenUri) return;

  // IMPORTANT: ipfs:// → https://ipfs.io/ipfs/<cid>
  const res = await fetch(toHttp(tokenUri), { cache: 'no-store' });
  if (!res.ok) return;

  const meta = await res.json();
  const img = meta?.image as string | undefined;
  if (img) {
    images.value[tokenId] = toHttp(img); // auch das image normalisieren
  }
}

async function loadMyNfts() {
  isLoading.value = true;
  isError.value = false;
  try {
    myAddress.value = (await getMyAddress()) || '';
    const list = await loadTokensOf();
    tokens.value = list;

    // URI & Points ggf. nachladen und dann Bilder fetchen
    await Promise.all(list.map(async (t) => {
      if (!t.uri) t.uri = await getTokenURI(t.tokenId);
      if (t.points == null) t.points = await getTokenPoints(t.tokenId);
      await fetchTokenImage(t.tokenId, t.uri);
    }));
  } catch (e) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
}

/** Details-Popup öffnen; fehlende Felder on the fly nachladen */
async function openMeta(tkn: Token) {
  try {
    if (!tkn.uri) tkn.uri = await getTokenURI(tkn.tokenId)
    if (tkn.points == null) tkn.points = await getTokenPoints(tkn.tokenId)
    metaToken.value = tkn
    showMeta.value = true
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('openMeta failed:', e)
  }
}

/** Explorer in neuem Tab, gleicher Stil wie „Metadaten“ */
function openExplorer(tokenId: number) {
  const url = `${explorerBase.value}/token/${erc721Address}?a=${tokenId}`
  window.open(url, '_blank', 'noopener')
}

onMounted(loadMyNfts)
</script>

<style lang="scss" scoped>
/* Seite: volle Höhe + Spaltenlayout */
.nfts-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Main nimmt restlichen Platz ein und ist zentriert */
.nfts-page__main {
  flex: 1;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 32px 16px;
}

/* Headline + Refresh */
.nfts-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;

  h1 {
    font-size: 1.75rem;
    margin: 0;
  }

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
.summary { margin-bottom: 16px; }
.summary__card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 14px;
}
.summary__item { text-align: center; }
.summary__label { color: #666; font-size: 0.9rem; }
.summary__value { font-size: 1.4rem; font-weight: 800; }

/* Loader / States */
.nfts-page__loader { margin: 24px 0; }
.state { text-align: center; padding: 28px 16px; }
.state--error h3 { color: #b00020; }
.state--empty h3 { color: #333; }

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
.card__image-wrap {
  position: relative;
  aspect-ratio: 16 / 10;
  background: #fafafa;
}
.card__image {
  width: 100%;
  object-fit: cover;
  display: block;
}
.card__placeholder {
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
      45deg,
      #f6f6f6,
      #f6f6f6 10px,
      #f0f0f0 10px,
      #f0f0f0 20px
  );
}

/* Punkte-Badge */
.badge {
  position: absolute;
  left: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
  color: #fff;
  background: #333;
}
.badge--p1 { background: #64748b; }
.badge--p2 { background: #10b981; }
.badge--p3 { background: #2563eb; }

/* Meta */
.card__meta { padding: 12px 14px; }
.card__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.card__label { color: #666; font-size: 0.9rem; }
.card__value { font-weight: 800; }

/* Links / Buttons im Link-Stil */
.card__links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 6px;
}
.link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 700;
}
.link:hover { text-decoration: underline; }

/* Link-styled Button – für Metadaten & Explorer einheitlich */
.link-btn {
  background: transparent;
  border: 0;
  padding: 0;
  font: inherit;
  cursor: pointer;
  color: #2563eb;
}
.link-btn:hover { text-decoration: underline; }

/* Responsive */
@media (max-width: 530px) {
  .summary__card { grid-template-columns: 1fr; }
  .grid { grid-template-columns: 1fr; }
}
</style>
