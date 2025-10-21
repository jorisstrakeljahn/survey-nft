<!-- /pages/PrivacyPage/PrivacyPage.vue -->
<template>
  <!-- Anker für "Zurück nach oben" -->
  <div id="top" />

  <main class="privacy" role="main" aria-labelledby="privacy-title">
    <!-- Hero -->
    <section class="privacy__hero">
      <div class="privacy__container privacy__hero-inner">
        <h1 id="privacy-title" class="privacy__title">
          {{ t('privacy.title') }}
        </h1>
        <p class="privacy__meta">
          {{ t('privacy.lastUpdatedPrefix') }}
          <span>{{ t('privacy.lastUpdated') }}</span>
        </p>
      </div>
    </section>

    <!-- Content Grid -->
    <section class="privacy__container privacy__grid">
      <!-- TOC (Mobile: Akkordeon) -->
      <details class="privacy__toc privacy__toc--mobile">
        <summary class="privacy__toc-summary">
          {{ t('privacy.tocTitle') }}
        </summary>
        <ul class="privacy__toc-list">
          <li v-for="s in sections" :key="s.id">
            <a class="privacy__toc-link" :href="`#${s.id}`">
              {{ s.title }}
            </a>
          </li>
        </ul>
      </details>

      <!-- TOC (Desktop: sticky) -->
      <nav
        class="privacy__toc privacy__toc--desktop"
        aria-label="Inhaltsverzeichnis"
      >
        <h2 class="privacy__section-title">{{ t('privacy.tocTitle') }}</h2>
        <ul class="privacy__toc-list">
          <li v-for="s in sections" :key="s.id">
            <a class="privacy__toc-link" :href="`#${s.id}`">
              {{ s.title }}
            </a>
          </li>
        </ul>
      </nav>

      <!-- Inhalt -->
      <div class="privacy__content">
        <article
          v-for="section in sections"
          :id="section.id"
          :key="section.id"
          class="privacy__card privacy__section"
        >
          <header class="privacy__card-header">
            <h2 class="privacy__card-title">{{ section.title }}</h2>
          </header>

          <div class="privacy__card-body">
            <!-- Absätze -->
            <p
              v-for="(p, idx) in section.paras || []"
              :key="`p-${idx}`"
              class="privacy__paragraph"
            >
              {{ p }}
            </p>

            <!-- Liste -->
            <ul v-if="section.list && section.list.length" class="privacy__list">
              <li v-for="(item, i) in section.list" :key="`li-${i}`">
                {{ item }}
              </li>
            </ul>

            <!-- Adresse / Kontakt -->
            <address
              v-if="section.address || section.contact"
              class="privacy__address"
            >
              <p v-for="(line, i) in section.address || []" :key="`addr-${i}`">
                {{ line }}
              </p>
              <p v-for="(c, i) in section.contact || []" :key="`contact-${i}`">
                <strong>{{ c.label }}:</strong>
                <a v-if="c.href" :href="c.href" class="privacy__link">{{
                    c.value
                  }}</a>
                <span v-else>{{ c.value }}</span>
              </p>
            </address>

            <!-- Rechte -->
            <div
              v-for="(right, i) in section.rights || []"
              :key="`right-${i}`"
              class="privacy__sub"
            >
              <h3 class="privacy__sub-title">{{ right.name }}</h3>
              <p class="privacy__paragraph">{{ right.desc }}</p>
            </div>
          </div>
        </article>

        <!-- Zurück nach oben -->
        <div class="privacy__backtop">
          <a href="#top" class="privacy__backtop-btn">
            {{ t('privacy.backToTop') }}
          </a>
        </div>
      </div>
    </section>

    <app-footer />
  </main>
</template>

<script setup lang="ts">
import AppFooter from '@/common/AppFooter.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n({ useScope: 'global' })

type Section = {
  id: string
  title: string
  paras?: string[]
  paras2?: string[]
  list?: string[]
  address?: string[]
  contact?: Array<{ label: string; value: string; href?: string }>
  rights?: Array<{ name: string; desc: string }>
}

const sections = computed<Section[]>(() => tm('privacy.sections') as any[])
</script>

<!-- globale Kleinigkeiten wie smooth scrolling -->
<style>
html {
  scroll-behavior: smooth;
}
</style>

<style scoped lang="scss">
/* White Mode – helle, gut lesbare Defaults */
.privacy {
  /* Farb- und Layout-Variablen */
  --bg: #ffffff;
  --surface: #ffffff;
  --text: #1b1b1b;
  --muted: #5f6368;        /* neutral grau für Meta */
  --border: #e7e7e7;       /* zarte Trennlinien */
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 6px 16px rgba(0, 0, 0, 0.06);
  --accent: #0b57d0;       /* gut lesbares Blau */
  --accent-underline: rgba(11, 87, 208, 0.25);

  color: var(--text);
  background: var(--bg);
  line-height: 1.65;
  font-size: clamp(15px, 1.05vw, 17px);
}

.privacy__container {
  max-width: 1080px;
  margin-inline: auto;
  padding-inline: clamp(14px, 3vw, 24px);
}

/* Hero */
.privacy__hero {
  background: linear-gradient(180deg, #fff 0%, #fafafa 100%);
  border-bottom: 1px solid var(--border);
}

.privacy__hero-inner {
  padding-block: clamp(28px, 5vw, 48px);
}

.privacy__title {
  margin: 0 0 6px 0;
  font-weight: 800;
  letter-spacing: .2px;
  font-size: clamp(24px, 3vw, 34px);
}

.privacy__meta {
  margin: 0;
  color: var(--muted);
  font-size: clamp(13px, 1.2vw, 15px);
}

/* Grid: TOC + Content */
.privacy__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(14px, 2vw, 24px);
  padding-block: clamp(18px, 3vw, 28px);

  @media (min-width: 1024px) {
    grid-template-columns: 280px 1fr;
    align-items: start;
  }
}

/* TOC (beide Varianten teilen Stil) */
.privacy__toc {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow);
  padding: 14px;
}

.privacy__section-title,
.privacy__toc-summary {
  margin: 0 0 8px 0;
  font-weight: 700;
  font-size: clamp(15px, 1.4vw, 18px);
}

.privacy__toc-summary {
  list-style: none;
  cursor: pointer;
  user-select: none;
  outline: none;
}

.privacy__toc-summary::-webkit-details-marker {
  display: none;
}

.privacy__toc--mobile {
  @media (min-width: 1024px) {
    display: none;
  }
}

.privacy__toc--desktop {
  display: none;

  @media (min-width: 1024px) {
    display: block;
    position: sticky;
    top: 88px; /* falls du Header hast, hier anpassen */
  }
}

.privacy__toc-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}

.privacy__toc-link {
  text-decoration: none;
  color: var(--accent);
  border-bottom: 1px dashed var(--accent-underline);
  padding-block: 4px;
  display: inline-block;

  &:hover,
  &:focus-visible {
    outline: none;
    border-bottom-style: solid;
  }
}

/* Content Karten */
.privacy__card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.privacy__card + .privacy__card {
  margin-top: 12px;
}

.privacy__card-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  background: #fcfcfc;
}

.privacy__card-title {
  margin: 0;
  font-weight: 750;
  font-size: clamp(18px, 1.8vw, 22px);
  letter-spacing: .2px;
}

.privacy__card-body {
  padding: 14px 16px 16px;
}

.privacy__paragraph {
  margin: 0 0 10px 0;
  max-width: 72ch; /* bessere Leselänge */
}

.privacy__list {
  margin: 8px 0 10px 18px;
  padding: 0;
  max-width: 70ch;

  li {
    margin: 4px 0;
  }
}

.privacy__address {
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

.privacy__sub {
  margin-top: 12px;
}

.privacy__sub-title {
  margin: 0 0 4px 0;
  font-weight: 700;
  font-size: clamp(15px, 1.4vw, 18px);
}

/* Zurück nach oben */
.privacy__backtop {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.privacy__backtop-btn {
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

  &:active {
    transform: translateY(1px);
  }
}

/* Anker-Offset: falls ein fixer Header existiert */
.privacy__section {
  scroll-margin-top: 96px;
}

/* Footer-Beispiel innerhalb der Seite (nur Demo) */
.privacy__footer-example {
  margin-block: 18px 36px;
  padding-top: 8px;
  border-top: 1px dashed var(--border);
}

/* Fokus-Styles für Tastatur-Nutzer */
a:focus-visible,
button:focus-visible,
summary:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--accent) 60%, #000);
  outline-offset: 2px;
  border-radius: 8px;
}

/* Print: kompaktes Layout, ohne Schatten/TOC */
@media print {
  .privacy__hero {
    background: none;
    border: 0;
  }
  .privacy__toc--desktop,
  .privacy__toc--mobile,
  .privacy__backtop,
  .privacy__footer-example {
    display: none !important;
  }
  .privacy__card {
    box-shadow: none;
    border-color: #bbb;
  }
  .privacy__container {
    max-width: 100%;
    padding-inline: 0;
  }
}
</style>
