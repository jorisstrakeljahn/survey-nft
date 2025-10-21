<template>
  <div :class="['app-navbar', { 'app-navbar--menu-open': isMenuOpen }]">
    <!-- Logo -->
    <app-logo class="app-navbar__logo" v-if="!isMenuOpen" />

    <div class="spacer" />

    <!-- Desktop-Navigation -->
    <nav class="navigation" v-if="!isMenuOpen">
      <ul>
        <li>
          <router-link :to="{ name: ROUTE_NAMES.vppNFTs }">
            {{ t('header.vpp-nfts') }}
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: ROUTE_NAMES.admin }">
            {{ t('header.admin') }}
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Desktop: Language Dropdown -->
    <div class="lang" v-if="!isMenuOpen" ref="langRef">
      <button class="lang__btn" @click="toggleLang">
        <span class="lang__label">{{ currentLangLabel }}</span>
        <svg class="lang__chev" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      <div v-if="isLangOpen" class="lang__menu">
        <button
          v-for="l in languages"
          :key="l.code"
          class="lang__item"
          :class="{ 'is-active': locale === l.code }"
          @click="setLang(l.code)"
        >
          {{ l.label }}
        </button>
      </div>
    </div>

    <!-- Burger -->
    <img
      :src="isMenuOpen ? CloseMenuIcon : OpenMenuIcon"
      alt="Menu Icon"
      class="menu-icon"
      @click="toggleMenu"
    />
  </div>

  <!-- Mobile Off-Canvas -->
  <div class="mobile-menu" v-if="isMenuOpen">
    <nav class="mobile-navigation">
      <ul>
        <li>
          <router-link :to="{ name: ROUTE_NAMES.home }" @click="toggleMenu">
            {{ t('header.start') }}
          </router-link>
        </li>

        <li class="highlight-item">
          <div class="menu-item-with-button">
            <router-link
              :to="{ name: ROUTE_NAMES.vppNFTs }"
              class="menu-link"
              @click="toggleMenu"
            >
              {{ t('header.vpp-nfts') }}
            </router-link>
          </div>
        </li>

        <li class="highlight-item">
          <div class="menu-item-with-button">
            <router-link
              :to="{ name: ROUTE_NAMES.admin }"
              class="menu-link"
              @click="toggleMenu"
            >
              {{ t('header.admin') }}
            </router-link>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { AppLogo } from '@/common'
import { ROUTE_NAMES } from '@/enums'
import { useI18n } from 'vue-i18n'
import OpenMenuIcon from '@/assets/header-open-menu-icon.svg'
import CloseMenuIcon from '@/assets/header-close-icon.svg'

const isMenuOpen = ref(false)
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

/** GLOBALER Composer (nicht lokal!) */
const { t, locale } = useI18n({ useScope: 'global' })

const languages = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
] as const

const isLangOpen = ref(false)
const langRef = ref<HTMLElement | null>(null)
function toggleLang() {
  isLangOpen.value = !isLangOpen.value
}

const LS_KEY = 'app_lang'
function setLang(code: 'de' | 'en') {
  locale.value = code
  localStorage.setItem(LS_KEY, code)
  isLangOpen.value = false
}
function setLangFromMobile(code: 'de' | 'en') {
  setLang(code)
  toggleMenu()
}

const currentLangLabel = computed(() => {
  const current = languages.find(l => l.code === locale.value)
  return current ? current.label : 'DE'
})

function onClickOutside(e: MouseEvent) {
  if (!isLangOpen.value) return
  const el = langRef.value
  if (el && !el.contains(e.target as Node)) isLangOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  const saved = localStorage.getItem(LS_KEY)
  if (saved === 'de' || saved === 'en') locale.value = saved
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<style lang="scss" scoped>
.app-navbar {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: toRem(10);
  padding: toRem(32) var(--app-padding-right) toRem(24) var(--app-padding-left);
  background: var(--background-primary-light);
  border-bottom: var(--border-primary-main);
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1001;
}

.app-navbar--menu-open {
  background-color: #090909;
}

.app-navbar__logo {
  width: toRem(60);
}

.spacer {
  flex: 1;
  height: 44.41px;
}

.navigation ul {
  list-style: none;
  display: flex;
  gap: 1.25rem;
  margin: 0;
  padding: 0;
}
.navigation a {
  position: relative;
  text-decoration: none;
  color: #000;
  font-weight: 700;
  font-size: 1.1rem;
  display: block;
  padding: toRem(10) toRem(8);
  border-radius: 8px;
}
.navigation a::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #000;
  transition: all 0.35s ease;
}
.navigation a:hover::before,
.navigation .router-link-active::before {
  left: 0;
  width: 100%;
}

.menu-icon {
  width: toRem(24);
  height: toRem(24);
  cursor: pointer;
  display: none;
}

/* Language Dropdown (Desktop) */
.lang {
  position: relative;
  margin-left: 0.5rem;
}
.lang__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}
.lang__label {
  line-height: 1;
}
.lang__chev {
  width: 18px;
  height: 18px;
  fill: #333;
}
.lang__menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  background: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  min-width: 120px;
  padding: 0.25rem;
  z-index: 1002;
}
.lang__item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
}
.lang__item:hover {
  background: #f6f6f6;
}
.lang__item.is-active {
  font-weight: 700;
}

/* Mobile */
@media (max-width: 867px) {
  .app-navbar__logo {
    width: toRem(40);
  }
  .navigation {
    display: none;
  }
  .menu-icon {
    display: block;
  }
}

.mobile-menu {
  position: fixed;
  inset: 0;
  background-color: #090909;
  z-index: 1000;
  overflow-y: auto;
}

.mobile-navigation {
  margin-top: toRem(110);
}
.mobile-navigation ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.mobile-navigation li {
  margin: toRem(20) 0;
  text-align: left;
  padding: 0 toRem(24);
}
.mobile-navigation a {
  text-decoration: none;
  color: #ffffff;
  font-size: toRem(20);
  font-weight: bold;
}
</style>
