import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'
import { ROUTE_NAMES } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import HomePage from "@/pages/HomePage";
import NftsPage from "@/pages/NftsPage";
import NftDetailsPage from "@/pages/NftDetailsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ConnectPage from "@/pages/ConnectPage";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: ROUTE_NAMES.home,
    component: HomePage,
  },
  {
    path: '/nfts',
    name: ROUTE_NAMES.vppNFTs,
    component: NftsPage,
    meta: { requiresMetaMask: true, hideNavbar: true },
  },
  {
    path: '/nfts/:id',
    name: ROUTE_NAMES.vppNFTDetails,
    component: NftDetailsPage,
    meta: { requiresMetaMask: true, hideNavbar: true },
  },
  {
    path: '/privacy',
    name: ROUTE_NAMES.privacy,
    component: PrivacyPage,
  },
  {
    path: '/connect',
    name: 'ConnectPage',
    component: () => ConnectPage,
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.home },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach(async (to, from, next) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const { provider, isValidChain } = storeToRefs(web3ProvidersStore)

  // Wenn die Route eine MetaMask-Verbindung erfordert
  if (to.meta.requiresMetaMask) {
    if (!provider.value.isConnected || !isValidChain.value) {
      next({ name: 'ConnectPage', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export { router, useRouter, useRoute }
