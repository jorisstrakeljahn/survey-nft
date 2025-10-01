<template>
  <div class="vpp-page" lang="de">
    <section class="header-section">
      <img
        :src="HeaderImage"
        alt="Header Image"
        class="header-section__image"
      />
      <h1 class="header-section__title">
        {{ t('vpp-documentation-page.title') }}
      </h1>
      <p class="header-section__subtitle">
        {{ t('vpp-documentation-page.subtitle') }}
      </p>
    </section>

    <!-- Dokumentation Section -->
    <section id="guide-section-vpp" class="documentation-section">
      <h2 class="documentation-section__title">
        {{ t('vpp-documentation-page.guide-title') }}
      </h2>

      <!-- Für Teilnehmer:innen -->
      <div class="documentation-section__group">
        <h3 class="documentation-section__subtitle">
          {{ t('vpp-documentation-page.guide-title-participant') }}
        </h3>
        <accordion-item
          v-for="(item, index) in participantItems"
          :key="index"
          :title="item.title"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="item.content"></div>
        </accordion-item>
      </div>

      <!-- Für Umfrageersteller:innen -->
      <div class="documentation-section__group">
        <h3 class="documentation-section__subtitle">
          {{ t('vpp-documentation-page.guide-title-organizer') }}
        </h3>
        <accordion-item
          v-for="(item, index) in surveyCreatorItems"
          :key="index"
          :title="item.title"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="item.content"></div>
        </accordion-item>
      </div>
    </section>

    <section class="info-section">
      <h2 class="info-section__title">
        {{ t('vpp-documentation-page.info-title') }}
      </h2>
      <p class="info-section__text">
        {{ t('vpp-documentation-page.info-text') }}
      </p>
    </section>
  </div>
  <app-footer />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import AppFooter from '@/common/AppFooter.vue'
import AccordionItem from '@/common/AccordionItem.vue'
import HeaderImage from '@/assets/vpp-start-image.jpg'
import { ROUTE_NAMES } from '@/enums'

export default defineComponent({
  name: 'vpp-doc-page',
  components: {
    AppFooter,
    AccordionItem,
  },
  setup() {
    const { t } = useI18n()
    return {
      t,
      ROUTE_NAMES,
    }
  },
  data() {
    return {
      HeaderImage,
      participantItems: [
        {
          title: 'Metamask-Wallet erstellen',
          content:
            'Informationen zum Erstellen und Hinzufügen eines Metamask Wallets für verschiedene Browser findest du auf <a href="https://support.metamask.io/de/getting-started/getting-started-with-metamask/" target="_blank">dieser Seite</a>.',
        },
        {
          title: 'Mit Q-Blockchain verknüpfen',
          content: 'Info bald verfügbar...',
        },
        {
          title: 'Punkte erhalten',
          content: 'Info bald verfügbar...',
        },
      ],
      surveyCreatorItems: [
        {
          title: 'VPP Doku in SociSurvey einbinden',
          content: 'Info bald verfügbar...',
        },
        {
          title: 'VPP Doku mit anderen Tools nutzen',
          content: 'Info bald verfügbar...',
        },
      ],
    }
  },
})
</script>

<style lang="scss" scoped>
/* Header Section Styles */
.header-section {
  text-align: center;
  padding: 2rem 1rem;

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

  &__subtitle {
    max-width: 1000px;
    font-size: 1.4rem;
    line-height: 1.5;
    text-align: justify;
    hyphens: auto;
    margin: 1rem auto 0;
  }

  &__button {
    display: inline-block;
    margin-top: 1rem;
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

/* Dokumentation Section Styles */
.documentation-section {
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  &__group {
    max-width: 1000px;
    width: 100%;
    margin-bottom: 2rem;
  }

  &__subtitle {
    font-size: 2rem;
    margin-bottom: 1rem;
    margin-top: 2rem;
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
    line-height: 1.6;
    text-align: justify;
    hyphens: auto;
  }
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

  .header-section__subtitle {
    font-size: 1rem;
  }

  .documentation-section__title {
    font-size: 1.5rem;
  }

  .documentation-section__subtitle {
    font-size: 1.2rem;
  }

  .info-section__text {
    font-size: 1rem;
  }
}
</style>
