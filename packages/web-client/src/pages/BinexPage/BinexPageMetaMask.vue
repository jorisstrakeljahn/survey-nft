<template>
  <div class="binex-page" lang="de">
    <!-- Header Section -->
    <section class="header-section">
      <h1 class="header-section__title">
        {{ t('binex-page-metamask.title') }}
      </h1>
      <router-link to="/binex/nfts" class="header-section__button">
        {{ t('binex-page-metamask.button-text') }}
      </router-link>
    </section>

    <section id="guide-section-binex" class="content-section">
      <figure class="content-section__figure">
        <img
          :src="binexAbb1Image"
          alt="Bild 1"
          class="content-section__image"
        />
      </figure>
      <figure class="content-section__figure">
        <img
          :src="binexAbb2Image"
          alt="Bild 2"
          class="content-section__image"
        />
      </figure>
      <figure class="content-section__figure">
        <img
          :src="binexAbb3Image"
          alt="Bild 3"
          class="content-section__image"
        />
      </figure>
      <figure class="content-section__figure">
        <img
          :src="binexAbb4Image"
          alt="Bild 4"
          class="content-section__image"
        />
      </figure>
      <figure class="content-section__figure">
        <img
          :src="binexAbb5Image"
          alt="Bild 5"
          class="content-section__image"
        />
      </figure>
      <figure class="content-section__figure">
        <img
          :src="binexAbb6Image"
          alt="Bild 6"
          class="content-section__image"
        />
      </figure>
    </section>
  </div>
  <app-footer />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import AppFooter from '@/common/AppFooter.vue'
import binexAbb1Image from '@/assets/MetaMask-Anleitung-1.jpg'
import binexAbb2Image from '@/assets/MetaMask-Anleitung-2.jpg'
import binexAbb3Image from '@/assets/MetaMask-Anleitung-3.jpg'
import binexAbb4Image from '@/assets/MetaMask-Anleitung-4.jpg'
import binexAbb5Image from '@/assets/MetaMask-Anleitung-5.jpg'
import binexAbb6Image from '@/assets/MetaMask-Anleitung-6.jpg'

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

  &__button {
    display: inline-block;
    margin-top: 2rem;
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
