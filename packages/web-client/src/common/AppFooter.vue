<template>
  <!-- Footer-Bereich -->
  <section class="footer-section">
    <div class="footer-content">
      <div class="footer-column">
        <h3 class="footer-title">
          {{ t('footer.footerTitle') }}
        </h3>
        <p class="footer-text">
          {{ t('footer.footerText') }}
        </p>
      </div>
      <div class="footer-column">
        <h3 class="footer-title">
          {{ t('footer.contactTitle') }}
        </h3>
        <p class="footer-text">
          {{ t('footer.contactPerson') }}
        </p>
        <p class="footer-text">
          {{ t('footer.contactPhone') }}
        </p>
        <p class="footer-text">
          {{
            t('footer.contactEmail', {
              account: 'vpstunden',
              domain: 'hsbi.de',
            })
          }}
        </p>
      </div>

      <div class="app-footer__bottom">
        <small class="app-footer__copy">
          © {{ year }} HSBI
        </small>

        <nav class="footer-legal" aria-label="Rechtliche Links">
          <ul class="footer-legal__list">
            <li class="footer-legal__item">
              <router-link :to="{ name: ROUTE_NAMES.imprint }" class="footer-legal__link">
                {{ t('footer.imprint') }}
              </router-link>
            </li>
            <li class="footer-legal__item">
              <router-link :to="{ name: ROUTE_NAMES.privacy }" class="footer-legal__link">
                {{ t('footer.datenschutz') }}
              </router-link>
            </li>
            <li class="footer-legal__item">
              <router-link :to="{ name: ROUTE_NAMES.accessibility }" class="footer-legal__link">
                {{ t('footer.accessibility') }}
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ROUTE_NAMES } from '@/enums'

/** GLOBALER Composer */
const { t } = useI18n({ useScope: 'global' })

const year = new Date().getFullYear()

const mail = t('footer.contactEmail', {
  account: 'vpstunden',
  domain: 'hsbi.de',
})
</script>

<style lang="scss" scoped>
/* Footer-Bereich */
.footer-section {
  background-color: #000;
  color: #fff;
  padding: 2rem 1rem;

  .footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    max-width: 1000px;
    margin: 0 auto;
  }

  .footer-column {
    flex: 1 1 45%;
    margin-bottom: 1rem;
    text-align: center;
  }

  .footer-title {
    color: #d9d9d9;
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
  }

  .footer-text {
    color: #d9d9d9;
    font-size: 1rem;
    margin: 0.25rem 0;
  }
}

.app-footer__divider {
  margin: 18px 0;
  border: 0;
  border-top: 1px solid #e7e7e7;
}

.app-footer__bottom {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
  align-items: center;
  justify-content: center;

  @media (min-width: 680px) {
    grid-template-columns: auto 1fr;
  }
}

.app-footer__copy {
  color: #f8f8f8;
  font-size: 13px;
}

.footer-legal__list {
  display: flex;
  flex-wrap: wrap;         /* <-- die Magie: bricht bei wenig Platz um */
  gap: 8px 16px;           /* vertikal / horizontaler Abstand */
  justify-content: flex-start;
  color: #fff;

  /* Bei schmalen Screens zentrieren */
  @media (max-width: 679px) {
    justify-content: center;
  }

  margin: 0;
  padding: 0;
  list-style: none;
}

.footer-legal__item {
  flex: 0 1 auto;          /* Items dürfen umbrechen */
  position: relative;
}

/* Optional: Trennerpunkte nur auf breiten Screens (wirken wie "·" zwischen Links) */
@media (min-width: 680px) {
  .footer-legal__item + .footer-legal__item::before {
    content: "·";
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    color: #bdbdbd;
  }
}

.footer-legal__link {
  display: inline-block;   /* bessere Klickfläche */
  padding: 4px 8px;
  border-radius: 8px;
  text-decoration: none;
  color: #fff7ed;
  border: 1px solid transparent;
}

/* Responsive Anpassungen */
@media (max-width: 768px) {
  .news-card {
    width: 100%;
    margin: 0;
  }

  .news-card__title {
    font-size: 1.2rem;
  }

  .news-card__date {
    font-size: 1rem;
  }

  .news-card__description {
    font-size: 1rem;
  }

  .footer-content {
    flex-direction: column;
    align-items: center;
  }

  .footer-column {
    flex: 1 1 100%;
    text-align: center;
  }

  .footer.footer-section {
    .footer-title {
      font-size: 1rem;
    }

    .footer-text {
      font-size: 0.8rem;
    }
  }

  .app-footer__copy { display: none; }
}
</style>
