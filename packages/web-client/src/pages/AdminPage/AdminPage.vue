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
  </div>
  <app-footer />
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n'
import WorkInProgressImage from '@/assets/work-in-progress-image.svg'
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
