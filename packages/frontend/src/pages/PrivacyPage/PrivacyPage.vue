<template>
  <div class="under-construction-page">
    <img
      :src="WorkInProgressImage"
      alt="Work in Progress"
      class="under-construction-image"
    />
    <h1 class="under-construction-title">
      {{ t('underConstruction.title') }}
    </h1>
    <p class="under-construction-text">
      {{ t('underConstruction.message') }}
    </p>
    <img :src="EventImage" alt="Event 1" class="under-construction-image" />
    <img :src="NftEins" alt="NFT 1" class="under-construction-image" />
    <img :src="NftZwei" alt="NFT 2" class="under-construction-image" />
    <img :src="NftDrei" alt="NFT 3" class="under-construction-image" />
  </div>
  <app-footer />
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n'
import WorkInProgressImage from '@/assets/work-in-progress-image.svg'
import EventImage from '@/assets/1-binex-nft-event-blockchain-trifft-finance.jpg'
import NftEins from '../../../../../survey-nft/packages/frontend/src/assets/VPP - NFT 1.jpg'
import NftZwei from '../../../../../survey-nft/packages/frontend/src/assets/VPP - NFT 2.jpg'
import NftDrei from '../../../../../survey-nft/packages/frontend/src/assets/VPP - NFT 3.jpg'
import AppFooter from '@/common/AppFooter.vue'

export default {
  name: 'under-construction-page',
  components: {
    AppFooter,
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      WorkInProgressImage,
      EventImage,
      NftEins,
      NftZwei,
      NftDrei,
    }
  },
}
</script>

<style lang="scss" scoped>
.under-construction-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  text-align: center;
}

.under-construction-image {
  max-width: 100%;
  height: auto;
  width: 300px;
  margin-bottom: 2rem;
}

.under-construction-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.under-construction-text {
  font-size: 1.2rem;
  max-width: 800px;
}
</style>
