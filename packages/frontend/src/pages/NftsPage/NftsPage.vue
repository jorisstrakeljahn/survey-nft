<template>
  <div class="nfts-page">
    <nfts-page-actions
      :owner="contractOwner"
      @save="loadNftData"
      @filter="filterNftList"
    />

    <!-- Neuer Abschnitt für "NFT claimen" -->
    <div class="nfts-page-claim">
      <div class="nfts-page-claim__content">
        <span class="nfts-page-claim__title">
          {{ $t('nfts-page.title') }}
        </span>
        <app-button
          class="nfts-page-claim__button"
          :text="'NFT für Veranstaltung claimen'"
          @click="openClaimModal"
        />
      </div>
    </div>

    <!-- Popup für NFT claim -->
    <teleport-modal
      :is-shown="isClaimModalOpen"
      @click-outside="closeClaimModal"
    >
      <div class="nfts-page-claim-modal__form">
        <h4 class="nfts-page-claim-modal__title">
          {{ $t('nfts-page-claim-modal.claim-title') }}
        </h4>

        <div class="nfts-page-claim-modal__inputs">
          <div class="nfts-page-claim-modal__input-wrapper">
            <span class="nfts-page-claim-modal__input-title">
              {{ $t('nfts-page-claim-modal.code-title') }}
            </span>
            <input-field
              v-model="claimCode"
              class="nfts-page-claim-modal__input"
              :placeholder="$t('nfts-page-claim-modal.code-placeholder')"
              :error-message="claimCodeError"
            />
          </div>
        </div>

        <div class="nfts-page-claim-modal__actions">
          <app-button
            :text="'NFT erhalten'"
            :disabled="isClaiming"
            @click="claimNft"
          />
        </div>

        <loader v-if="isClaiming" class="nfts-page-claim-modal__loader" />
      </div>
    </teleport-modal>

    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          class="app__page-error-message"
          :message="$t('nfts-page.loading-error-msg')"
        />
      </template>
      <template v-else-if="filteredNftList?.length">
        <nfts-page-list :nfts="filteredNftList" />
      </template>
      <template v-else>
        <no-data-message
          class="app__page-no-data-message"
          :message="$t('nfts-page.no-data-msg')"
          :icon-name="$icons.noData"
        />
      </template>
    </template>
    <template v-else>
      <loader class="app__page-loader" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import NftsPageList from '@/pages/NftsPage/NftsPageList.vue'
import NftsPageActions from '@/pages/NftsPage/NftsPageActions.vue'
import {
  NoDataMessage,
  Loader,
  ErrorMessage,
  TeleportModal,
  AppButton,
} from '@/common'

import { useErc721Store } from '@/store'
import { ErrorHandler } from '@/helpers'
import { ref, computed } from 'vue'
import { NftItem } from '@/types'
import { utils } from 'ethers'
import { useWeb3ProvidersStore } from '@/store'
import { InputField } from '@/fields'

const { erc721 } = useErc721Store()
const { provider } = useWeb3ProvidersStore()

const nftList = ref<NftItem[]>([])
const search = ref('')
const contractOwner = ref('')
const isLoaded = ref(false)
const isLoadFailed = ref(false)
const isClaimModalOpen = ref(false)
const claimCode = ref('')
const isClaiming = ref(false)
const publicKey = ref('')
const claimCodeError = ref('')

const getPublicKey = async () => {
  publicKey.value = provider.selectedAddress || ''
}

const filteredNftList = computed(() => {
  return search.value
    ? utils.isAddress(search.value)
      ? nftList.value.filter(item => item.owner === search.value)
      : []
    : nftList.value.filter(item => item.owner === provider.selectedAddress)
})

const loadNftData = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    contractOwner.value = (await erc721.getOwner()) || ''
    const totalSupply = await erc721.getTotalSupply()
    const nftListId = await Promise.all(
      new Array(totalSupply?.toNumber()).fill(null).map(async (_, index) => {
        const nft = await erc721.getTokenByIndex(index)
        return nft?.toString() || ''
      }),
    )
    const tokenOwners = await Promise.all(
      nftListId.map(async id => {
        return erc721.getOwnerOfNft(id)
      }),
    )
    const tokensURIs = await erc721.getTokensURIs(nftListId)
    nftList.value = tokensURIs.map((item, index) => ({
      link: item,
      title: nftListId[index],
      owner: tokenOwners[index],
    }))
  } catch (error) {
    ErrorHandler.process(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}

const filterNftList = async (address: string) => {
  search.value = address
  await loadNftData()
}

const openClaimModal = () => {
  isClaimModalOpen.value = true
}

const closeClaimModal = () => {
  if (!isClaiming.value) isClaimModalOpen.value = false
}

const claimNft = async () => {
  if (!claimCode.value) {
    claimCodeError.value = 'Bitte gib einen gültigen Code ein.'
    return
  }

  claimCodeError.value = ''
  isClaiming.value = true

  try {
    await getPublicKey()

    if (!publicKey.value) {
      alert('Fehler: Der Public Key konnte nicht abgerufen werden.')
      isClaiming.value = false
      return
    }

    const queryParams = new URLSearchParams({
      publicKey: publicKey.value,
      surveyId: claimCode.value,
      participantPoints: '1',
    })

    const response = await fetch(
      `https://binex-backend-321237844397.europe-west3.run.app/api/mint-nft?${queryParams.toString()}`,
      {
        method: 'POST',
      },
    )

    if (response.ok) {
      alert('NFT erfolgreich gesichert!')
      closeClaimModal() // Popup schließen
      await loadNftData() // NFT-Liste neu laden
    } else {
      const errorMessage = await response.text()
      console.error('Server-Antwort:', errorMessage)
      alert(`Fehler beim Minten des NFTs: ${errorMessage}`)
    }
  } catch (error) {
    console.error('Fehler beim Claim:', error)
    alert('Ein unerwarteter Fehler ist aufgetreten.')
  }
  isClaiming.value = false
}

loadNftData()
</script>

<style lang="scss" scoped>
.nfts-page {
  display: flex;
  flex-direction: column;
  gap: toRem(30);
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
}

.nfts-page-claim {
  display: flex;
  justify-content: center;
  margin: toRem(20) 0;
}

.nfts-page-claim__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1400px;
  gap: toRem(20);
  padding: 0 var(--app-padding-right) 0 var(--app-padding-left);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.nfts-page-claim__title {
  font-size: toRem(32);
  font-weight: bold;
  color: var(--text-primary-main);
  flex: 1;

  @media (max-width: 768px) {
    margin-bottom: toRem(10);
    text-align: center;
  }
}

.nfts-page-claim__button {
  @media (max-width: 768px) {
    width: 100%;
  }
}

.nfts-page-claim-modal__form {
  padding: toRem(32) toRem(130);
  border-radius: toRem(15);
  box-shadow: var(--shadow-primary);
  background: var(--app-bg-tertiary);
  max-width: 350px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nfts-page-claim-modal__title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: toRem(24);
  font-size: toRem(40);
  font-weight: 500;
}

.nfts-page-claim-modal__input-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
  margin-bottom: toRem(24);
}

.nfts-page-claim-modal__actions {
  display: flex;
  justify-content: center;
}

.nfts-page-claim-modal__loader {
  margin-top: toRem(20);
}
</style>
