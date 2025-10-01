// src/i18n/index.ts
import { createI18n } from 'vue-i18n'

// EN
import enHome from '@/localization/en/home.json'
import enFooter from '@/localization/en/footer.json'
import enHeader from '@/localization/en/header.json'
import enNfts from '@/localization/en/nfts.json'

// DE
import deHome from '@/localization/de/home.json'
import deFooter from '@/localization/de/footer.json'
import deHeader from '@/localization/de/header.json'
import deNfts from '@/localization/de/nfts.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    de: { ...deHome, ...deFooter, ...deHeader, ...deNfts },
    en: { ...enHome, ...enFooter, ...enHeader, ...enNfts },
  },
})

// Optional: beim App-Start Locale aus localStorage herstellen
const LS_KEY = 'app_lang'
export function initLocaleFromStorage() {
  const saved = localStorage.getItem(LS_KEY)
  if (saved === 'de' || saved === 'en') {
    i18n.global.locale.value = saved
  }
}
