// src/i18n/index.ts
import { createI18n } from 'vue-i18n'

// EN
import enHome from '@/localization/en/home.json'
import enFooter from '@/localization/en/footer.json'
import enHeader from '@/localization/en/header.json'
import enNfts from '@/localization/en/nfts.json'
import enNft from '@/localization/en/nft.json'
import enAdmin from '@/localization/en/admin.json'
import enMeta from '@/localization/en/meta.json'
import enPrivacy from '@/localization/en/privacy.json'
import enImprint from '@/localization/en/imprint.json'
import enAccessibility from '@/localization/en/accessibility.json'
import enConnect from '@/localization/en/connect.json'

// DE
import deHome from '@/localization/de/home.json'
import deFooter from '@/localization/de/footer.json'
import deHeader from '@/localization/de/header.json'
import deNfts from '@/localization/de/nfts.json'
import deNft from '@/localization/de/nft.json'
import deAdmin from '@/localization/de/admin.json'
import deMeta from '@/localization/de/meta.json'
import dePrivacy from '@/localization/de/privacy.json'
import deImprint from '@/localization/de/imprint.json'
import deAccessibility from '@/localization/de/accessibility.json'
import deConnect from '@/localization/de/connect.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    de: {
      ...deHome,
      ...deFooter,
      ...deHeader,
      ...deNfts,
      ...deNft,
      ...deAdmin,
      ...deMeta,
      ...dePrivacy,
      ...deImprint,
      ...deAccessibility,
      ...deConnect,
    },
    en: {
      ...enHome,
      ...enFooter,
      ...enHeader,
      ...enNfts,
      ...enNft,
      ...enAdmin,
      ...enMeta,
      ...enPrivacy,
      ...enImprint,
      ...enAccessibility,
      ...enConnect,
    },
  },
})

const LS_KEY = 'app_lang'
export function initLocaleFromStorage() {
  const saved = localStorage.getItem(LS_KEY)
  if (saved === 'de' || saved === 'en') {
    i18n.global.locale.value = saved
  }
}
