import { Buffer } from 'buffer'
import process from 'process'

;(globalThis as any).global ??= globalThis
;(globalThis as any).Buffer ??= Buffer
;(globalThis as any).process ??= process

import "@fontsource-variable/inter";

import 'virtual:svg-icons-register'

import App from '@/App.vue'
import log from 'loglevel'

import VueToastificationPlugin from 'vue-toastification'
import { ICON_NAMES, ROUTE_NAMES } from '@/enums'
import { createApp, getCurrentInstance, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { i18n } from '@/localization'
import { config } from '@config'
import { router } from '@/router'
import { store } from '@/store'

const app = createApp({
  setup() {
    const app = getCurrentInstance()
    const { t, locale } = useI18n({ useScope: 'global' })
    if (app) {
      app.appContext.config.globalProperties.$t = t
      app.appContext.config.globalProperties.$locale = locale
    }
  },
  render: () => h(App),
})

log.setDefaultLevel(config.LOG_LEVEL)

app.use(router).use(store).use(i18n).use(VueToastificationPlugin)

app.config.globalProperties.$routes = ROUTE_NAMES
app.config.globalProperties.$config = config
app.config.globalProperties.$icons = ICON_NAMES

app.config.errorHandler = function (err, vm, info) {
  log.error(`Error: ${err}; Info: ${info}`)
}

app.mount('#app')

if ("requestIdleCallback" in window) {
  (window as any).requestIdleCallback(() => import("@/lazy-styles"))
} else {
  setTimeout(() => import("@/lazy-styles"), 0)
}
