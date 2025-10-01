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

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: ROUTE_NAMES.home,
    component: () => import('@/pages/HomePage'),
  },
  {
    path: '/blockchain-basics',
    name: ROUTE_NAMES.blockchainBasics,
    component: () => import('@/pages/BlockchainBasicsPage'),
  },
  {
    path: '/binex',
    name: ROUTE_NAMES.binex,
    component: () => import('@/pages/BinexPage'),
  },
  {
    path: '/binex/metamask',
    name: ROUTE_NAMES.binexMetaMask,
    component: () => import('@/pages/BinexPage/BinexPageMetaMask.vue'),
  },
  {
    path: '/events',
    name: ROUTE_NAMES.events,
    component: () => import('@/pages/EventsPage'),
  },
  {
    path: '/events/cashlink',
    name: ROUTE_NAMES.cashlinkEvent,
    component: () => import('@/pages/EventsPage/CashlinkEventPage.vue'),
  },
  {
    path: '/vpp',
    name: ROUTE_NAMES.vpp,
    component: () => import('@/pages/VPPDocPage'),
  },
  {
    path: '/binex/nfts',
    name: ROUTE_NAMES.vppNFTs,
    component: () => import('@/pages/NftsPage'),
    meta: { requiresMetaMask: true, hideNavbar: true },
  },
  {
    path: '/binex/nfts/:id',
    name: ROUTE_NAMES.vppNFTDetails,
    component: () => import('@/pages/NftDetailsPage'),
    meta: { requiresMetaMask: true, hideNavbar: true },
  },
  {
    path: '/privacy',
    name: ROUTE_NAMES.privacy,
    component: () => import('@/pages/PrivacyPage'),
  },
  {
    path: '/connect',
    name: 'ConnectPage',
    component: () => import('@/pages/ConnectPage/ConnectPage.vue'),
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
