<!-- /pages/AccessibilityPage/AccessibilityPage.vue -->
<template>
  <div id="top" />

  <main class="a11y" role="main" aria-labelledby="a11y-title">
    <!-- Hero -->
    <section class="a11y__hero">
      <div class="a11y__container a11y__hero-inner">
        <h1 id="a11y-title" class="a11y__title">
          {{ t('accessibility.title') }}
        </h1>
        <p class="a11y__meta">
          {{ t('accessibility.lastUpdatedPrefix') }}
          <span>{{ t('accessibility.lastUpdated') }}</span>
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="a11y__container a11y__content">
      <article
        v-for="section in sections"
        :key="`${locale}-${section.id}`"
        :id="section.id"
        class="a11y__card a11y__section"
      >
        <header class="a11y__card-header">
          <h2 class="a11y__card-title">{{ section.title }}</h2>
        </header>

        <div class="a11y__card-body">
          <p v-for="(p, i) in section.paras || []" :key="`p-${i}`" class="a11y__paragraph">
            {{ p }}
          </p>

          <ul v-if="section.list && section.list.length" class="a11y__list">
            <li v-for="(item, i) in section.list" :key="`li-${i}`">
              {{ item }}
            </li>
          </ul>

          <address v-if="section.contact" class="a11y__address">
            <p v-for="(c, i) in section.contact" :key="`c-${i}`">
              <strong>{{ c.label }}:</strong>
              <a v-if="c.href" :href="c.href" class="a11y__link">{{ c.value }}</a>
              <span v-else>{{ c.value }}</span>
            </p>
          </address>
        </div>
      </article>

      <div class="a11y__backtop">
        <a href="#top" class="a11y__backtop-btn">{{ t('accessibility.backToTop') }}</a>
      </div>
    </section>

    <AppFooter />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppFooter from "@/common/AppFooter.vue";
const { t, tm, locale } = useI18n({ useScope: 'global' })

type Section = {
  id: string
  title: string
  paras?: string[]
  list?: string[]
  contact?: Array<{ label: string; value: string; href?: string }>
}

const sections = computed<Section[]>(() => tm('accessibility.sections') as any[])
</script>

<style>
html { scroll-behavior: smooth; }
</style>

<style scoped lang="scss">
.a11y {
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

.a11y__container {
  max-width: 1080px;
  margin-inline: auto;
  padding-inline: clamp(14px, 3vw, 24px);
}

/* Hero */
.a11y__hero {
  background: linear-gradient(180deg, #fff 0%, #fafafa 100%);
  border-bottom: 1px solid var(--border);
}
.a11y__hero-inner { padding-block: clamp(28px, 5vw, 48px); }
.a11y__title {
  margin: 0 0 6px 0;
  font-weight: 800;
  letter-spacing: .2px;
  font-size: clamp(24px, 3vw, 34px);
}
.a11y__meta {
  margin: 0;
  color: var(--muted);
  font-size: clamp(13px, 1.2vw, 15px);
}

/* Cards */
.a11y__content { padding-block: clamp(18px, 3vw, 28px); }
.a11y__card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow);
  overflow: hidden;
}
.a11y__card + .a11y__card { margin-top: 12px; }
.a11y__card-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  background: #fcfcfc;
}
.a11y__card-title {
  margin: 0;
  font-weight: 750;
  font-size: clamp(18px, 1.8vw, 22px);
  letter-spacing: .2px;
}
.a11y__card-body { padding: 14px 16px 16px; }
.a11y__paragraph { margin: 0 0 10px 0; max-width: 72ch; }
.a11y__list { margin: 8px 0 10px 18px; padding: 0; max-width: 70ch; }
.a11y__list li { margin: 4px 0; }
.a11y__address { margin-top: 6px; font-style: normal; }
.a11y__link {
  color: var(--accent); text-decoration: none; border-bottom: 1px dashed var(--accent-underline);
}
.a11y__link:hover, .a11y__link:focus-visible { border-bottom-style: solid; outline: none; }

/* Back to top */
.a11y__backtop { display: flex; justify-content: center; margin-top: 16px; }
.a11y__backtop-btn {
  display: inline-block; padding: 10px 14px; border-radius: 12px;
  background: #f5f7ff; color: var(--accent); text-decoration: none;
  border: 1px solid color-mix(in srgb, var(--accent) 20%, #fff); font-weight: 650;
}
.a11y__backtop-btn:hover, .a11y__backtop-btn:focus-visible { background: #eef3ff; }

/* Anker-Offset (falls fester Header) */
.a11y__section { scroll-margin-top: 96px; }

/* Fokus-Styles */
a:focus-visible, button:focus-visible { outline: 2px solid color-mix(in srgb, var(--accent) 60%, #000); outline-offset: 2px; border-radius: 8px; }

/* Print */
@media print {
  .a11y__hero { background: none; border: 0; }
  .a11y__backtop { display: none !important; }
  .a11y__card { box-shadow: none; border-color: #bbb; }
  .a11y__container { max-width: 100%; padding-inline: 0; }
}
</style>
