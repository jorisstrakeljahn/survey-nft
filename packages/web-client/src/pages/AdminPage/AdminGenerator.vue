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

    <details class="preview">
      <summary>{{ t('admin.generator.preview.title') }}</summary>
      <pre class="preview__code">
&lt;script defer src="https://vpstunden.hsbi.de/vpp/claim.js?v=1"
  data-survey-id="{{ sid || '__SURVEY_ID__' }}"
  data-points="{{ pts || 1 }}"&gt;&lt;/script&gt;</pre>
    </details>

    <div v-if="err" class="help help--error">{{ err }}</div>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

// eine einzige Vorlage
const TEMPLATE_URL = '/kits/sosci_base.xml'

const sid    = ref('')
const pts    = ref(1)
const err    = ref('')
const isBusy = ref(false)

const canDownload = computed(() => {
  const x = sid.value.trim()
  return x.length > 0 && x.length <= 64 && [1,2,3].includes(pts.value)
})

function onClear(){ sid.value=''; pts.value=1; err.value='' }

/** --- Byte-Utilities: find & replace exact byte sequences --- */
function findBytes(hay: Uint8Array, needle: Uint8Array): number {
  outer: for (let i = 0; i <= hay.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (hay[i + j] !== needle[j]) continue outer
    }
    return i
  }
  return -1
}
function replaceBytesAt(src: Uint8Array, index: number, delLen: number, repl: Uint8Array): Uint8Array {
  const out = new Uint8Array(src.length - delLen + repl.length)
  out.set(src.subarray(0, index), 0)
  out.set(repl, index)
  out.set(src.subarray(index + delLen), index + repl.length)
  return out
}

async function onDownload() {
  err.value = ''
  if (!canDownload.value) { err.value = t('admin.generator.errors.sidRequired'); return }
  try {
    isBusy.value = true

    // 1) Vorlage als BYTES laden (keine Text-Normalisierung!)
    const res = await fetch(TEMPLATE_URL, { cache: 'no-store' })
    const buf = new Uint8Array(await res.arrayBuffer())

    // 2) exakte Byte-Sequenzen vorbereiten
    const enc = new TextEncoder()
    const needle1 = enc.encode('data-survey-id="__SURVEY_ID__"')
    const needle2 = enc.encode('data-points="__POINTS__"')
    const repl1   = enc.encode(`data-survey-id="${sid.value.trim()}"`)
    const repl2   = enc.encode(`data-points="${pts.value}"`)

    // 3) erst survey-id, dann points ersetzen (genau 1x jeweils)
    let i1 = findBytes(buf, needle1)
    if (i1 === -1) throw new Error('placeholder surveyId not found')
    let out = replaceBytesAt(buf, i1, needle1.length, repl1)

    let i2 = findBytes(out, needle2)
    if (i2 === -1) throw new Error('placeholder points not found')
    out = replaceBytesAt(out, i2, needle2.length, repl2)

    // 4) Download – Bytes unverändert außer den ersetzten Segmenten
    const blob = new Blob([out], { type: 'application/xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `sosci_vpp_${sid.value.trim()}_${pts.value}pt.xml`
    a.click()
    URL.revokeObjectURL(a.href)
  } catch (e:any) {
    err.value = t('admin.generator.errors.fetchFailed')
    // optional: console.error(e)
  } finally {
    isBusy.value = false
  }
}
</script>

<style scoped>
.box{border:1px solid #eee;border-radius:12px;background:#fff;padding:14px}
.help{font-size:.95rem;color:#555;margin-top:8px}
.help--error{color:#b00020}
.grid{display:grid;grid-template-columns:2fr 1fr;gap:12px;margin-top:8px}
@media (max-width: 720px){ .grid{grid-template-columns:1fr} }
label{display:flex;flex-direction:column;gap:6px}
input,select{padding:10px 12px;border:1px solid #e5e5e5;border-radius:10px}
.actions{margin-top:12px;display:flex;gap:8px;flex-wrap:wrap}
.btn{padding:6px 10px;border:1px solid #e5e5e5;border-radius:10px;background:#fff;font-weight:700;cursor:pointer}
.btn--ghost{background:#fafafa}
.preview{margin-top:12px}
.preview__code{background:#0b1020;color:#cde;padding:12px;border-radius:10px;overflow:auto}
</style>
