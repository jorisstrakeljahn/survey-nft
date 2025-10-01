// src/i18n/index.ts
import { createI18n } from 'vue-i18n'

// EN
import enHome from '@/localization/en/home.json'
import enFooter from '@/localization/en/footer.json'
import enHeader from '@/localization/en/header.json'
import enNfts from '@/localization/en/nfts.json'
import enNft from '@/localization/en/nft.json'
import enAdmin from '@/localization/en/admin.json'

// DE
import deHome from '@/localization/de/home.json'
import deFooter from '@/localization/de/footer.json'
import deHeader from '@/localization/de/header.json'
import deNfts from '@/localization/de/nfts.json'
import deNft from '@/localization/de/nft.json'
import deAdmin from '@/localization/de/admin.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    de: { ...deHome, ...deFooter, ...deHeader, ...deNfts, ...deNft, ...deAdmin },
    en: { ...enHome, ...enFooter, ...enHeader, ...enNfts, ...enNft, ...enAdmin },
  },
})

const LS_KEY = 'app_lang'
export function initLocaleFromStorage() {
  const saved = localStorage.getItem(LS_KEY)
  if (saved === 'de' || saved === 'en') {
    i18n.global.locale.value = saved
  }
}
