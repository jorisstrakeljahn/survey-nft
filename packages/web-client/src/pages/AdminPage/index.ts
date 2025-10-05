// src/pages/AdminPage/index.ts
import type { RouteRecordRaw } from 'vue-router'

const AdminLayout = () => import('./AdminLayout.vue')
const AdminWallets = () => import('./AdminWallets.vue')
const AdminRoles = () => import('./AdminRoles.vue')
const AdminGenerator = () => import('./AdminGenerator.vue')

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', name: 'Admin', redirect: { name: 'AdminWallets' } },
      { path: 'wallets', name: 'AdminWallets', component: AdminWallets },
      { path: 'roles', name: 'AdminRoles', component: AdminRoles },
      { path: 'generator', name: 'AdminGenerator', component: AdminGenerator },
    ],
  },
]

export default adminRoutes
