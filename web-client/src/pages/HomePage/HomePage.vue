<template>
  <div class="vpp-page">
    <!-- HERO -->
    <section class="header-section">

      <h1 class="header-section__title">
        {{ t('home.hero.title') }}
      </h1>

      <p class="header-section__subtitle">
        {{ t('home.hero.subtitle') }}
      </p>

      <div class="header-section__buttons">
        <router-link to="/nfts" class="header-section__button">
          {{ t('home.cta.student') }}
        </router-link>

        <router-link
          to="/admin"
          class="header-section__button header-section__button--blue"
        >
          {{ t('home.cta.admin') }}
        </router-link>
      </div>

      <p class="header-section__hint">
        {{ t('home.hero.gsnHint') }}
      </p>
    </section>

    <!-- HOW IT WORKS -->
    <section class="documentation-section">
      <h2 class="documentation-section__title">
        {{ t('home.howItWorks.title') }}
      </h2>

      <div class="how-cards">
        <div class="how-card" v-for="c in howItems" :key="c.key">
          <h3 class="how-card__title">
            {{ c.title }}
          </h3>
          <p class="how-card__text">
            {{ c.text }}
          </p>
        </div>
      </div>
    </section>

    <!-- TARGET GROUPS -->
    <section class="info-section">
      <h2 class="info-section__title">
        {{ t('home.target.title') }}
      </h2>

      <div class="target-grid">
        <div class="target-col">
          <h3 class="target-col__title">
            {{ t('home.target.student.title') }}
          </h3>
          <ul class="target-col__list">
            <li v-for="(p, i) in studentPoints" :key="i">
              {{ p }}
            </li>
          </ul>
        </div>

        <div class="target-col">
          <h3 class="target-col__title">
            {{ t('home.target.admin.title') }}
          </h3>
          <ul class="target-col__list">
            <li v-for="(p, i) in adminPoints" :key="i">
              {{ p }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="documentation-section">
      <h2 class="documentation-section__title">
        {{ t('home.faq.title') }}
      </h2>

      <div class="documentation-section__group">
        <accordion-item
          v-for="(item, index) in faqItems"
          :key="index"
          :title="item.title"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
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

const { t } = useI18n()

/** 3 Kacheln "Wie es funktioniert" */
const howItems = computed(() => [
  {
    key: 'participate',
    title: t('home.howItWorks.items.participate.title'),
    text: t('home.howItWorks.items.participate.text'),
  },
  {
    key: 'prove',
    title: t('home.howItWorks.items.prove.title'),
    text: t('home.howItWorks.items.prove.text'),
  },
  {
    key: 'secure',
    title: t('home.howItWorks.items.secure.title'),
    text: t('home.howItWorks.items.secure.text'),
  },
])

/** Zielgruppen-Stichpunkte */
const studentPoints = computed(() => [
  t('home.target.student.bullets.0'),
  t('home.target.student.bullets.1'),
  t('home.target.student.bullets.2'),
])

const adminPoints = computed(() => [
  t('home.target.admin.bullets.0'),
  t('home.target.admin.bullets.1'),
  t('home.target.admin.bullets.2'),
])

/** FAQ */
const faqItems = computed(() => [
  {
    title: t('home.faq.items.gas.title'),
    content: t('home.faq.items.gas.content'),
  },
  {
    title: t('home.faq.items.duplicate.title'),
    content: t('home.faq.items.duplicate.content'),
  },
  {
    title: t('home.faq.items.network.title'),
    content: t('home.faq.items.network.content'),
  },
  {
    title: t('home.faq.items.privacy.title'),
    content: t('home.faq.items.privacy.content'),
  },
])
</script>

<style lang="scss" scoped>
.header-section {
  text-align: center;
  padding: 2rem 1rem;

  &__title {
    font-size: 2rem;
    margin-top: 1.25rem;
  }

  &__subtitle {
    max-width: 980px;
    font-size: 1.125rem;
    line-height: 1.6;
    text-align: center;
    margin: 1rem auto 0;
    color: #2c2c2c;
  }

  &__buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 1.25rem;
    flex-wrap: wrap;
  }

  &__button {
    display: inline-block;
    padding: 0.75rem 2rem;
    background-color: #111;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    border-radius: 12px;
    transition: transform 0.2s ease, opacity 0.2s ease;
    opacity: 0.92;

    &:hover {
      transform: translateY(-1px);
      opacity: 1;
    }

    &--blue {
      background-color: #2563eb;
    }
  }

  &__hint {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }
}

/* HOW IT WORKS */
.documentation-section {
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    font-size: 1.75rem;
    margin-bottom: 1.125rem;
    text-align: center;
  }

  &__group {
    max-width: 1000px;
    width: 100%;
    margin-bottom: 2rem;
  }
}

.how-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 320px));
  gap: 16px;
  width: 100%;
  max-width: 1000px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
}

.how-card {
  border: 1px solid #e9e9e9;
  border-radius: 12px;
  padding: 1rem;
  background: #fff;

  &__title {
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  &__text {
    color: #444;
    line-height: 1.5;
  }
}

/* TARGET GROUPS */
.info-section {
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
  }
}

.target-grid {
  max-width: 1000px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
}

.target-col {
  border: 1px solid #e9e9e9;
  border-radius: 12px;
  padding: 1rem;
  background: #fff;

  &__title {
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  &__list {
    margin: 0;
    padding-left: 1.2rem;
    li {
      margin: 0.25rem 0;
    }
  }
}
</style>
