<template>
  <div :class="['app-navbar', { 'app-navbar--menu-open': isMenuOpen }]">
    <app-logo class="app-navbar__logo" v-if="!isMenuOpen" />
    <div class="spacer" />

    <nav class="navigation" v-if="!isMenuOpen">
      <ul>
        <li>
          <router-link :to="{ name: ROUTE_NAMES.blockchainBasics }">
            {{ t('header.blockchain-basics') }}
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: ROUTE_NAMES.binex }">
            {{ t('header.binex') }}
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: ROUTE_NAMES.vpp }">
            {{ t('header.vpp-documentation') }}
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: ROUTE_NAMES.events }">
            {{ t('header.events') }}
          </router-link>
        </li>
      </ul>
    </nav>

    <img
      :src="isMenuOpen ? CloseMenuIcon : OpenMenuIcon"
      alt="Menu Icon"
      class="menu-icon"
      @click="toggleMenu"
    />
  </div>

  <div class="mobile-menu" v-if="isMenuOpen">
    <nav class="mobile-navigation">
      <ul>
        <li>
          <router-link :to="{ name: ROUTE_NAMES.home }" @click="toggleMenu">
            {{ t('header.start') }}
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: ROUTE_NAMES.blockchainBasics }"
            @click="toggleMenu"
          >
            {{ t('header.blockchain-basics') }}
          </router-link>
        </li>

        <li class="highlight-item">
          <div class="menu-item-with-button">
            <router-link
              :to="{ name: ROUTE_NAMES.binex }"
              class="menu-link"
              @click="toggleMenu"
            >
              {{ t('header.binex') }}
            </router-link>
            <button
              class="instruction-button"
              @click="navigateToRoute(ROUTE_NAMES.binexMetaMask)"
            >
              {{ t('header.guide') }}
            </button>
          </div>
        </li>

        <li class="highlight-item">
          <div class="menu-item-with-button">
            <router-link
              :to="{ name: ROUTE_NAMES.vpp }"
              class="menu-link"
              @click="toggleMenu"
            >
              {{ t('header.vpp-documentation') }}
            </router-link>
            <button
              class="instruction-button"
              @click="navigateToSection(ROUTE_NAMES.vpp, 'guide-section-vpp')"
            >
              {{ t('header.guide') }}
            </button>
          </div>
        </li>
        <li>
          <router-link :to="{ name: ROUTE_NAMES.events }" @click="toggleMenu">
            {{ t('header.events') }}
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppLogo } from '@/common'
import { ROUTE_NAMES } from '@/enums'
import { useI18n } from 'vue-i18n'
import OpenMenuIcon from '@/assets/header-open-menu-icon.svg'
import CloseMenuIcon from '@/assets/header-close-icon.svg'
import { router } from '@/router'

const isMenuOpen = ref(false)
const { t } = useI18n()

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function navigateToSection(routeName: string, sectionId: string) {
  toggleMenu()
  router.push({ name: routeName, hash: `#${sectionId}` })
}

function navigateToRoute(routeName: string) {
  toggleMenu()
  router.push({ name: routeName })
}
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
  gap: 1.5rem;
}

.navigation a {
  position: relative;
  text-decoration: none;
  color: #000;
  font-weight: bold;
  font-size: 1.5rem;
  display: block;
  padding: toRem(12) toRem(10);
  border-radius: 0;
  transition: font-size 0.3s ease;
}

.navigation a::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: black;
  transition: all 0.5s ease;
}

.navigation a:hover::before,
.navigation .router-link-active::before {
  left: 0;
  width: 100%;
}

.navigation .router-link-active {
  position: relative;
}

.navigation .router-link-active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: black;
  opacity: 0.8;
  border-radius: 2px;
}

.mobile-navigation .highlight-item a {
  background-color: var(--app-bg);
  color: #000000;
  border-radius: toRem(15);
  padding: toRem(12) toRem(10);
  font-size: toRem(20);
}

.menu-item-with-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: toRem(6) toRem(10);
  border-radius: toRem(15);
}

.menu-item-with-button .menu-link {
  color: #000000;
  background-color: #ffffff;
  border-radius: toRem(15);
  padding: toRem(12) toRem(16);
  text-decoration: none;
  font-size: toRem(24);
  font-weight: bold;
  flex: 1;
}

.instruction-button {
  border: 1px solid #000000;
  border-radius: toRem(10);
  background: transparent;
  color: #000000;
  padding: toRem(2) toRem(16);
  font-size: toRem(16);
  cursor: pointer;
  margin-left: toRem(8);
}

.mobile-navigation .highlight-item {
  background-color: #ffffff;
  border-radius: toRem(15);
  margin-left: toRem(24);
  margin-right: toRem(24);
  padding: 0;
}

.mobile-navigation .highlight-item a.menu-link {
  background: none;
  padding: 0;
  border-radius: 0;
}

.menu-icon {
  width: toRem(24);
  height: toRem(24);
  cursor: pointer;
  display: none;
}

@media (max-width: 900px) {
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #090909;
  z-index: 1000;
  overflow-y: auto;
}

.mobile-navigation {
  margin-top: toRem(120);
}

.mobile-navigation ul {
  list-style: none;
  padding: 0;
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
