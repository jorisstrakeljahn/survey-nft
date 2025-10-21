<template>
  <div class="vpp-home">
    <!-- HERO -->
    <section class="hero">
      <div class="container">
        <h1 class="hero__title">{{ t('home.hero.title') }}</h1>
        <p class="hero__subtitle">{{ t('home.hero.subtitle') }}</p>

        <div class="hero__cta">
          <router-link to="/nfts" class="btn btn--primary">
            {{ t('home.cta.student') }}
          </router-link>
          <router-link to="/admin" class="btn btn--outline">
            {{ t('home.cta.admin') }}
          </router-link>
        </div>

        <ul class="hero__badges" aria-label="Vorteile">
          <li v-for="(b, i) in heroBadges" :key="i" class="chip">{{ b }}</li>
        </ul>
      </div>
    </section>

    <!-- INTRO (kurzer Klartext) -->
    <section class="intro">
      <div class="container">
        <h2 class="section-title">{{ t('home.intro.title') }}</h2>
        <p class="intro__lead">{{ t('home.intro.lead') }}</p>
      </div>
    </section>

    <!-- HIGHLIGHTS (2 kompakte Karten) -->
    <section class="highlights">
      <div class="container">
        <h2 class="section-title">{{ t('home.highlights.title') }}</h2>
        <div class="grid grid--2">
          <article class="card" v-for="(h, i) in highlights" :key="i">
            <h3 class="card__title">{{ h.title }}</h3>
            <p class="card__text">{{ h.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq">
      <div class="container">
        <h2 class="section-title">{{ t('home.faqPlus.title') }}</h2>
        <div class="faq__group">
          <accordion-item
            v-for="(item, index) in faqPlusItems"
            :key="index"
            :title="item.title"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="item.content"></div>
          </accordion-item>
        </div>
      </div>
    </section>

    <app-footer />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppFooter from '@/common/AppFooter.vue'
import AccordionItem from '@/common/AccordionItem.vue'

const { t, tm } = useI18n()

/** Hero */
const heroBadges = computed(() => (tm('home.hero.badges') as string[]) ?? [])

/** Paths */
const studentSteps = computed(() => (tm('home.gettingStarted.students.steps') as string[]) ?? [])
const teacherSteps = computed(() => (tm('home.gettingStarted.teachers.steps') as string[]) ?? [])

/** Intro */
const introBullets = computed(() => (tm('home.intro.bullets') as string[]) ?? [])

/** Highlights */
type Highlight = { title: string; text: string }
const highlights = computed(() => (tm('home.highlights.items') as Highlight[]) ?? [])

/** FAQ ausführlich */
const faqPlusItems = computed(() => {
  const items = (tm('home.faqPlus.items') ?? []) as Array<{ q: string; a: string }>
  return items.map(({ q, a }) => ({ title: q, content: a }))
})
</script>

<style lang="scss" scoped>
/* ===== Layout Utilities ===== */
.container { max-width: 1100px; margin: 0 auto; padding: 0 1rem; }
.section-title { font-size: 1.75rem; text-align: center; margin: 0 0 1.25rem; }
.grid { display: grid; gap: 16px; }
.grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
@media (max-width: 980px) { .grid--2 { grid-template-columns: 1fr; } }

/* ===== Hero ===== */
.hero {
  padding: 3.25rem 0 2.25rem;
  text-align: center;
}
.hero__title { font-size: 2rem; margin: 0.25rem 0 0; }
.hero__subtitle { max-width: 900px; margin: 0.75rem auto 0; font-size: 1.125rem; line-height: 1.6; color: #2c2c2c; }
.hero__cta { display: inline-flex; gap: 10px; margin-top: 1.2rem; flex-wrap: wrap; justify-content: center; }
.hero__badges { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin: .9rem 0 .2rem; padding: 0; list-style: none; }
.hero__hint { margin-top: .25rem; font-size: .9rem; color: #666; }

/* Buttons / Chips */
.btn {
  --radius: 12px;
  display: inline-block;
  border-radius: var(--radius);
  padding: .75rem 1.25rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
  border: 2px solid transparent;
}
.btn--primary { background: #117FFF; color: #fff; box-shadow: 0 10px 20px rgba(0,0,0,.2); }
.btn--primary:hover { transform: translateY(-1px); }
.btn--outline { background: #fff; color: #117FFF; border-color: #117FFF; }
.btn--outline:hover { transform: translateY(-1px); opacity: .95; }

.chip { background: #f1f5ff; color: #123; border: 1px solid #e1e8ff; border-radius: 999px; padding: .4rem .75rem; font-size: .85rem; }

/* ===== Sections ===== */
.paths, .intro, .highlights, .faq { padding: 2.25rem 0; }
.card {
  background: #fff; border: 1px solid #e9e9e9; border-radius: 14px; padding: 1.1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,.1);
}
.card__title { font-weight: 800; margin: 0 0 .5rem; }
.card__text { color: #444; line-height: 1.55; margin: 0; }

.list { margin: 0; padding-left: 1.2rem; }
.list--ol { margin: 0; padding-left: 1.25rem; }
.list li { margin: .28rem 0; }

/* Intro lead */
.intro__lead { max-width: 860px; margin: 0 auto .75rem; text-align: center; color: #2c2c2c; }
.intro__bullets { max-width: 860px; margin: 0.25rem auto 0; }

/* FAQ */
.faq__group { max-width: 1000px; margin: 0 auto; }

/* Mobile tweaks */
@media (max-width: 600px) {
  .hero { padding: 2.5rem 0 1.5rem; }
  .hero__title { font-size: 1.65rem; }
  .hero__subtitle { font-size: 1rem; }
}
</style>
