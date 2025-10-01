<template>
  <div class="events-page" lang="de">
    <section class="header-section">
      <img
        :src="HeaderImage"
        alt="Header Image"
        class="header-section__image"
      />
      <h1 class="header-section__title">
        {{ t('events-page.title') }}
      </h1>
      <p class="header-section__subtitle">
        {{ t('events-page.subtitle') }}
      </p>
    </section>

    <section class="events-section">
      <h2 class="events-section__title">
        {{ t('events-page.events') }}
      </h2>
      <div class="events-section__list">
        <event-card
          v-for="(event, index) in events"
          :key="index"
          :image-src="event.imageSrc"
          :title="event.title"
          :description="event.description"
          :date="event.date"
          :route-name="event.routeName"
        />
      </div>
    </section>

    <section class="info-section">
      <h2 class="info-section__title">
        {{ t('events-page.info-title') }}
      </h2>
      <p class="info-section__text">
        {{
          t('events-page.info-text', {
            account: 'ak-krypto',
            domain: 'hsbi.de',
          })
        }}
      </p>
    </section>
  </div>
  <app-footer />
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n'
import AppFooter from '@/common/AppFooter.vue'
import HeaderImage from '@/assets/events-start-image.jpg'
import EventCard from '@/pages/EventsPage/EventCard.vue'
import CashlinkImage from '@/assets/events-milinovic-image.jpg'
import { ROUTE_NAMES } from '@/enums'

export default {
  name: 'events-page',
  components: {
    EventCard,
    AppFooter,
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      HeaderImage,
      events: [
        {
          imageSrc: CashlinkImage,
          title: 'Vortrag Cashlink',
          description:
            'Frau Dr. Jennifer Milinovic spricht über die Tokenisierung von Wertpapieren',
          date: '27.11.24, 14 Uhr, HSBI Audimax',
          routeName: ROUTE_NAMES.cashlinkEvent,
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
    margin: 1rem auto 0;
  }
}

/* Projekte Section Styles */
.events-section {
  padding: 2rem 1rem;

  &__title {
    font-size: 1.8rem;
    text-align: center;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
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

/* Optional: Scrollbar Styling */
.events-section__list::-webkit-scrollbar {
  height: 8px;
}

.events-section__list::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
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

  .info-section__text {
    font-size: 1rem;
  }
}
</style>
