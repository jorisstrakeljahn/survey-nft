<template>
  <app-navbar />

  <div class="nfts-page">
    <main class="nfts-page__main">
      <header class="nfts-page__header">
        <h1>{{ t('nfts.title') }}</h1>
        <!-- Explicit refresh keeps UX predictable (no auto-polling surprises) -->
        <button class="btn" @click="loadMyNfts" :disabled="isLoading">
          {{ t('nfts.actions.refresh') }}
        </button>
      </header>

      <!-- Summary (only when data is present and healthy) -->
      <section class="summary" v-if="!isLoading && !isError">
        <div class="summary__card">
          <div class="summary__item">
            <div class="summary__label">{{ t('nfts.summary.points') }}</div>
            <div class="summary__value">{{ totalPoints }}</div>
          </div>
        </div>
      </section>

      <!-- Loader -->
      <loader v-if="isLoading" class="nfts-page__loader" />

      <!-- Error state (generic copy; we keep details in the console for support) -->
      <section v-if="!isLoading && isError" class="state state--error">
        <h3>{{ t('nfts.error.title') }}</h3>
        <p>{{ t('nfts.error.text') }}</p>
      </section>

      <!-- Empty state -->
      <section v-if="!isLoading && !isError && tokens.length === 0" class="state state--empty">
        <h3>{{ t('nfts.empty.title') }}</h3>
        <p>{{ t('nfts.empty.text') }}</p>
      </section>

      <!-- Grid (lazy images; show a placeholder until metadata is resolved) -->
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

            <!-- Points badge: defensive fallback to 0 -->
            <span class="badge" :class="`badge--p${tkn.points || 0}`">
              {{ t('nfts.card.points', tkn.points || 0, { n: tkn.points || 0 }) }}
            </span>
          </div>

          <div class="card__meta">
            <div class="card__row">
              <span class="card__label">{{ t('nfts.card.tokenId') }}</span>
              <span class="card__value">{{ tkn.tokenId }}</span>
            </div>

            <div class="card__links">
              <button class="link-btn" @click="openExplorer(tkn.tokenId)">
                {{ t('nfts.card.explorer') }}
              </button>
            </div>
          </div>
        </article>
      </section>
    </main>

    <app-footer />
  </div>
</template>

<script lang="ts" setup>
/**
 * NFTs overview:
 * - Read user's VPP tokens and render a compact, responsive grid.
 * - Metadata (URI/points) and images are pulled lazily to keep first paint fast.
 * - All writes happen elsewhere; this page is read-only.
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import AppNavbar from '@/common/AppNavbar.vue'
import AppFooter from '@/common/AppFooter.vue'
import Loader from '@/common/Loader.vue'

import { useErc721 } from '@/composables/contracts/use-erc721'
import { config } from '@/config'

/** Minimal token shape used by the UI */
type Token = {
  tokenId: number
  owner: `0x${string}`
  uri?: string
  points?: number
}

const { t } = useI18n({ useScope: 'global' })
const { loadTokensOf, getMyAddress, getTokenURI, getTokenPoints } = useErc721()

/** Page state */
const isLoading = ref(false)
const isError = ref(false)
const myAddress = ref<`0x${string}` | ''>('')      // purely informative; not required for reads
const tokens = ref<Token[]>([])                    // source-of-truth for the grid
const images = ref<Record<number, string>>({})     // tokenId -> resolved image URL

/** Explorer base (lint-friendly map instead of nested ternaries) */
const erc721Address = config.ERC721_ADDRESS as string
const chainId = Number(config.SUPPORTED_CHAIN_ID || 137)
const POLYGON_EXPLORERS: Record<number, string> = {
  137:   'https://polygonscan.com',
  80001: 'https://mumbai.polygonscan.com',
}
const explorerBase = computed(() => POLYGON_EXPLORERS[chainId] ?? POLYGON_EXPLORERS[137])

/** Aggregate points (defensive towards undefined points) */
const totalPoints = computed(() =>
  tokens.value.reduce((sum, t) => sum + (t.points || 0), 0),
)

/** Highest token id (handy for debugging or deep links) */
const lastTokenId = computed(() =>
  tokens.value.length ? Math.max(...tokens.value.map(t => t.tokenId)) : null,
)

/** Translate ipfs:// URLs to a public HTTP gateway (simple, robust) */
function toHttp(url: string | undefined) {
  if (!url) return ''
  if (!url.startsWith('ipfs://')) return url
  // ipfs://<cid>/...  or ipfs://ipfs/<cid>/...
  const path = url.replace('ipfs://', '').replace(/^ipfs\//, '')
  return `https://ipfs.io/ipfs/${path}`
}

/**
 * Resolve one token's metadata and cache its image URL.
 * Any single failure is non-fatal; we just keep the placeholder.
 */
async function fetchTokenImage(tokenId: number, uri?: string) {
  const tokenUri = uri || await getTokenURI(tokenId)
  if (!tokenUri) return
  try {
    const res = await fetch(toHttp(tokenUri), { cache: 'no-store' })
    if (!res.ok) return
    const meta = await res.json().catch(() => null)
    const img = (meta as any)?.image as string | undefined
    if (img) images.value[tokenId] = toHttp(img)
  } catch {
    // Swallow image/metadata failures; the card will keep a placeholder.
  }
}

/**
 * Load current user's tokens:
 * - fetch base list
 * - lazily fill missing URI/points
 * - resolve images in parallel
 *
 * Errors are handled visibly (log and state) to satisfy lint rules and aid support.
 */
async function loadMyNfts() {
  isLoading.value = true
  isError.value = false
  try {
    myAddress.value = (await getMyAddress()) || ''
    const list = await loadTokensOf()
    tokens.value = list

    // Enrich each token (URI/points) and fetch image in parallel
    await Promise.all(list.map(async (t) => {
      if (!t.uri)         t.uri   = await getTokenURI(t.tokenId)
      if (t.points == null) t.points = await getTokenPoints(t.tokenId)
      await fetchTokenImage(t.tokenId, t.uri)
    }))
  } catch (e: unknown) {
    // Visible handling (lint-friendly) + actionable diagnostics
    const msg = e instanceof Error ? e.message : String(e)
    console.error('NftsPage load failed:', msg)
    isError.value = true
    return
  } finally {
    isLoading.value = false
  }
}

/** Open token in the block explorer (contract page filtered by token id) */
function openExplorer(tokenId: number) {
  const url = `${explorerBase.value}/token/${erc721Address}?a=${tokenId}`
  window.open(url, '_blank', 'noopener')
}

/** Initial load on mount */
onMounted(loadMyNfts)
</script>

<style lang="scss" scoped>
.nfts-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.nfts-page__main {
  flex: 1;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 32px 16px;
}

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


.summary {
  margin-bottom: 16px;
}

.summary__card {
  display: grid;
  gap: 12px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 14px;
}

.summary__item {
  text-align: center;
}

.summary__label {
  color: #666;
  font-size: 0.9rem;
}

.summary__value {
  font-size: 1.4rem;
  font-weight: 800;
}

.nfts-page__loader {
  margin: 24px 0;
}

.state {
  text-align: center;
  padding: 28px 16px;
}

.state--error h3 {
  color: #b00020;
}

.state--empty h3 {
  color: #333;
}

.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

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

.badge--p1 {
  background: #64748b;
}

.badge--p2 {
  background: #10b981;
}

.badge--p3 {
  background: #2563eb;
}

.card__meta {
  padding: 12px 14px;
}

.card__row {
  display: flex;
  justify-content: right;
  align-items: center;
  margin-bottom: 6px;
}

.card__label {
  color: #666;
  padding-right: 4px;
}

.card__value {
  font-weight: 800;
}

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

.link:hover {
  text-decoration: underline;
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

@media (max-width: 530px) {
  .summary__card { grid-template-columns: 1fr; }
  .grid { grid-template-columns: 1fr; }
}
</style>
