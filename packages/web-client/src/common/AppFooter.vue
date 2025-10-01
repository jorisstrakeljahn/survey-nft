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
              account: 'ak-krypto',
              domain: 'hsbi.de',
            })
          }}
        </p>
      </div>
    </div>
    <div class="footer-links">
      <a
        href="https://www.hsbi.de/datenschutzerklaerung"
        class="footer-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ t('footer.datenschutz') }}
      </a>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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

  .footer-links {
    text-align: center;
    margin-top: 1rem;

    .footer-link {
      color: #fff;
      text-decoration: none;
      margin: 0 0.5rem;
    }

    .footer-separator {
      color: #fff;
      margin: 0 0.5rem;
    }
  }
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
}
</style>
