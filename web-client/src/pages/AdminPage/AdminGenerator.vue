<!-- src/pages/AdminPage/AdminGenerator.vue -->
<template>
  <section class="box">
    <h2>{{ t('admin.generator.title') }}</h2>
    <p class="help">{{ t('admin.generator.desc') }}</p>

    <div class="grid">
      <label>
        {{ t('admin.generator.fields.surveyId.label') }}
        <input
          v-model="sid"
          :placeholder="t('admin.generator.fields.surveyId.placeholder')"
          @keydown.enter.prevent="onDownload"
        />
      </label>

      <label>
        {{ t('admin.generator.fields.points.label') }}
        <select v-model.number="pts">
          <option :value="1">1</option>
          <option :value="2">2</option>
          <option :value="3">3</option>
        </select>
      </label>
    </div>

    <div class="actions">
      <button class="btn" :disabled="!canDownload || isBusy" @click="onDownload">
        {{ t('admin.generator.actions.download') }}
      </button>
      <button class="btn btn--ghost" :disabled="isBusy" @click="onClear">
        {{ t('common.clear') }}
      </button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

/**
 * Single SoSci starter template we patch in-place.
 * We operate on BYTES (not text) to avoid any normalization
 * changing offsets, encodings or line endings.
 */
const TEMPLATE_URL = '/kits/sosci_base.xml'

/** Minimal UI state */
const sid    = ref('')      // study identifier (surveyId)
const pts    = ref(1)       // point value (1..3)
const err    = ref('')      // last error (localized)
const isBusy = ref(false)   // disable UI while generating

/**
 * Basic guard: keep inputs sane before touching the template.
 * Keeps the happy path simple inside onDownload().
 */
const canDownload = computed(() => {
  const x = sid.value.trim()
  return x.length > 0 && x.length <= 64 && [1,2,3].includes(pts.value)
})

/** Clear form state */
function onClear(){ sid.value=''; pts.value=1; err.value='' }

/**
 * -------- Byte helpers ----------
 * findBytes: naive O(n*m) subarray search.
 * Good enough for tiny XML templates (<100 KB). Avoids string conversion.
 */
function findBytes(hay: Uint8Array, needle: Uint8Array): number {
  const limit = hay.length - needle.length
  for (let i = 0; i <= limit; i++) {
    let match = true
    for (let j = 0; j < needle.length; j++) {
      if (hay[i + j] !== needle[j]) { match = false; break }
    }
    if (match) return i
  }
  return -1
}

/**
 * replaceBytesAt: create a new buffer with one exact replacement at index.
 * No mutation of the source buffer; makes reasoning/debugging easier.
 */
function replaceBytesAt(src: Uint8Array, index: number, delLen: number, repl: Uint8Array): Uint8Array {
  const out = new Uint8Array(src.length - delLen + repl.length)
  out.set(src.subarray(0, index), 0)
  out.set(repl, index)
  out.set(src.subarray(index + delLen), index + repl.length)
  return out
}

/**
 * Download flow:
 *  1) validate inputs
 *  2) fetch template as raw bytes
 *  3) prepare exact byte needles/replacements
 *  4) perform two single replacements (surveyId, points)
 *  5) trigger a client-side download (Blob -> object URL)
 *
 * We intentionally avoid any XML parsing to keep this robust across encodings.
 */
async function onDownload() {
  err.value = ''
  if (!canDownload.value) { err.value = t('admin.generator.errors.sidRequired'); return }

  try {
    isBusy.value = true

    // 1) Load template as BYTES (no text normalization)
    const res = await fetch(TEMPLATE_URL, { cache: 'no-store' })
    const buf = new Uint8Array(await res.arrayBuffer())

    // 2) Prepare exact byte patterns
    const enc = new TextEncoder()
    const needle1 = enc.encode('data-survey-id="__SURVEY_ID__"')
    const needle2 = enc.encode('data-points="__POINTS__"')
    const repl1   = enc.encode(`data-survey-id="${sid.value.trim()}"`)
    const repl2   = enc.encode(`data-points="${pts.value}"`)

    // 3) Replace surveyId once, then points once
    const i1 = findBytes(buf, needle1)
    if (i1 === -1) {
      err.value = t('placeholder surveyId not found')
      return
    }
    let out = replaceBytesAt(buf, i1, needle1.length, repl1)

    const i2 = findBytes(out, needle2)
    if (i2 === -1) {
      err.value = t('placeholder points not found')
      return
    }
    out = replaceBytesAt(out, i2, needle2.length, repl2)

    // 4) Client-side download (keeps bytes identical apart from replacements)
    const blob = new Blob([out], { type: 'application/xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `sosci_vpp_${sid.value.trim()}_${pts.value}pt.xml`
    a.click()
    URL.revokeObjectURL(a.href)
  } catch (e: unknown) {
    // Handle or rethrow intentionally; here we surface a friendly error and log the details.
    const msg = e instanceof Error ? e.message : String(e)
    console.error('AdminGenerator failed:', msg)
    err.value = t('admin.generator.errors.fetchFailed')
    return
  } finally {
    isBusy.value = false
  }
}
</script>

<style scoped>
.box{
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
  padding: 14px;
}

.help{
  font-size: 0.95rem;
  color: #555;
  margin-top: 8px;
}

.grid{
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
  margin-top: 8px;
}

@media (max-width: 720px){
  .grid{
    grid-template-columns: 1fr;
  }
}

label{
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input,select{
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
}

.actions{
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn{
  padding: 6px 10px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  background: #fff;
  font-weight: 700;
  cursor: pointer;
}

.btn--ghost{
  background: #fafafa;
}
</style>
