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
import adminRoutes from '@/pages/AdminPage'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: ROUTE_NAMES.home,
    component: () => import('@/pages/HomePage'),
  },
  ...adminRoutes,
  {
    path: '/nfts',
    name: ROUTE_NAMES.vppNFTs,
    component: () => import('@/pages/NftsPage'),
    meta: { requiresMetaMask: true, hideNavbar: true },
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
  {
    path: '/privacy',
    name: ROUTE_NAMES.privacy,
    component: () => import('@/pages/PrivacyPage'),
    meta: {
      requiresMetaMask: false,
    },
  },
  {
    path: '/imprint',
    name: ROUTE_NAMES.imprint,
    component: () => import('@/pages/ImprintPage'),
    meta: {
      requiresMetaMask: false,
    },
  },
  {
    path: '/accessibility',
    name: ROUTE_NAMES.accessibility,
    component: () => import('@/pages/AccessibilityPage'),
    meta: {
      requiresMetaMask: false,
    },
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
