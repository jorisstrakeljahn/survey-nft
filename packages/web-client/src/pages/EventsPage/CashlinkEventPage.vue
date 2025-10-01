<template>
  <div class="event-page" lang="de">
    <!-- Header Section -->
    <section class="header-section">
      <h1 class="header-section__title">
        {{ t('event-cashlink-page.title') }}
      </h1>
      <p class="header-section__subtitle">
        {{ t('event-cashlink-page.description') }}
      </p>
      <img :src="CashlinkImage" alt="Bild 1" class="header-section__image" />
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <h2 class="content-section__subtitle">
        {{ t('event-cashlink-page.titel-2') }}
      </h2>
      <p class="content-section__text">
        {{ t('event-cashlink-page.text-2') }}
      </p>

      <!-- Titel 3 -->
      <h2 class="content-section__subtitle">
        {{ t('event-cashlink-page.titel-3') }}
      </h2>

      <ul class="content-section__list">
        <li>{{ t('event-cashlink-page.text-3-1') }}</li>
        <li>{{ t('event-cashlink-page.text-3-2') }}</li>
        <li>{{ t('event-cashlink-page.text-3-3') }}</li>
      </ul>

      <!-- Titel 4 -->
      <h2 class="content-section__subtitle">
        {{ t('event-cashlink-page.titel-4') }}
      </h2>
      <p class="content-section__text">
        {{ t('event-cashlink-page.text-4-1') }}
      </p>
      <p class="content-section__text">
        {{ t('event-cashlink-page.text-4-2') }}
      </p>
      <p class="content-section__text">
        {{ t('event-cashlink-page.text-4-3') }}
      </p>
    </section>
  </div>
  <app-footer />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import AppFooter from '@/common/AppFooter.vue'
import CashlinkImage from '@/assets/events-milinovic-image.jpg'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
/* Header Section Styles */
.header-section {
  text-align: center;
  padding: 0 1rem 0;

  &__image {
    max-width: 700px;
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
  }

  &__title {
    max-width: 1000px;
    line-height: 1.6;
    font-size: 2rem;
    margin: 1rem auto 1.5rem;
  }

  &__subtitle {
    max-width: 1000px;
    font-size: 1.2rem;
    margin: 1rem auto 1rem;
  }
}

/* Content Section Styles */
.content-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: left;

  &__subtitle {
    font-size: 1.8rem;
    margin-top: 3rem;
    margin-bottom: 1rem;
  }

  &__text {
    font: inherit;
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    text-align: justify;
    hyphens: auto;
  }

  &__list {
    margin-left: 0;
    padding-left: 1rem;
    margin-bottom: 1rem;
  }

  &__image {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 1rem auto;
  }
}

ul li {
  line-height: 1.6;
  font-size: 1.2rem;
  list-style-type: disc;
  margin: 0 0 2px 16px;
}

.content-section__figure {
  margin: 1.5rem auto;
  text-align: center;
}

.content-section__image {
  max-width: 100%;
  height: auto;
}

.content-section__caption {
  font-size: 1.4rem;
  color: #555;
  margin-top: 0.5rem;
}

/* Media Queries für kleinere Bildschirme */
@media (max-width: 768px) {
  .header-section__title {
    font-size: 1.5rem;
  }

  .content-section__subtitle {
    font-size: 1.5rem;
  }

  .content-section__text {
    font-size: 1rem;
  }

  ul li {
    font-size: 1rem;
    list-style-type: disc;
    margin: 0 0 2px 16px;
  }
}
</style>
