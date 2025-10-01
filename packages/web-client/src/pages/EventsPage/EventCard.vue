<template>
  <router-link :to="{ name: routeName }" class="event-card__link">
    <div class="event-card">
      <span class="event-card__date">{{ date }}</span>
      <div class="event-card__header">
        <h3 class="event-card__title">
          {{ title }}
        </h3>
      </div>
      <div
        class="event-card__image"
        :style="{ backgroundImage: `url(${imageSrc})` }"
      ></div>
      <p class="event-card__description">
        {{ description }}
      </p>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'event-card',
  components: {
    RouterLink,
  },
  props: {
    imageSrc: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    routeName: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.event-card__link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.event-card {
  margin-top: 2rem;
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
  max-width: 400px;
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 1rem;
  box-shadow: #9e9e9e 0 2px 4px 0;
  transition: transform 0.3s;
  position: relative;
}

.event-card:hover {
  transform: scale(1.02);
}

.event-card__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.5rem 0;
}

.event-card__title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
}

.event-card__date {
  position: absolute;
  top: 8px;
  right: 10px;
  font-size: 0.7rem;
  color: #666;
  margin: 0;
}

.event-card__image {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.event-card__description {
  font-size: 1rem;
  color: #333;
}
</style>
