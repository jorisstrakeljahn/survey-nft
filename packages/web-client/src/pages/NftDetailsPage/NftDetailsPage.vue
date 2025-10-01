<template>
  <div class="nft-details">
    <app-navbar />

    <main class="nft-details__main" v-if="!isLoading && !isError">
      <header class="nft-details__header">
        <h1>
          {{ meta?.name || t('nft.title', { id: tokenId }) }}
        </h1>
        <router-link class="back" :to="{ name: ROUTE_NAMES.vppNFTs }">
          {{ t('nft.backWithArrow') }}
        </router-link>
      </header>

      <section class="nft">
        <div class="nft__image-wrap">
          <img
            v-if="image"
            :src="image"
            :alt="meta?.name || `Token #${tokenId}`"
            class="nft__image"
            loading="lazy"
          />
          <div v-else class="nft__placeholder" />
          <span class="badge" :class="`badge--p${points || 0}`">
            {{ t('nft.points', { n: points || 0 }) }}
          </span>
        </div>

        <div class="nft__info">
          <div class="row">
            <div class="label">{{ t('nft.tokenId') }}</div>
            <div class="value">{{ t('nft.tokenIdValue', { id: tokenId }) }}</div>
          </div>

          <div class="row">
            <div class="label">{{ t('nft.owner') }}</div>
            <div class="value">{{ short(owner) }}</div>
          </div>

          <div v-if="meta?.description" class="desc">
            <h3>{{ t('nft.description') }}</h3>
            <p>{{ meta.description }}</p>
          </div>

          <div v-if="Array.isArray(meta?.attributes) && meta.attributes.length" class="attrs">
            <h3>{{ t('nft.attributes') }}</h3>
            <ul>
              <li v-for="(a, i) in meta.attributes" :key="i">
                <b>{{ t('nft.traitLabel', { name: a.trait_type || a.type || 'trait' }) }}</b>
                <span>{{ a.value }}</span>
              </li>
            </ul>
          </div>

          <div class="links">
            <a
              v-if="tokenURI"
              :href="tokenURI"
              target="_blank"
              rel="noopener"
              class="link"
            >
              {{ t('nft.metadata') }}
            </a>
            <a
              :href="`${explorerBase}/token/${erc721Address}?a=${tokenId}`"
              target="_blank"
              rel="noopener"
              class="link"
            >
              {{ t('nft.explorer') }}
            </a>
          </div>
        </div>
      </section>
    </main>

    <loader v-if="isLoading" class="nft-details__loader" />

    <section v-if="!isLoading && isError" class="state state--error">
      <h3>{{ t('nft.errorTitle') }}</h3>
      <p>{{ t('nft.errorText') }}</p>
      <button class="btn" @click="loadDetails">
        {{ t('nft.retry') }}
      </button>
    </section>

    <app-footer />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppNavbar from '@/common/AppNavbar.vue'
import AppFooter from '@/common/AppFooter.vue'
import Loader from '@/common/Loader.vue'
import { ROUTE_NAMES } from '@/enums'
import { useErc721 } from '@/composables/contracts/use-erc721'
import { config } from '@/config'

type Attr = { trait_type?: string, type?: string, value?: string | number }
type Meta = { name?: string, description?: string, image?: string, attributes?: Attr[] }

const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const { getNft, getTokenURI, getOwnerOf, getTokenPoints } = useErc721()

const tokenId = Number(route.params.tokenId)
const isLoading = ref(false)
const isError = ref(false)

const owner = ref<`0x${string}` | ''>('')
const tokenURI = ref<string | ''>('')
const points = ref<number>(0)
const meta = ref<Meta | null>(null)
const image = ref<string | ''>('')

const erc721Address = config.ERC721_ADDRESS as string
const chainId = Number(config.SUPPORTED_CHAIN_ID || 137)
const explorerBase = computed(() =>
  chainId === 137
    ? 'https://polygonscan.com'
    : chainId === 80001
      ? 'https://mumbai.polygonscan.com'
      : 'https://polygonscan.com'
)

function short (addr?: string) {
  if (!addr) return ''
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

async function fetchMeta (uri?: string) {
  if (!uri) return
  try {
    const res = await fetch(uri, { cache: 'no-store' })
    if (!res.ok) return
    const m = await res.json()
    meta.value = m as Meta
    if (typeof m?.image === 'string') image.value = m.image
  } catch (e) {
    /*ifnore meta fetch error*/
  }
}

async function loadDetails () {
  isLoading.value = true
  isError.value = false
  try {
    // 1) Schnellweg: getNft liefert owner/uri/points (falls verfügbar)
    const n = await getNft(tokenId)
    owner.value = (n?.owner as `0x${string}`) || (await getOwnerOf(tokenId)) || ''
    tokenURI.value = n?.uri || (await getTokenURI(tokenId)) || ''
    points.value = typeof n?.points === 'number' ? n.points : await getTokenPoints(tokenId)

    // 2) Metadaten für Bild/Description/evtl. Punkte-Fallback
    await fetchMeta(tokenURI.value)
  } catch (e) {
    console.error(e)
    isError.value = true
  }
  isLoading.value = false
}

onMounted(loadDetails)
</script>

<style lang="scss" scoped>
.nft-details { display: flex; flex-direction: column; min-height: 100vh }
.nft-details__main {
  flex: 1;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 32px 16px;
}
.nft-details__header {
  display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px;
  h1 { font-size: 1.6rem; margin: 0 }
  .back { color: #2563eb; text-decoration: none; font-weight: 700 }
  .back:hover { text-decoration: underline }
}
.nft {
  display: grid; gap: 16px; grid-template-columns: 1fr 1fr;
}
@media (max-width: 980px) { .nft { grid-template-columns: 1fr } }

.nft__image-wrap { position: relative; aspect-ratio: 1 / 1; background: #fafafa; border: 1px solid #eee; border-radius: 12px; overflow: hidden }
.nft__image { width: 100%; height: 100%; object-fit: cover; display: block }
.nft__placeholder {
  width: 100%; height: 100%;
  background: repeating-linear-gradient(45deg,#f6f6f6,#f6f6f6 10px,#f0f0f0 10px,#f0f0f0 20px);
}

.badge {
  position: absolute; bottom: 8px; left: 8px;
  padding: 6px 10px; border-radius: 999px; font-size: .8rem; font-weight: 800; color: #fff; background: #333;
}
.badge--p1 { background: #64748b }
.badge--p2 { background: #10b981 }
.badge--p3 { background: #2563eb }

.nft__info { border: 1px solid #eee; border-radius: 12px; background: #fff; padding: 14px }
.row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px }
.label { color: #666; font-size: .9rem }
.value { font-weight: 800 }
.desc { margin-top: 10px }
.attrs { margin-top: 10px }
.attrs ul { margin: 0; padding-left: 1.2rem }
.links { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px }
.link { color: #2563eb; text-decoration: none; font-weight: 700 }
.link:hover { text-decoration: underline }

.nft-details__loader { margin: 24px 0 }
.state { text-align: center; padding: 28px 16px }
.state--error h3 { color: #b00020 }
.btn { padding: 10px 14px; border: 1px solid #e5e5e5; border-radius: 10px; background: #fff; font-weight: 700; cursor: pointer }
</style>
