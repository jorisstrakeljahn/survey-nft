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

      <app-button
        v-if="!isMetamaskExtension() && !provider.isConnected"
        target="_blank"
        :icon-left="$icons.metamask"
        :href="METAMASK_DOWNLOAD_LINK"
        :text="$t('connect-page.install-metamask-btn')"
      />
      <app-button
        v-else-if="!provider.isConnected"
        :text="$t('connect-page.connect-btn')"
        :icon-left="$icons.metamask"
        @click="connect"
      />
      <app-button
        v-else
        :icon-left="$icons.metamask"
        :text="$t('connect-page.switch-network-btn')"
        @click="
          provider.switchNetwork(config.SUPPORTED_CHAIN_ID, DEFAULT_CHAIN)
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ethers } from 'ethers'
import { config } from '@/config'
import {
  getCurrentChainIdHex,
  getExpectedChainIdDec,
  toHex,
  isOnSupportedChain,
  chainLabelFromId,
} from '@/utils/chain.util'

type Eip1193 = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

const eth = (window as unknown as { ethereum?: Eip1193 }).ethereum
const currentHex = ref<string>('unbekannt')
const expectedDec = getExpectedChainIdDec()
const expectedHex = toHex(expectedDec)

const expectedLabel = computed(() => chainLabelFromId(expectedDec))

function isMetamaskExtension(){ return !!(window as any).ethereum?.isMetaMask }

async function getProvider() {
  if (!eth) throw new Error('MetaMask nicht gefunden')
  return new ethers.providers.Web3Provider(eth as unknown as any, 'any')
}

async function readChain() {
  try {
    const provider = await getProvider()
    currentHex.value = await getCurrentChainIdHex(provider)
  } catch (e) {
    console.error(e)
  }
}

async function switchChain() {
  if (!eth) return
  try {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: expectedHex }],
    })
    await readChain()
  } catch (e: any) {
    if (e?.code === 4902) {
      await addExpectedChain()
    } else {
      console.error(e)
    }
  }
}

async function addExpectedChain() {
  if (!eth) return
  // hier Polygon Mainnet; passe bei Bedarf für Mumbai an
  await eth.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: expectedHex,
        chainName: expectedLabel.value,
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com/'],
      },
    ],
  })
  await readChain()
}

async function connectAndFix() {
  const provider = await getProvider()
  await provider.send('eth_requestAccounts', [])
  const ok = await isOnSupportedChain(provider)
  if (!ok) await switchChain()
  await readChain()
}

onMounted(readChain)
</script>

<style lang="scss" scoped>
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

  @media (max-width: 768px) {
    font-size: toRem(36);
  }
}

.connect-page__subtitle {
  font-size: toRem(16);
  font-weight: 400;
  color: var(--text-secondary-main);
  max-width: toRem(700);
  text-align: center;

  @media (max-width: 768px) {
    font-size: toRem(14);
    max-width: toRem(500);
  }

  @media (max-width: 480px) {
    font-size: toRem(12);
    max-width: toRem(300);
  }
}

.connect-page__info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(24);
  background: var(--white);
  padding: toRem(32);
  box-shadow: 0 toRem(4) toRem(40) var(--shadow-primary);
  border-radius: toRem(16);
  min-width: toRem(600);

  @media (max-width: 768px) {
    min-width: 90%;
    padding: toRem(24);
  }

  @media (max-width: 480px) {
    min-width: 100%;
    padding: toRem(16);
  }
}

.connect-page__info-title {
  font-weight: 500;
  font-size: toRem(40);
  text-align: center;

  @media (max-width: 768px) {
    font-size: toRem(28);
  }
}

.connect-page__info-subtitle {
  color: var(--text-secondary-main);
  font-size: toRem(16);

  @media (max-width: 768px) {
    font-size: toRem(14);
  }

  @media (max-width: 480px) {
    font-size: toRem(12);
  }
}

.app-button {
  width: auto;

  @media (max-width: 768px) {
    width: 100%;
    max-width: toRem(300);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
}
</style>
