<template>
  <div v-if="isAppInitialized" class="app__container">
    <app-navbar v-if="!hideNavbar" />
    <router-view />
  </div>
  <loader v-else class="app__loader" />
</template>

<script lang="ts" setup>
import { Loader, AppNavbar } from '@/common'
import { ErrorHandler } from '@/helpers/error-handler'
import { computed, ref } from 'vue'
import { useNotifications } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import { config } from '@config'
import { useRoute } from 'vue-router'
import { useErc721 } from '@/composables/contracts/use-erc721'

const isAppInitialized = ref(false)
const web3ProvidersStore = useWeb3ProvidersStore()
const erc721 = useErc721()

// optionale Anzeige-States (werden von loadDetails() gefüllt)
const info = ref<{ name: string; symbol: string; totalSupply: number } | null
>(
  null
)
const myAddress = ref<string>('')
const myTokens = ref<{ tokenId: number; uri?: string; points?: number }[]>([])
const status = ref<string>('')

const route = useRoute()
const hideNavbar = computed(() => route.meta.hideNavbar === true)

// ---- NEU: eigene Lade-Methode (ruft die vorhandenen erc721-Methoden) ----
async function loadDetails () {
  try {
    status.value = 'Lade…'
    info.value = await erc721.getInfo()
    myAddress.value = await erc721.getMyAddress()
    myTokens.value = await erc721.loadTokensOf()
    status.value = ''
  } catch (e: any) {
    status.value = e?.message ?? String(e)
    console.error(e)
  }
}

// ---- App-Init: Notifications, Titel, Provider-Init, Daten laden ----
const init = async () => {
  isAppInitialized.value = false
  try {
    useNotifications()
    document.title = config.APP_NAME
    await web3ProvidersStore.init()
    // WICHTIG: nicht erc721.loadDetails() (gibt es nicht), sondern unsere Methode
    await loadDetails()
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
  }
  isAppInitialized.value = true
}

init()
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.app__container {
  display: grid;
  grid-template-rows: toRem(85) 1fr max-content;
  flex: 1;
  background: var(--background-primary-light);
}

.app__main {
  padding: var(--app-padding-top) var(--app-padding-right)
  var(--app-padding-bottom) var(--app-padding-left);
}

.fade-enter-active {
  animation: fade-in 0.25s;
}

.fade-leave-active {
  animation: fade-in 0.25s reverse;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.app__loader {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>
