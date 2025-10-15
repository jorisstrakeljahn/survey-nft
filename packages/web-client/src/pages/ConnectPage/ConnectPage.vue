<template>
  <div class="connect-page">
    <div class="connect-page__title-wrapper">
      <h1 class="connect-page__title">
        {{ $t('connect-page.title') }}
      </h1>
      <h3 class="connect-page__subtitle">
        {{ $t('connect-page.subtitle') }}
      </h3>
    </div>

    <div class="connect-page__info">
      <div class="connect-page__info-title-wrapper">
        <h4 class="connect-page__info-title">
          {{ $t('connect-page.connect-modal-title') }}
        </h4>
        <span class="connect-page__info-subtitle">
          {{ $t('connect-page.connect-modal-subtitle') }}
        </span>
      </div>

      <!-- 1) Kein Provider: Installieren -->
      <app-button
        v-if="!hasProvider"
        target="_blank"
        :icon-left="$icons.metamask"
        :href="METAMASK_DOWNLOAD_LINK"
        :text="$t('connect-page.install-metamask-btn')"
      />

      <!-- 2) Provider da, aber nicht verbunden: Verbinden -->
      <app-button
        v-else-if="!connected"
        :text="$t('connect-page.connect-btn')"
        :icon-left="$icons.metamask"
        :loading="connecting"
        @click="connect"
      />

      <!-- 3) Verbunden, aber falsche Chain: Wechseln -->
      <app-button
        v-else-if="wrongChain"
        :icon-left="$icons.metamask"
        :text="$t('connect-page.switch-network-btn', { network: expectedName })"
        :loading="switching"
        @click="switchChain"
      />

      <!-- 4) Verbunden & richtige Chain: Auto-Redirect + Fallback-Button -->
      <app-button
        v-else
        :icon-left="$icons.metamask"
        :text="$t('connect-page.continue-btn')"
        @click="goNext"
      />

      <div v-if="statusMsg" style="margin-top:8px; color: var(--text-secondary-main)">{{ statusMsg }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ethers } from 'ethers'
import { useI18n } from 'vue-i18n'
import {
  getCurrentChainIdHex,
  getExpectedChainIdDec,
  toHex,
  chainLabelFromId,
} from '@/utils/chain.util'

const { t } = useI18n({ useScope: 'global' })

/** Zielnetz (Polygon Mainnet per util) */
const expectedDec  = getExpectedChainIdDec()               // z.B. 137
const expectedHex  = toHex(expectedDec)                    // '0x89'
const expectedName = chainLabelFromId(expectedDec)         // 'Polygon Mainnet'

/** Fallback-Weiterleitung (Routen-Name) */
const DEFAULT_REDIRECT_NAME = 'NftsPage'

/** MetaMask Download */
const METAMASK_DOWNLOAD_LINK = 'https://metamask.io/download/'

/** Router */
const router = useRouter()
const route  = useRoute()

/** State */
const hasProvider = ref(false)
const account     = ref<string | null>(null)
const chainId     = ref<string | null>(null)
const connecting  = ref(false)
const switching   = ref(false)
const statusMsg   = ref('')

/** Abgeleitete Zustände */
const connected  = computed(() => !!account.value)
const wrongChain = computed(() => connected.value && chainId.value?.toLowerCase() !== expectedHex.toLowerCase())

/** Provider helpers */
function eth(): any { return (window as any).ethereum }
function isMetamaskExtension(){ return !!eth()?.isMetaMask }

/** Warte auf Provider-Injection (v.a. Firefox) */
function waitForEthereum(timeoutMs = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    if (eth()?.request) return resolve(true)
    const start = Date.now()
    const iv = setInterval(() => {
      if (eth()?.request) { clearInterval(iv); resolve(true) }
      else if (Date.now() - start > timeoutMs) { clearInterval(iv); resolve(false) }
    }, 50)
  })
}

/** Ziel aus Query ableiten: redirect|next|admin */
function resolveNext() {
  // akzeptiere redirect oder next
  const raw = String(route.query.redirect ?? route.query.next ?? '').trim()
  if (raw) {
    if (raw.startsWith('/')) return { path: raw }
    return { name: raw }
  }
  if (route.query.admin === '1') return { name: 'AdminWallets' }
  return { name: DEFAULT_REDIRECT_NAME }
}

/** Aktive Weiterleitung */
function goNext() {
  const target = resolveNext()
  router.replace(target).catch(() => {})
}

/** Weiterleiten, sobald ready */
function maybeRedirect() {
  if (connected.value && !wrongChain.value) {
    statusMsg.value = ''
    goNext()
  }
}

/** Sanfte Initialisierung (ohne Popups) */
async function softInit() {
  const ok = await waitForEthereum()
  hasProvider.value = ok
  if (!ok) { statusMsg.value = ''; return }

  try {
    const provider = new ethers.providers.Web3Provider(eth(), 'any')
    const accs: string[] = await eth().request({ method: 'eth_accounts' })
    account.value = Array.isArray(accs) && accs[0] ? String(accs[0]) : null
    chainId.value = await getCurrentChainIdHex(provider)
    maybeRedirect()
  } catch {
    // okay – UI zeigt Connect-CTA
  }

  // Events aktuell halten
  try {
    eth().removeAllListeners?.('accountsChanged')
    eth().removeAllListeners?.('chainChanged')
    eth().removeAllListeners?.('disconnect')
  } catch {}

  eth().on?.('accountsChanged', (accs: string[]) => {
    account.value = accs?.[0] || null
    maybeRedirect()
  })
  eth().on?.('chainChanged', (id: string) => {
    chainId.value = id
    maybeRedirect()
  })
  eth().on?.('disconnect', () => {
    account.value = null
    statusMsg.value = ''
  })
}

/** Chain sicherstellen (user-gesture) */
async function switchChain() {
  const provider = eth()
  if (!provider?.request) return
  switching.value = true
  statusMsg.value = ''
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: expectedHex }],
    })
    chainId.value = expectedHex
    maybeRedirect()
  } catch (e: any) {
    if (e?.code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: expectedHex,
          chainName: expectedName,
          nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
          rpcUrls: ['https://polygon-rpc.com'],
          blockExplorerUrls: ['https://polygonscan.com/'],
        }]
      })
      chainId.value = expectedHex
      maybeRedirect()
    } else if (e?.code === 4001) {
      statusMsg.value = (isMetamaskExtension() ? 'MetaMask: ' : '') + t('connect-page.status.rejected')
    } else {
      statusMsg.value = e?.message || t('connect-page.status.switch-failed')
    }
  } finally {
    switching.value = false
  }
}

/** Verbinden (per Klick) */
async function connect() {
  const provider = eth()
  if (!provider?.request) { hasProvider.value = false; statusMsg.value = ''; return }
  connecting.value = true
  statusMsg.value  = t('connect-page.status.request')
  try {
    await provider.request({ method: 'eth_requestAccounts' })
    await switchChain()

    const accs: string[] = await provider.request({ method: 'eth_accounts' })
    account.value = Array.isArray(accs) && accs[0] ? String(accs[0]) : null

    if (account.value && chainId.value?.toLowerCase() === expectedHex.toLowerCase()) {
      statusMsg.value = ''
      maybeRedirect()
    }
  } catch (e: any) {
    if (e?.code === 4001) {
      statusMsg.value = (isMetamaskExtension() ? 'MetaMask: ' : '') + t('connect-page.status.rejected')
    } else {
      statusMsg.value = e?.message || t('connect-page.status.failed')
    }
  } finally {
    connecting.value = false
  }
}

/** Mount */
onMounted(() => { void softInit() })

/** Wenn Query-Param sich ändert, erneut prüfen */
watch(() => [route.query.redirect, route.query.next, route.query.admin], () => { maybeRedirect() })
watch([connected, wrongChain], () => { maybeRedirect() })
</script>

<style lang="scss" scoped>
/* deine Styles bleiben unverändert */
.connect-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(50);
  width: 100%;
}
.connect-page__info-title-wrapper,
.connect-page__title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(12);
}
.connect-page__title {
  font-size: toRem(48);
  color: var(--text-primary-main);
  text-align: center;
  @media (max-width: 768px) { font-size: toRem(36); }
}
.connect-page__subtitle {
  font-size: toRem(16);
  font-weight: 400;
  color: var(--text-secondary-main);
  max-width: toRem(700);
  text-align: center;
  @media (max-width: 768px) { font-size: toRem(14); max-width: toRem(500); }
  @media (max-width: 480px) { font-size: toRem(12); max-width: toRem(300); }
}
.connect-page__info {
  display: flex; flex-direction: column; align-items: center; gap: toRem(24);
  background: var(--white); padding: toRem(32); box-shadow: 0 toRem(4) toRem(40) var(--shadow-primary);
  border-radius: toRem(16); min-width: toRem(600);
  @media (max-width: 768px) { min-width: 90%; padding: toRem(24); }
  @media (max-width: 480px) { min-width: 100%; padding: toRem(16); }
}
.connect-page__info-title { font-weight: 500; font-size: toRem(40); text-align: center;
  @media (max-width: 768px) { font-size: toRem(28); }
}
.connect-page__info-subtitle { color: var(--text-secondary-main); font-size: toRem(16);
  @media (max-width: 768px) { font-size: toRem(14); }
  @media (max-width: 480px) { font-size: toRem(12); }
}
.app-button { width: auto;
  @media (max-width: 768px) { width: 100%; max-width: toRem(300); }
  @media (max-width: 480px) { width: 100%; }
}
</style>
