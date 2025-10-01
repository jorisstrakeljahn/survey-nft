<template>
  <div class="accordion-item">
    <div class="accordion-item__header" @click="toggle">
      <span class="accordion-item__title">{{ title }}</span>
      <span class="accordion-item__icon">
        {{ isOpen ? t('accordion-item.open') : t('accordion-item.close') }}
      </span>
    </div>
    <div v-if="isOpen" class="accordion-item__content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'accordion-item',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const isOpen = ref(false)

    const toggle = () => {
      isOpen.value = !isOpen.value
    }

    const { t } = useI18n()

    return {
      isOpen,
      toggle,
      t,
    }
  },
})
</script>

<style scoped>
.accordion-item {
  border-bottom: 1px solid #ccc;
  max-width: 1200px;
  width: 100%;
}

.accordion-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 1.2rem 0 1rem;
}

.accordion-item__title {
  font-size: 1.4rem;
  font-weight: 500;
  color: #000000;
}

.accordion-item__icon {
  font-size: 1.5rem;
}

.accordion-item__content {
  padding: 0.5rem 0;
  font-size: 1.2rem;
  line-height: 1.5;
}

a {
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .accordion-item__icon {
    font-size: 1.2rem;
  }

  .accordion-item__title {
    font-size: 1.1rem;
  }

  .accordion-item__content {
    font-size: 1rem;
  }

  a {
    font-size: 1rem;
  }
}
</style>
