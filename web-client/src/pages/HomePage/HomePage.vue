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

    <!-- PATHS / GETTING STARTED -->
    <section class="paths">
      <div class="container">
        <h2 class="section-title">{{ t('home.gettingStarted.title') }}</h2>

        <div class="grid grid--2">
          <article class="card">
            <h3 class="card__title">{{ t('home.gettingStarted.students.title') }}</h3>
            <ol class="list list--ol">
              <li v-for="(s, i) in studentSteps" :key="i">{{ s }}</li>
            </ol>
          </article>

          <article class="card">
            <h3 class="card__title">{{ t('home.gettingStarted.teachers.title') }}</h3>
            <ol class="list list--ol">
              <li v-for="(s, i) in teacherSteps" :key="i">{{ s }}</li>
            </ol>
          </article>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how">
      <div class="container">
        <h2 class="section-title">{{ t('home.howItWorks.title') }}</h2>
        <div class="grid grid--3">
          <article class="card" v-for="c in howItems" :key="c.key">
            <h3 class="card__title">{{ c.title }}</h3>
            <p class="card__text">{{ c.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- SECURITY & REQUIREMENTS -->
    <section class="duo">
      <div class="container grid grid--2">
        <article class="card">
          <h3 class="card__title">{{ t('home.security.title') }}</h3>
          <ul class="list">
            <li v-for="(p, i) in securityPoints" :key="i">{{ p }}</li>
          </ul>
        </article>

        <article class="card">
          <h3 class="card__title">{{ t('home.requirements.title') }}</h3>
          <ul class="list">
            <li v-for="(b, i) in requirements" :key="i">{{ b }}</li>
          </ul>
        </article>
      </div>
    </section>

    <!-- TARGET GROUPS -->
    <section class="targets">
      <div class="container">
        <h2 class="section-title">{{ t('home.target.title') }}</h2>
        <div class="grid grid--2">
          <article class="card">
            <h3 class="card__title">{{ t('home.target.student.title') }}</h3>
            <ul class="list">
              <li v-for="(p, i) in studentPoints" :key="i">{{ p }}</li>
            </ul>
          </article>

          <article class="card">
            <h3 class="card__title">{{ t('home.target.admin.title') }}</h3>
            <ul class="list">
              <li v-for="(p, i) in adminPoints" :key="i">{{ p }}</li>
            </ul>
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

/** Hero badges */
const heroBadges = computed(() => (tm('home.hero.badges') as string[]) ?? [])

/** 3 Kacheln "Wie es funktioniert" */
const howItems = computed(() => [
  { key: 'participate', title: t('home.howItWorks.items.participate.title'), text: t('home.howItWorks.items.participate.text') },
  { key: 'prove',       title: t('home.howItWorks.items.prove.title'),       text: t('home.howItWorks.items.prove.text') },
  { key: 'secure',      title: t('home.howItWorks.items.secure.title'),      text: t('home.howItWorks.items.secure.text') }
])

/** Getting started */
const studentSteps = computed(() => (tm('home.gettingStarted.students.steps') as string[]) ?? [])
const teacherSteps = computed(() => (tm('home.gettingStarted.teachers.steps') as string[]) ?? [])

/** Security & Requirements */
const securityPoints = computed(() => (tm('home.security.points') as string[]) ?? [])
const requirements   = computed(() => (tm('home.requirements.bullets') as string[]) ?? [])

/** Zielgruppen */
const studentPoints = computed(() => (tm('home.target.student.bullets') as string[]) ?? [])
const adminPoints   = computed(() => (tm('home.target.admin.bullets') as string[]) ?? [])

/** FAQ (ausführlich) */
const faqPlusItems = computed(() => {
  const items = (tm('home.faqPlus.items') ?? []) as Array<{ q: string; a: string }>
  return items.map(({ q, a }) => ({ title: q, content: a }))
})
</script>

<style lang="scss" scoped>
:root { /* nur lokale Hinweise, durch scoped nicht global */
}

/* ====== Layout Utilities ====== */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
}
.section-title {
  font-size: 1.75rem;
  text-align: center;
  margin: 0 0 1.25rem 0;
}
.grid {
  display: grid;
  gap: 16px;
}
.grid--2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
@media (max-width: 980px) {
  .grid--2, .grid--3 { grid-template-columns: 1fr; }
}

/* ====== Hero ====== */
.hero {
  background: linear-gradient(180deg, #eef3ff 0%, #ffffff 55%);
  padding: 3.25rem 0 2.25rem;
  text-align: center;
}
.hero__title {
  font-size: 2rem;
  margin: 0.25rem 0 0 0;
}
.hero__subtitle {
  max-width: 900px;
  margin: 0.75rem auto 0;
  font-size: 1.125rem;
  line-height: 1.6;
  color: #2c2c2c;
}
.hero__cta {
  display: inline-flex;
  gap: 10px;
  margin-top: 1.2rem;
  flex-wrap: wrap;
  justify-content: center;
}
.hero__badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0.9rem 0 0.2rem;
  padding: 0;
  list-style: none;
}
.hero__hint {
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: #666;
}

/* Buttons / Chips */
.btn {
  --radius: 12px;
  display: inline-block;
  border-radius: var(--radius);
  padding: .75rem 1.25rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
  will-change: transform;
  border: 2px solid transparent;
}
.btn--primary {
  background: #117FFF;
  color: white;
  box-shadow: 0 10px 20px rgba(17,127,255,.15);
}
.btn--primary:hover { transform: translateY(-1px); }
.btn--outline {
  background: white;
  color: #117FFF;
  border-color: #117FFF;
}
.btn--outline:hover { transform: translateY(-1px); opacity: .95; }

.chip {
  background: #f1f5ff;
  color: #123;
  border: 1px solid #e1e8ff;
  border-radius: 999px;
  padding: .4rem .75rem;
  font-size: .85rem;
}

/* ====== Sections ====== */
.paths, .how, .duo, .targets, .faq {
  padding: 2.25rem 0;
}

/* Cards & Lists */
.card {
  background: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 14px;
  padding: 1.1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,.04);
}
.card__title {
  font-weight: 800;
  margin: 0 0 .5rem 0;
}
.card__text {
  color: #444;
  line-height: 1.55;
  margin: 0;
}
.list {
  margin: 0;
  padding-left: 1.1rem;
}
.list--ol {
  margin: 0;
  padding-left: 1.2rem;
}
.list li { margin: .28rem 0; }

/* FAQ */
.faq__group {
  max-width: 1000px;
  margin: 0 auto;
}

/* Mobile tweaks */
@media (max-width: 600px) {
  .hero { padding: 2.5rem 0 1.5rem; }
  .hero__title { font-size: 1.65rem; }
  .hero__subtitle { font-size: 1rem; }
}
</style>
