<template>
  <router-link :to="{ name: routeName }" class="project-card">
    <img :src="imageSrc" :alt="title" class="project-card__image" />
    <h3 class="project-card__title">
      {{ title }}
    </h3>
    <p class="project-card__description">
      {{ description }}
    </p>
  </router-link>
</template>

<script lang="ts">
export default {
  name: 'project-card',
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
    routeName: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.project-card {
  display: block;
  flex: 1 1 calc(33.333% - 2rem);
  box-sizing: border-box;
  border-radius: 12px;
  box-shadow: #9e9e9e 0 2px 4px 0;
  max-width: 400px;
  margin: 2rem;
  transition: transform 0.2s;

  &__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    padding: 0.5rem;
    border-radius: 20px;
  }

  &__title {
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1.4rem;
  }

  &__description {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 1rem;
    font-size: 0.9rem;
    margin-top: 0.4rem;
    line-height: 1.1rem;
  }

  &:hover {
    transform: scale(1.05);
  }
}

/* Media Queries für kleinere Bildschirme */
@media (max-width: 1024px) {
  .project-card {
    flex: 1 1 calc(50% - 2rem);
    margin-top: 1rem;
  }

  .project-card__title {
    font-size: 1.2rem;
  }

  .project-card__description {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .project-card {
    flex: 1 1 calc(100% - 2rem);
  }
}
</style>
