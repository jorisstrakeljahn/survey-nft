<template>
  <div class="vpp-page">
    <!-- HERO -->
    <section class="header-section">
      <h1 class="header-section__title">{{ t('home.hero.title') }}</h1>
      <p class="header-section__subtitle">{{ t('home.hero.subtitle') }}</p>

      <div class="header-section__buttons">
        <router-link to="/nfts" class="header-section__button">
          {{ t('home.cta.student') }}
        </router-link>
        <router-link to="/admin" class="header-section__button header-section__button--blue">
          {{ t('home.cta.admin') }}
        </router-link>
      </div>

      <p class="header-section__hint">{{ t('home.hero.gsnHint') }}</p>
    </section>

    <!-- GETTING STARTED -->
    <section class="steps-section">
      <h2 class="section__title">{{ t('home.gettingStarted.title') }}</h2>
      <div class="steps-grid">
        <div class="steps-card">
          <h3 class="steps-card__title">{{ t('home.gettingStarted.students.title') }}</h3>
          <ol class="steps-list">
            <li v-for="(s, i) in studentSteps" :key="i">{{ s }}</li>
          </ol>
        </div>
        <div class="steps-card">
          <h3 class="steps-card__title">{{ t('home.gettingStarted.teachers.title') }}</h3>
          <ol class="steps-list">
            <li v-for="(s, i) in teacherSteps" :key="i">{{ s }}</li>
          </ol>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="documentation-section">
      <h2 class="documentation-section__title">{{ t('home.howItWorks.title') }}</h2>
      <div class="how-cards">
        <div class="how-card" v-for="c in howItems" :key="c.key">
          <h3 class="how-card__title">{{ c.title }}</h3>
          <p class="how-card__text">{{ c.text }}</p>
        </div>
      </div>
    </section>

    <!-- REQUIREMENTS -->
    <section class="requirements-section">
      <h2 class="section__title">{{ t('home.requirements.title') }}</h2>
      <ul class="requirements-list">
        <li v-for="(b, i) in requirements" :key="i">{{ b }}</li>
      </ul>
    </section>

    <!-- TARGET GROUPS -->
    <section class="info-section">
      <h2 class="info-section__title">{{ t('home.target.title') }}</h2>
      <div class="target-grid">
        <div class="target-col">
          <h3 class="target-col__title">{{ t('home.target.student.title') }}</h3>
          <ul class="target-col__list">
            <li v-for="(p, i) in studentPoints" :key="i">{{ p }}</li>
          </ul>
        </div>
        <div class="target-col">
          <h3 class="target-col__title">{{ t('home.target.admin.title') }}</h3>
          <ul class="target-col__list">
            <li v-for="(p, i) in adminPoints" :key="i">{{ p }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- SECURITY -->
    <section class="security-section">
      <h2 class="section__title">{{ t('home.security.title') }}</h2>
      <ul class="security-list">
        <li v-for="(p, i) in securityPoints" :key="i">{{ p }}</li>
      </ul>
    </section>

    <!-- FAQ -->
    <section class="documentation-section">
      <h2 class="documentation-section__title">{{ t('home.faqPlus.title') }}</h2>
      <div class="documentation-section__group">
        <accordion-item
          v-for="(item, index) in faqPlusItems"
          :key="index"
          :title="item.title"
        >
          <div v-html="item.content"></div>
        </accordion-item>
      </div>
    </section>
  </div>

  <app-footer />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppFooter from '@/common/AppFooter.vue'
import AccordionItem from '@/common/AccordionItem.vue'
const { t, tm } = useI18n()

const howItems = computed(() => [
  { key: 'participate', title: t('home.howItWorks.items.participate.title'), text: t('home.howItWorks.items.participate.text') },
  { key: 'prove',       title: t('home.howItWorks.items.prove.title'),       text: t('home.howItWorks.items.prove.text') },
  { key: 'secure',      title: t('home.howItWorks.items.secure.title'),      text: t('home.howItWorks.items.secure.text') },
])

const studentSteps = computed(() => (tm('home.gettingStarted.students.steps') as string[]) ?? [])
const teacherSteps = computed(() => (tm('home.gettingStarted.teachers.steps') as string[]) ?? [])

const requirements = computed(() => (tm('home.requirements.bullets') as string[]) ?? [])

const studentPoints = computed(() => (tm('home.target.student.bullets') as string[]) ?? [])
const adminPoints   = computed(() => (tm('home.target.admin.bullets') as string[]) ?? [])

const securityPoints = computed(() => (tm('home.security.points') as string[]) ?? [])

const faqItems = computed(() => [
  { title: t('home.faq.items.gas.title'),       content: t('home.faq.items.gas.content') },
  { title: t('home.faq.items.duplicate.title'), content: t('home.faq.items.duplicate.content') },
  { title: t('home.faq.items.network.title'),   content: t('home.faq.items.network.content') },
  { title: t('home.faq.items.privacy.title'),   content: t('home.faq.items.privacy.content') },
])

const faqPlusItems = computed(() => {
  const items = (tm('home.faqPlus.items') ?? []) as Array<{ q: string; a: string }>
  return items.map(({ q, a }) => ({ title: q, content: a }))
})
</script>

<style lang="scss" scoped>
.header-section {
  text-align: center;
  padding: 2rem 1rem;

  &__title { font-size: 2rem; margin-top: 1.25rem; }
  &__subtitle {
    max-width: 980px; font-size: 1.125rem; line-height: 1.6;
    text-align: center; margin: 1rem auto 0; color: #2c2c2c;
  }
  &__buttons {
    display: flex; gap: 12px; justify-content: center; margin-top: 1.25rem; flex-wrap: wrap;
  }
  &__button {
    display: inline-block; padding: .75rem 2rem; background: #111; color: #fff;
    font-size: 1rem; font-weight: 600; text-decoration: none; border-radius: 12px;
    transition: transform .2s ease, opacity .2s ease; opacity: .92;
    &:hover { transform: translateY(-1px); opacity: 1; }
    &--blue { background-color: #2563eb; }
  }
  &__hint { margin-top: .5rem; font-size: .9rem; color: #666; }
}

.section__title { font-size: 1.75rem; margin: 1.75rem 0 1rem; text-align: center; }

.steps-section { padding: 2rem 1rem; display: grid; place-items: center; }
.steps-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 340px));
  gap: 16px; width: 100%; max-width: 1000px;
  @media (max-width: 980px) { grid-template-columns: 1fr; }
}
.steps-card {
  border: 1px solid #e9e9e9; border-radius: 12px; padding: 1rem; background: #fff;
  &__title { font-weight: 700; margin-bottom: .5rem; }
}
.steps-list { margin: 0; padding-left: 1.2rem; li { margin: .25rem 0; } }

/* HOW IT WORKS */
.documentation-section {
  padding: 2rem 1rem; display: flex; flex-direction: column; align-items: center;
  &__title { font-size: 1.75rem; margin-bottom: 1.125rem; text-align: center; }
  &__group { max-width: 1000px; width: 100%; margin-bottom: 2rem; }
}
.how-cards {
  display: grid; grid-template-columns: repeat(3, minmax(0, 320px));
  gap: 16px; width: 100%; max-width: 1000px;
  @media (max-width: 980px) { grid-template-columns: 1fr; }
}
.how-card {
  border: 1px solid #e9e9e9; border-radius: 12px; padding: 1rem; background: #fff;
  &__title { font-weight: 700; margin-bottom: .5rem; }
  &__text  { color: #444; line-height: 1.5; }
}

/* REQUIREMENTS */
.requirements-section { padding: 2rem 1rem; display: grid; place-items: center; }
.requirements-list { max-width: 800px; margin: 0; padding-left: 1.2rem; li { margin: .25rem 0; } }

/* TARGET GROUPS */
.info-section { padding: 2rem 1rem; display: flex; flex-direction: column; align-items: center; }
.info-section__title { font-size: 1.5rem; margin-bottom: 1rem; text-align: center; }
.target-grid {
  max-width: 1000px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  @media (max-width: 980px) { grid-template-columns: 1fr; }
}
.target-col {
  border: 1px solid #e9e9e9; border-radius: 12px; padding: 1rem; background: #fff;
  &__title { font-weight: 700; margin-bottom: .5rem; }
  &__list { margin: 0; padding-left: 1.2rem; li { margin: .25rem 0; } }
}

/* SECURITY */
.security-section { padding: 2rem 1rem; display: grid; place-items: center; }
.security-list { max-width: 800px; margin: 0; padding-left: 1.2rem; li { margin: .25rem 0; } }
</style>
