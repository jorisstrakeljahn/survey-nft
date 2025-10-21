<template>
  <div class="admin-page">
    <main class="admin-page__main">
      <header class="admin-page__header">
        <h1>{{ t('admin.title') }}</h1>

        <div class="badges">
          <span class="badge" :class="isDeleter ? 'badge--ok' : 'badge--warn'">
            {{ t(isDeleter ? 'admin.badges.deleter' : 'admin.badges.noDeleter') }}
          </span>
          <span class="badge" :class="canManage ? 'badge--ok' : 'badge--muted'">
            {{ t(canManage ? 'admin.badges.roleAdmin' : 'admin.badges.noRoleAdmin') }}
          </span>
        </div>
      </header>

      <!-- Tabs nur zeigen, wenn mindestens eine Rolle vorhanden ist -->
      <nav v-if="canAccess" class="admin-tabs" role="tablist" aria-label="Admin Sections">
        <!-- Wallets: sichtbar für Deleter (und Admin) -->
        <RouterLink class="tab" active-class="tab--active" :to="{ name: 'AdminWallets' }">
          {{ t('admin.tabs.wallets') }}
        </RouterLink>

        <!-- Roles: NUR sichtbar, wenn Admin -->
        <RouterLink
          v-if="canManage"
          class="tab"
          active-class="tab--active"
          :to="{ name: 'AdminRoles' }"
        >
          {{ t('admin.tabs.roles') }}
        </RouterLink>

        <!-- Generator: sichtbar für Deleter (und Admin) -->
        <RouterLink class="tab" active-class="tab--active" :to="{ name: 'AdminGenerator' }">
          {{ t('admin.tabs.generator') }}
        </RouterLink>
      </nav>

      <!-- Hinweis, wenn keine Berechtigung -->
      <div v-else class="help help--error" style="margin: 12px 0;">
        {{ t('admin.access.denied') }}
      </div>

      <!-- Child-Views nur rendern, wenn Zugriff -->
      <RouterView v-if="canAccess" v-slot="{ Component }">
        <component :is="Component" :isDeleter="isDeleter" :canManage="canManage" />
      </RouterView>
    </main>
  </div>

  <AppFooter/>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ethers } from 'ethers'
import { readRpc } from '@/lib/gsn-client.v5'
import { NFT_ADDRESS } from '@/config/addresses'
import AppFooter from '@/common/AppFooter.vue'

const { t } = useI18n({ useScope: 'global' })

const isDeleter = ref(false)  // steuert Wallets/Generator & Burn-Badge
const canManage = ref(false)  // steuert Roles-Tab & Admin-Badge

// Zugriff insgesamt (mind. eine Rolle)
const canAccess = computed(() => isDeleter.value || canManage.value)

async function getActiveAccount(): Promise<string | null> {
  const eth = (window as any).ethereum
  if (!eth?.request) return null
  const accs = await eth.request({ method: 'eth_accounts' }).catch(() => [])
  return Array.isArray(accs) && accs.length ? String(accs[0]) : null
}

async function refreshRoles() {
  try {
    const addr = await getActiveAccount()
    if (!addr) { isDeleter.value = false; canManage.value = false; return }

    const rpc = readRpc()
    const c = new ethers.Contract(
      NFT_ADDRESS,
      [
        'function DELETER_ROLE() view returns (bytes32)',
        'function hasRole(bytes32 role, address account) view returns (bool)'
      ],
      rpc
    )

    const dr = await c.DELETER_ROLE()

    const [adm, del] = await Promise.all([
      c.hasRole(DEFAULT_ADMIN_ROLE, addr),
      c.hasRole(dr, addr),
    ])

    isDeleter.value = Boolean(del)
    canManage.value = Boolean(adm)
  } catch {
    isDeleter.value = false
    canManage.value = false
  }
}

onMounted(() => {
  refreshRoles().catch(() => {})

  // Bei Account- oder Chain-Wechsel Berechtigungen neu laden
  const eth = (window as any).ethereum
  if (eth?.on) {
    eth.on('accountsChanged', () => refreshRoles().catch(() => {}))
    eth.on('chainChanged',   () => refreshRoles().catch(() => {}))
  }
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  overflow-y: auto;
  scrollbar-gutter: stable both-edges;
}

.admin-page__main {
  max-width: 1240px;
  margin: 0 auto;
  padding: 24px 16px;
}

.admin-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
  border: 1px solid #e5e5e5;
}

.badge--ok {
  background: #e8fff3;
  color: #065f46;
  border-color: #bbf7d0;
}

.badge--warn {
  background: #fff7ed;
  color: #9a3412;
  border-color: #fed7aa;
}

.badge--muted {
  background: #f6f6f6;
  color: #444;
}

.admin-tabs {
  display: flex;
  gap: 8px;
  margin: 8px 0 16px;
}

.tab {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #eee;
  text-decoration: none;
  color: #111;
  font-weight: 700;
}
</style>
