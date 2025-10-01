<template>
  <teleport to="body">
    <div v-if="open" class="meta-overlay" @click.self="emitClose">
      <div class="meta-modal">
        <header class="meta-header">
          <h3 class="meta-title">
            {{ meta?.name ?? `Token #${tokenId}` }}
          </h3>
          <button class="meta-close" @click="emitClose" aria-label="Close">×</button>
        </header>

        <section class="meta-body">
          <div class="meta-left">
            <div class="media-wrap">
              <img
                v-if="imageUrl"
                :src="imageUrl"
                :alt="meta?.name || `Token #${tokenId}`"
                @error="onImgError"
              />
              <div v-else class="media-fallback">no image</div>
            </div>

            <div class="quick">
              <div class="q-row">
                <span class="q-label">Token</span>
                <span class="q-val">#{{ tokenId }}</span>
              </div>
              <div v-if="owner" class="q-row">
                <span class="q-label">Owner</span>
                <span class="q-val">{{ short(owner) }}</span>
              </div>
              <div v-if="typeof points === 'number'" class="q-row">
                <span class="q-label">Points</span>
                <span class="q-val">{{ points }}</span>
              </div>
            </div>
          </div>

          <div class="meta-right">
            <p v-if="meta?.description" class="desc">{{ meta.description }}</p>

            <div v-if="Array.isArray(meta?.attributes) && meta.attributes.length" class="attrs">
              <h4>Attributes</h4>
              <table>
                <tbody>
                <tr v-for="(a, i) in meta.attributes" :key="i">
                  <th>{{ a.trait_type || a.type || 'trait' }}</th>
                  <td>{{ a.value }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <div class="links">
              <a v-if="normalizedUri" class="link" :href="normalizedUri" target="_blank" rel="noopener">
                tokenURI
              </a>
              <a
                v-if="explorerBase && contractAddress && tokenId !== undefined"
                class="link"
                :href="`${explorerBase}/token/${contractAddress}?a=${tokenId}`"
                target="_blank" rel="noopener"
              >
                Explorer
              </a>
              <a v-if="imageUrl" class="link" :href="imageUrl" target="_blank" rel="noopener">image</a>
            </div>

            <details class="raw">
              <summary>Raw JSON</summary>
              <pre>{{ prettyJson }}</pre>
            </details>
          </div>
        </section>

        <footer class="meta-footer">
          <button class="btn" @click="emitClose">OK</button>
        </footer>

        <div v-if="loading" class="overlay-msg">Loading…</div>
        <div v-if="error" class="overlay-msg overlay-err">{{ error }}</div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'

type Attr = { trait_type?: string; type?: string; value?: string | number }
type Meta = { name?: string; description?: string; image?: string; attributes?: Attr[] }

const props = defineProps<{
  open: boolean
  tokenId: number
  tokenUri?: string
  owner?: `0x${string}`
  points?: number
  contractAddress?: string
  explorerBase?: string
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const loading = ref(false)
const error = ref('')
const meta = ref<Meta | null>(null)
const imageUrl = ref<string | ''>('')

const normalizedUri = computed(() => normalizeUri(props.tokenUri || ''))
const prettyJson = computed(() => (meta.value ? JSON.stringify(meta.value, null, 2) : ''))

function normalizeUri (uri: string) {
  if (!uri) return ''
  if (uri.startsWith('ipfs://')) {
    // du kannst hier deinen bevorzugten Gateway setzen
    return `https://ipfs.io/ipfs/${uri.slice(7)}`
  }
  return uri
}

function normalizeImage (uri?: string) {
  if (!uri) return ''
  return normalizeUri(uri)
}

function short (addr?: string) {
  if (!addr) return ''
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function onImgError () {
  imageUrl.value = ''
}

function emitClose () {
  emit('close')
}

async function fetchMeta () {
  error.value = ''
  meta.value = null
  imageUrl.value = ''
  if (!props.open || !normalizedUri.value) return
  loading.value = true
  try {
    const res = await fetch(normalizedUri.value, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const m = (await res.json()) as Meta
    meta.value = m
    imageUrl.value = normalizeImage(m?.image)
  } catch (e: any) {
    error.value = `Failed to load metadata: ${e?.message ?? String(e)}`
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.open, props.tokenUri] as const,
  async ([isOpen]) => { if (isOpen) await fetchMeta() },
  { immediate: true },
)
</script>

<style scoped>
.meta-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5);
  display: grid; place-items: center; z-index: 10000;
}
.meta-modal {
  position: relative;
  width: min(900px, 96vw);
  max-height: 92vh;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,.25);
  display: grid;
  grid-template-rows: auto 1fr auto;
}
.meta-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px; border-bottom: 1px solid #eee;
}
.meta-title { margin: 0; font-size: 1.1rem; font-weight: 800 }
.meta-close { background: transparent; border: 0; font-size: 20px; cursor: pointer }

.meta-body {
  display: grid; grid-template-columns: 360px 1fr; gap: 16px; padding: 14px; overflow: auto;
}
@media (max-width: 820px) {
  .meta-body { grid-template-columns: 1fr; }
}
.meta-left .media-wrap {
  position: relative; aspect-ratio: 1 / 1; background: #fafafa; border: 1px solid #eee; border-radius: 10px;
  display: grid; place-items: center; overflow: hidden;
}
.media-wrap img { width: 100%; height: 100%; object-fit: cover; display: block }
.media-fallback { color: #999; font-size: .9rem }
.quick { margin-top: 10px }
.q-row { display: flex; justify-content: space-between; margin: 4px 0 }
.q-label { color: #666 }
.q-val { font-weight: 800 }

.desc { white-space: pre-wrap; margin: 0 0 8px 0 }
.attrs table { width: 100%; border-collapse: collapse; margin-top: 6px }
.attrs th, .attrs td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #f2f2f2 }
.links { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px }
.link { color: #2563eb; text-decoration: none; font-weight: 700 }
.link:hover { text-decoration: underline }

.raw { margin-top: 10px }
.raw pre { background: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 10px; overflow: auto; max-height: 220px }

.meta-footer { padding: 10px 14px; border-top: 1px solid #eee; display: flex; justify-content: flex-end }
.btn { padding: 8px 12px; border: 1px solid #e5e5e5; border-radius: 10px; background: #fff; font-weight: 700; cursor: pointer }

.overlay-msg {
  position: absolute; inset: 0; background: rgba(255,255,255,.75);
  display: grid; place-items: center; font-weight: 800; color: #333;
}
.overlay-err { color: #b00020 }
</style>
