<template>
  <div class="admin-page">
    <main class="admin-page__main">
      <header class="admin-page__header">
        <h1>{{ t('admin.title') }}</h1>

        <!-- Role badges: reflect current privileges at a glance -->
        <div class="badges">
          <span class="badge" :class="isDeleter ? 'badge--ok' : 'badge--warn'">
            {{ t(isDeleter ? 'admin.badges.deleter' : 'admin.badges.noDeleter') }}
          </span>
          <span class="badge" :class="canManage ? 'badge--ok' : 'badge--muted'">
            {{ t(canManage ? 'admin.badges.roleAdmin' : 'admin.badges.noRoleAdmin') }}
          </span>
        </div>
      </header>

      <!-- Navigation appears only when the user has at least one role.
           A11y: real navigation (list of links), no forced "tab" roles. -->
      <nav v-if="canAccess" class="admin-nav" aria-label="Admin sections">
        <ul class="admin-tabs">
          <!-- Wallets: visible for Deleter (and Admin) -->
          <li>
            <RouterLink class="tab" active-class="tab--active" :to="{ name: 'AdminWallets' }">
              {{ t('admin.tabs.wallets') }}
            </RouterLink>
          </li>

          <!-- Roles: visible only for Admin -->
          <li v-if="canManage">
            <RouterLink class="tab" active-class="tab--active" :to="{ name: 'AdminRoles' }">
              {{ t('admin.tabs.roles') }}
            </RouterLink>
          </li>

          <!-- Generator: visible for Deleter (and Admin) -->
          <li>
            <RouterLink class="tab" active-class="tab--active" :to="{ name: 'AdminGenerator' }">
              {{ t('admin.tabs.generator') }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Friendly notice when no privileges -->
      <div v-else class="help help--error" style="margin: 12px 0;">
        {{ t('admin.access.denied') }}
      </div>

      <!-- Render child views only when the user can access something -->
      <RouterView v-if="canAccess" v-slot="{ Component }">
        <!-- Pass down permission flags so children can hide/disable controls accordingly -->
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

/**
 * OpenZeppelin AccessControl: DEFAULT_ADMIN_ROLE == 0x00..00
 * Make this robust across ethers v5/v6.
 */
const DEFAULT_ADMIN_ROLE: string =
  // ethers v5
  ((ethers as any).constants?.HashZero) ??
  // ethers v6
  ((ethers as any).ZeroHash) ??
  // hard fallback
  '0x0000000000000000000000000000000000000000000000000000000000000000'

/**
 * Permission flags:
 *  - isDeleter: can delete/burn tokens and access Wallets/Generator
 *  - canManage: has DEFAULT_ADMIN_ROLE; can manage roles
 */
const isDeleter = ref(false)
const canManage = ref(false)

/** Gate for the whole admin area. If false, we render a friendly denial message. */
const canAccess = computed(() => isDeleter.value || canManage.value)

/**
 * Returns the currently active EIP-1193 account or null if not connected.
 * We do NOT request connection here; this layout only reflects current state.
 */
async function getActiveAccount(): Promise<string | null> {
  const eth = (window as any).ethereum
  if (!eth?.request) return null
  const accs = await eth.request({ method: 'eth_accounts' }).catch(() => [])
  return Array.isArray(accs) && accs.length ? String(accs[0]) : null
}

/**
 * Read role flags from the on-chain contract using a read-only RPC.
 * Fast path: fetch DELETER_ROLE id once, then run two hasRole checks in parallel.
 */
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
      c.hasRole(dr, addr)
    ])

    isDeleter.value = Boolean(del)
    canManage.value = Boolean(adm)
  } catch (e) {
    // On any failure, fall back to "no access" to be safe and log for diagnostics.
    console.error('refreshRoles failed:', e)
    isDeleter.value = false
    canManage.value = false
  }
}

/**
 * Initial role fetch and event wiring.
 * We listen to account/chain changes to keep the header badges and tabs in sync.
 */
onMounted(() => {
  refreshRoles().catch(() => {})

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

.admin-nav {
  margin: 8px 0 12px;
}

.tab--active {
  background: #eef3ff;
}
</style>
