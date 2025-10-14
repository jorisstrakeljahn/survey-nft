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

      <!-- i18n-beschriftete Tabs -->
      <nav class="admin-tabs" role="tablist" aria-label="Admin Sections">
        <RouterLink class="tab" active-class="tab--active" :to="{ name: 'AdminWallets' }">
          {{ t('admin.tabs.wallets') }}
        </RouterLink>
        <RouterLink class="tab" active-class="tab--active" :to="{ name: 'AdminRoles' }">
          {{ t('admin.tabs.roles') }}
        </RouterLink>
        <RouterLink class="tab" active-class="tab--active" :to="{ name: 'AdminGenerator' }">
          {{ t('admin.tabs.generator') }}
        </RouterLink>
      </nav>

      <!-- Child-Views bekommen die Berechtigungen als Props -->
      <RouterView v-slot="{ Component }">
        <component :is="Component" :isDeleter="isDeleter" :canManage="canManage" />
      </RouterView>
    </main>
  </div>

  <AppFooter/>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useErc721 } from '@/composables/contracts/use-erc721'
import AppFooter from '@/common/AppFooter.vue'

const { t } = useI18n({ useScope: 'global' })

const { getMyAddress, hasDeleterRole, getDeleterRoleAdmin } = useErc721()
const isDeleter = ref(false)
const canManage = ref(false)

onMounted(async () => {
  // sorgt für Verbindung/Signer (falls nötig), dann Rollen laden
  await getMyAddress()
  isDeleter.value = await hasDeleterRole()
  canManage.value = await getDeleterRoleAdmin()
})
</script>

<style scoped>
.admin-page{
  min-height:100vh;
  overflow-y:auto;
  scrollbar-gutter: stable both-edges;
}

.admin-page__main{max-width:1240px;margin:0 auto;padding:24px 16px}
.admin-page__header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
.badges{display:flex;gap:8px;flex-wrap:wrap}
.badge{display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;font-size:.8rem;font-weight:800;border:1px solid #e5e5e5}
.badge--ok{background:#e8fff3;color:#065f46;border-color:#bbf7d0}
.badge--warn{background:#fff7ed;color:#9a3412;border-color:#fed7aa}
.badge--muted{background:#f6f6f6;color:#444}
.admin-tabs{display:flex;gap:8px;margin:8px 0 16px}
.tab{padding:8px 12px;border-radius:10px;border:1px solid #eee;text-decoration:none;color:#111;font-weight:700}
.tab--active{background:#f6f6f6}
</style>
