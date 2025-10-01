<template>
  <div class="binex-page" lang="de">
    <!-- Header Section -->
    <section class="header-section">
      <img
        :src="headerImage"
        alt="Header Image"
        class="header-section__image"
      />
      <h1 class="header-section__title">
        {{ t('binex-page.title') }}
      </h1>
      <div class="header-section__buttons">
        <router-link to="/binex/nfts" class="header-section__button">
          {{ t('binex-page.button-text') }}
        </router-link>
        <router-link
          to="/binex/metamask"
          class="header-section__button header-section__button--blue"
        >
          {{ t('binex-page.button-text-metamask') }}
        </router-link>
      </div>
    </section>

    <!-- Content Section -->
    <!-- Hier noch aufpassen, ich muss hier noch später einen Guide
    einbauen, damit der Mobile Button auch Sinn macht.
    Vielleicht zum Ende der Seite oder so-->
    <section id="guide-section-binex" class="content-section">
      <!-- Titel 2 -->
      <h2 class="content-section__subtitle">
        {{ t('binex-page.titel-2') }}
      </h2>
      <p class="content-section__text">
        {{ t('binex-page.text-2') }}
      </p>

      <!-- Titel 3 -->
      <h2 class="content-section__subtitle">
        {{ t('binex-page.titel-3') }}
      </h2>
      <p class="content-section__text">
        {{ t('binex-page.text-3') }}
      </p>

      <ul class="content-section__list">
        <li>{{ t('binex-page.text-3-1') }}</li>
        <li>{{ t('binex-page.text-3-2') }}</li>
      </ul>

      <figure class="content-section__figure">
        <img
          :src="binexAbb1Image"
          alt="Bild 1"
          class="content-section__image"
        />
        <figcaption class="content-section__caption">
          {{ t('binex-page.caption-1') }}
        </figcaption>
      </figure>

      <ul class="content-section__list">
        <li>{{ t('binex-page.text-3-3') }}</li>
        <li>{{ t('binex-page.text-3-4') }}</li>
        <li>{{ t('binex-page.text-3-5') }}</li>
        <li>{{ t('binex-page.text-3-6') }}</li>
      </ul>

      <!-- Titel 4 -->
      <h2 class="content-section__subtitle">
        {{ t('binex-page.titel-4') }}
      </h2>
      <p class="content-section__text">
        {{ t('binex-page.text-4-1') }}
      </p>

      <!-- Bild nach text-4.1 -->
      <figure class="content-section__figure">
        <img
          :src="binexAbb2Image"
          alt="Bild 2"
          class="content-section__image"
        />
        <figcaption class="content-section__caption">
          {{ t('binex-page.caption-2') }}
        </figcaption>
      </figure>

      <p class="content-section__text">
        {{ t('binex-page.text-4-2') }}
      </p>
      <p class="content-section__text">
        {{ t('binex-page.text-4-3') }}
      </p>

      <!-- Titel 5 -->
      <h2 class="content-section__subtitle">
        {{ t('binex-page.titel-5') }}
      </h2>
      <p class="content-section__text">
        {{ t('binex-page.text-5-1') }}
      </p>

      <!-- Bild nach text-5.1 -->
      <figure class="content-section__figure">
        <img
          :src="binexAbb3Image"
          alt="Bild 3"
          class="content-section__image"
        />
        <figcaption class="content-section__caption">
          {{ t('binex-page.caption-3') }}
        </figcaption>
      </figure>

      <p class="content-section__text">
        {{ t('binex-page.text-5-2') }}
      </p>
      <p class="content-section__text">
        {{ t('binex-page.text-5-3') }}
      </p>

      <!-- Titel 6 -->
      <h2 class="content-section__subtitle">
        {{ t('binex-page.titel-6') }}
      </h2>
      <p class="content-section__text">
        {{ t('binex-page.text-6') }}
      </p>

      <!-- Titel 7 -->
      <h2 class="content-section__subtitle">
        {{ t('binex-page.titel-7') }}
      </h2>
      <p class="content-section__text">
        {{ t('binex-page.text-7') }}
      </p>
    </section>
  </div>
  <app-footer />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import AppFooter from '@/common/AppFooter.vue'
import headerImage from '@/assets/project-binex-image.jpg'
import binexAbb1Image from '@/assets/binex-abb-1-image.png'
import binexAbb2Image from '@/assets/binex-abb-2-image.png'
import binexAbb3Image from '@/assets/binex-abb-3-image.png'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
/* Header Section Styles */
.header-section {
  text-align: center;
  padding: 2rem 1rem 0;

  &__image {
    width: 480px;
    height: 320px;
    border-radius: 8px;
    object-fit: cover;
  }

  &__title {
    font-size: 2rem;
    margin-top: 1.5rem;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  &__button {
    display: inline-block;
    padding: 0.75rem 3rem;
    background-color: #000000;
    color: #fff;
    font-size: 1.3rem;
    font-weight: 500;
    text-decoration: none;
    border-radius: 12px;
    transition: transform 0.3s;
    opacity: 0.8;

    &:hover {
      transform: scale(1.08);
    }
  }

  &__button--blue {
    background-color: #007bff;
    color: #fff;
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
    line-height: 1.4;
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

  .header-section__image {
    width: 100%;
    height: auto;
  }

  .content-section__subtitle {
    font-size: 1.5rem;
  }

  .content-section__text {
    font-size: 1rem;
  }

  .content-section__caption {
    font-size: 1rem;
    line-height: 1.1;
  }

  ul li {
    font-size: 1rem;
    list-style-type: disc;
    margin: 0 0 2px 16px;
  }
}
</style>
