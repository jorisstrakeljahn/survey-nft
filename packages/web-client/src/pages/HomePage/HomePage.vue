<template>
  <div class="home-page" lang="de">
    <section class="header-section">
      <img
        :src="HeaderImage"
        alt="Header Image"
        class="header-section__image"
      />
      <h1 class="header-section__title">
        {{ t('home-page.title') }}
      </h1>
      <p class="header-section__subtitle">
        {{ t('home-page.subtitle') }}
      </p>
    </section>

    <section class="projects-section">
      <h2 class="projects-section__title">
        {{ t('home-page.projects') }}
      </h2>
      <div class="projects-section__list">
        <project-card
          v-for="(project, index) in projects"
          :key="index"
          :image-src="project.imageSrc"
          :title="project.title"
          :description="project.description"
          :route-name="project.routeName"
        />
      </div>
    </section>

    <section class="info-section">
      <h2 class="info-section__title">
        {{ t('home-page.info-title') }}
      </h2>
      <p class="info-section__text">
        {{ t('home-page.info-text') }}
      </p>
    </section>
  </div>
  <app-footer />
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n'
import ProjectCard from '@/pages/HomePage/ProjectCard.vue'
import AppFooter from '@/common/AppFooter.vue'
import HeaderImage from '@/assets/homepage-start-image.jpg'
import BinexImage from '@/assets/project-binex-image.jpg'
import VppImage from '@/assets/project-vpp-image.jpg'
import { ROUTE_NAMES } from '@/enums'

export default {
  name: 'home-page',
  components: {
    ProjectCard,
    AppFooter,
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      HeaderImage,
      projects: [
        {
          imageSrc: BinexImage,
          title: 'Binex',
          description:
            'NFT-Spiel und Peer-to-Peer Plattform für den vielfältigen Einsatz an Hochschulen.',
          routeName: ROUTE_NAMES.binex,
        },
        {
          imageSrc: VppImage,
          title: 'Versuchspersonenpunkte',
          description:
            'Dokumentation einer Prüfungsleistung für Wirtschaftspsychologie.',
          routeName: ROUTE_NAMES.vpp,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
/* Header Section Styles */
.header-section {
  text-align: center;
  padding: 2rem 1rem;

  &__image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
  }

  &__title {
    font-size: 2rem;
    margin-top: 1.5rem;
  }

  &__subtitle {
    max-width: 1000px;
    font-size: 1.4rem;
    margin: 1rem auto 0;
  }
}

/* Projekte Section Styles */
.projects-section {
  padding: 2rem 1rem 0;

  &__title {
    font-size: 1.8rem;
    text-align: center;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}

.info-section {
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  &__text {
    max-width: 1000px;
    width: 100%;
    font-size: 1.2rem;
    line-height: 1.5;
    text-align: justify;
    hyphens: auto;
  }
}

/* Optional: Scrollbar Styling */
.projects-section__list::-webkit-scrollbar {
  height: 8px;
}

.projects-section__list::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}

/* Media Queries für kleinere Bildschirme */
@media (max-width: 768px) {
  .header-section__title {
    font-size: 1.5rem;
  }

  .header-section__subtitle {
    font-size: 1rem;
  }

  .info-section__text {
    font-size: 1rem;
  }
}
</style>
