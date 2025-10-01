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
    path: '/admin',
    name: ROUTE_NAMES.admin,
    component: () => import('@/pages/AdminPage'),
  },
  {
    path: '/nfts',
    name: ROUTE_NAMES.vppNFTs,
    component: () => import('@/pages/NftsPage'),
    meta: { requiresMetaMask: true, hideNavbar: true },
  },
  {
    path: '/nfts/:id',
    name: ROUTE_NAMES.vppNFTDetails,
    component: () => import('@/pages/NftDetailsPage'),
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
