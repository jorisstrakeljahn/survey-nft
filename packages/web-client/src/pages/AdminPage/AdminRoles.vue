<!-- src/pages/AdminPage/AdminRoles.vue -->
<template>
  <section class="box">
    <h2>{{ t('admin.roles.title') }}</h2>
    <div class="help">{{ t('admin.roles.help') }}</div>

    <div class="roles-line">
      <input
        v-model="roleAddr"
        :placeholder="t('admin.roles.placeholder')"
        @keyup.enter="checkRole"
        @keydown.esc="clear"
      />
      <div class="roles-actions">
        <button
          class="btn"
          :disabled="!canManage || !isAddress(roleAddr) || isBusy"
          @click="grantRole"
        >
          {{ t('admin.roles.grant') }}
        </button>
        <button
          class="btn btn--ghost"
          :disabled="!canManage || !isAddress(roleAddr) || isBusy"
          @click="revokeRole"
        >
          {{ t('admin.roles.revoke') }}
        </button>
        <button class="btn btn--ghost" :disabled="isBusy" @click="clear">
          {{ t('common.clear') }}
        </button>
      </div>
    </div>

    <div class="help" :class="{ 'help--error': isErr }" v-if="roleMsg">
      {{ roleMsg }}
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useErc721 } from '@/composables/contracts/use-erc721'

/** i18n global, damit der Switch aus der Navbar sofort greift */
const { t } = useI18n({ useScope: 'global' })

/** Props aus dem AdminLayout */
defineProps<{ canManage: boolean }>()

/** Contract-Funktionen */
const { hasDeleterRole, grantDeleterRole, revokeDeleterRole } = useErc721()

/** UI-State */
const roleAddr = ref('')
const roleMsg  = ref('')
const isErr    = ref(false)
const isBusy   = ref(false)

/** Utils */
function isAddress (s: string) {
  return /^0x[a-fA-F0-9]{40}$/.test((s || '').trim())
}
function short (addr: string) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : ''
}
function clear () {
  roleAddr.value = ''
  roleMsg.value  = ''
  isErr.value    = false
}

/** Aktionen */
async function checkRole () {
  roleMsg.value = ''; isErr.value = false
  const a = roleAddr.value.trim()
  if (!isAddress(a)) {
    roleMsg.value = t('admin.roles.invalid'); isErr.value = true
    return
  }
  try {
    isBusy.value = true
    const has = await hasDeleterRole(a as `0x${string}`)
    roleMsg.value = has ? t('admin.badges.deleter') : t('admin.badges.noDeleter')
  } catch (e) {
    roleMsg.value = t('admin.roles.error'); isErr.value = true
  } finally {
    isBusy.value = false
  }
}

async function grantRole () {
  roleMsg.value = ''; isErr.value = false
  const a = roleAddr.value.trim()
  if (!isAddress(a)) { roleMsg.value = t('admin.roles.invalid'); isErr.value = true; return }
  try {
    isBusy.value = true
    await grantDeleterRole(a as `0x${string}`)
    roleMsg.value = t('admin.roles.granted', { addr: short(a) })
  } catch (e) {
    roleMsg.value = t('admin.roles.error'); isErr.value = true
  } finally {
    isBusy.value = false
  }
}

async function revokeRole () {
  roleMsg.value = ''; isErr.value = false
  const a = roleAddr.value.trim()
  if (!isAddress(a)) { roleMsg.value = t('admin.roles.invalid'); isErr.value = true; return }
  try {
    isBusy.value = true
    await revokeDeleterRole(a as `0x${string}`)
    roleMsg.value = t('admin.roles.revoked', { addr: short(a) })
  } catch (e) {
    roleMsg.value = t('admin.roles.error'); isErr.value = true
  } finally {
    isBusy.value = false
  }
}
</script>

<style scoped>
.box{border:1px solid #eee;border-radius:12px;background:#fff;padding:14px}
.help{font-size:.95rem;color:#555;margin-top:8px}
.help--error{color:#b00020}
.roles-line{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;margin-top:8px}
.roles-line input{padding:10px 12px;border:1px solid #e5e5e5;border-radius:10px;min-width:260px}
.roles-actions{display:flex;gap:8px;flex-wrap:wrap}
.btn{padding:6px 10px;border:1px solid #e5e5e5;border-radius:10px;background:#fff;font-weight:700;cursor:pointer}
.btn--ghost{background:#fafafa}
</style>
