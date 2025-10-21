<!-- /pages/ImprintPage/ImprintPage.vue -->
<template>
  <div id="top" />

  <main class="imprint" role="main" aria-labelledby="imprint-title">
    <!-- Hero -->
    <section class="imprint__hero">
      <div class="imprint__container imprint__hero-inner">
        <h1 id="imprint-title" class="imprint__title">
          {{ t('imprint.title') }}
        </h1>
        <p class="imprint__meta">
          {{ t('imprint.lastUpdatedPrefix') }}
          <span>{{ t('imprint.lastUpdated') }}</span>
        </p>
      </div>
    </section>

    <!-- Inhalt -->
    <section class="imprint__container imprint__content">
      <article
        v-for="section in sections"
        :id="section.id"
        :key="section.id"
        class="imprint__card imprint__section"
      >
        <header class="imprint__card-header">
          <h2 class="imprint__card-title">{{ section.title }}</h2>
        </header>

        <div class="imprint__card-body">
          <!-- Fließtexte -->
          <p
            v-for="(p, idx) in section.paras || []"
            :key="`p-${idx}`"
            class="imprint__paragraph"
          >
            {{ p }}
          </p>

          <!-- Liste -->
          <ul v-if="section.list && section.list.length" class="imprint__list">
            <li v-for="(item, i) in section.list" :key="`li-${i}`">
              {{ item }}
            </li>
          </ul>

          <!-- Adresse / Kontakt -->
          <address v-if="section.address || section.contact" class="imprint__address">
            <p v-for="(line, i) in section.address || []" :key="`addr-${i}`">
              {{ line }}
            </p>
            <p v-for="(c, i) in section.contact || []" :key="`contact-${i}`">
              <strong>{{ c.label }}:</strong>
              <a v-if="c.href" :href="c.href" class="imprint__link">{{ c.value }}</a>
              <span v-else>{{ c.value }}</span>
            </p>
          </address>

          <!-- Unterpunkte (z. B. Haftungsabschnitte) -->
          <div
            v-for="(sub, i) in section.sub || []"
            :key="`sub-${i}`"
            class="imprint__sub"
          >
            <h3 class="imprint__sub-title">{{ sub.name }}</h3>
            <p class="imprint__paragraph" v-for="(p, j) in sub.paras || []" :key="`subp-${j}`">
              {{ p }}
            </p>
          </div>
        </div>
      </article>

      <!-- Zurück nach oben -->
      <div class="imprint__backtop">
        <a href="#top" class="imprint__backtop-btn">{{ t('imprint.backToTop') }}</a>
      </div>
    </section>

    <AppFooter />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppFooter from '@/common/AppFooter.vue'

const { t, tm } = useI18n({ useScope: 'global' })

type Section = {
  id: string
  title: string
  paras?: string[]
  list?: string[]
  address?: string[]
  contact?: Array<{ label: string; value: string; href?: string }>
  sub?: Array<{ name: string; paras?: string[] }>
}

const sections = computed<Section[]>(() => tm('imprint.sections') as any[])
</script>

<style>
html { scroll-behavior: smooth; }
</style>

<style scoped lang="scss">
/* White Mode – gleiche Optik wie die Privacy-Seite */
.imprint {
  --bg: #ffffff;
  --surface: #ffffff;
  --text: #1b1b1b;
  --muted: #5f6368;
  --border: #e7e7e7;
  --shadow: 0 1px 2px rgba(0,0,0,.05), 0 6px 16px rgba(0,0,0,.06);
  --accent: #0b57d0;
  --accent-underline: rgba(11,87,208,.25);

  color: var(--text);
  background: var(--bg);
  line-height: 1.65;
  font-size: clamp(15px, 1.05vw, 17px);
}

.imprint__container {
  max-width: 1080px;
  margin-inline: auto;
  padding-inline: clamp(14px, 3vw, 24px);
}

/* Hero */
.imprint__hero {
  background: linear-gradient(180deg, #fff 0%, #fafafa 100%);
  border-bottom: 1px solid var(--border);
}

.imprint__hero-inner {
  padding-block: clamp(28px, 5vw, 48px);
}

.imprint__title {
  margin: 0 0 6px 0;
  font-weight: 800;
  letter-spacing: .2px;
  font-size: clamp(24px, 3vw, 34px);
}

.imprint__meta {
  margin: 0;
  color: var(--muted);
  font-size: clamp(13px, 1.2vw, 15px);
}

/* Cards */
.imprint__content {
  padding-block: clamp(18px, 3vw, 28px);
}

.imprint__card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.imprint__card + .imprint__card {
  margin-top: 12px;
}

.imprint__card-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  background: #fcfcfc;
}

.imprint__card-title {
  margin: 0;
  font-weight: 750;
  font-size: clamp(18px, 1.8vw, 22px);
  letter-spacing: .2px;
}

.imprint__card-body {
  padding: 14px 16px 16px;
}

.imprint__paragraph {
  margin: 0 0 10px 0;
  max-width: 72ch;
}

.imprint__list {
  margin: 8px 0 10px 18px;
  padding: 0;
  max-width: 70ch;

  li { margin: 4px 0; }
}

.imprint__address {
  margin-top: 6px;
  font-style: normal;

  a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px dashed var(--accent-underline);

    &:hover,
    &:focus-visible {
      border-bottom-style: solid;
      outline: none;
    }
  }
}

.imprint__sub {
  margin-top: 12px;
}

.imprint__sub-title {
  margin: 0 0 4px 0;
  font-weight: 700;
  font-size: clamp(15px, 1.4vw, 18px);
}

/* Back to top */
.imprint__backtop {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.imprint__backtop-btn {
  display: inline-block;
  padding: 10px 14px;
  border-radius: 12px;
  background: #f5f7ff;
  color: var(--accent);
  text-decoration: none;
  border: 1px solid color-mix(in srgb, var(--accent) 20%, #fff);
  font-weight: 650;

  &:hover,
  &:focus-visible {
    outline: none;
    background: #eef3ff;
  }

  &:active { transform: translateY(1px); }
}

/* Anker-Offset (falls fester Header) */
.imprint__section { scroll-margin-top: 96px; }

/* Footer-Demo */
.imprint__footer-example {
  margin-block: 18px 36px;
  padding-top: 8px;
  border-top: 1px dashed var(--border);
}

/* Fokus-Styles */
a:focus-visible,
button:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--accent) 60%, #000);
  outline-offset: 2px;
  border-radius: 8px;
}

/* Print */
@media print {
  .imprint__hero { background: none; border: 0; }
  .imprint__backtop, .imprint__footer-example { display: none !important; }
  .imprint__card { box-shadow: none; border-color: #bbb; }
  .imprint__container { max-width: 100%; padding-inline: 0; }
}
</style>
