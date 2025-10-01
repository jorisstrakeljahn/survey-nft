<template>
  <div class="nfts-page-actions">
    <!-- App Logo -->
    <router-link to="/" class="nfts-page-actions__logo-link">
      <app-logo class="nfts-page-actions__logo" />
    </router-link>

    <div class="nfts-page-actions__controls">
      <div class="nfts-page-actions__search">
        <input-field
          v-model="searchedAddress"
          class="nfts-page-actions__search-input"
          :icon-left="$icons.search"
          :placeholder="$t('nfts-page-actions.search-placeholder')"
          @input="onSearchInput"
        />
      </div>

      <app-button
        v-if="provider.selectedAddress === props.owner"
        class="nfts-page-actions__mint-button"
        :text="$t('nfts-page-actions.mint-btn')"
        @click="toggleMintModal"
      />

      <nfts-page-mint-modal
        v-if="isMintModalOpened"
        @close="toggleMintModal"
        @save="reloadNftList"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { InputField } from '@/fields'
import { ref } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import NftsPageMintModal from '@/pages/NftsPage/NftsPageMintModal.vue'
import AppLogo from '@/common/AppLogo.vue'
import { debounce } from 'lodash'

const emit = defineEmits<{
  (e: 'save'): void
  (e: 'filter', payload: string): void
}>()

const props = defineProps<{
  owner?: string
}>()

const { provider } = useWeb3ProvidersStore()
const isMintModalOpened = ref(false)
const searchedAddress = ref('')

// Debounce-Funktion: Sucht erst nach 500ms Inaktivität
const debouncedFilter = debounce((value: string) => {
  emit('filter', value)
}, 500)

const onSearchInput = () => {
  if (searchedAddress.value.length >= 5) {
    debouncedFilter(searchedAddress.value)
  } else {
    emit('filter', '')
  }
}

const toggleMintModal = () => {
  isMintModalOpened.value = !isMintModalOpened.value
}

const reloadNftList = () => {
  emit('save')
  isMintModalOpened.value = false
}
</script>

<style lang="scss" scoped>
.nfts-page-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  gap: toRem(10);
  padding: toRem(24) 0 toRem(24) 0;
}

.nfts-page-actions__logo-link {
  display: flex;
  align-items: center;
}

.nfts-page-actions__logo {
  width: toRem(60);
  height: auto;
  margin-left: var(--app-padding-right);
}

.spacer {
  flex: 0;
  height: 44.41px;

  @media (max-width: 870px) {
    display: none;
  }
}

.nfts-page-actions__controls {
  display: flex;
  align-items: center;
  gap: toRem(10);
  padding: 0 var(--app-padding-right) 0 var(--app-padding-left);

  @media (max-width: 870px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
}

.nfts-page-actions__search {
  display: flex;
  gap: toRem(12);
  flex-wrap: wrap;
  flex: 1;

  width: 100%;
}

.nfts-page-actions__search-input {
  min-width: toRem(350);

  @media (max-width: 870px) {
    min-width: 100%;
  }
}

.nfts-page-actions__mint-button {
  min-width: toRem(150);

  @media (max-width: 870px) {
    min-width: 100%;
  }
}

@media (max-width: 870px) {
  .nfts-page-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .nfts-page-actions__logo-link {
    display: flex;
    align-items: center;
  }

  .nfts-page-actions__controls {
    flex-direction: column;
    align-items: stretch;
    width: 100vw;
    max-width: 400px;
  }
}
</style>
