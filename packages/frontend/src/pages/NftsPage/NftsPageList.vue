<template>
  <div class="nfts-page-list">
    <nfts-page-item
      v-for="(nft, index) of props.nfts"
      :key="index"
      :link="nft.link"
      :title="nft.title"
    />
  </div>
</template>

<script lang="ts" setup>
import NftsPageItem from '@/pages/NftsPage/NftsPageItem.vue'
import { NftItem } from '@/types'

const props = defineProps<{
  nfts: NftItem[]
}>()
</script>

<style lang="scss" scoped>
.nfts-page-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 350px));
  gap: toRem(20);
  justify-content: left;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 var(--app-padding-right) 0 var(--app-padding-left);
}
</style>
