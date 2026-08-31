<script setup lang="ts">
import { ref } from 'vue'
import { navigation } from '../data/links'
import { profile } from '../data/profile'
import AppIcon from './AppIcon.vue'
import ResumeLink from './ResumeLink.vue'
const open = ref(false)
const menuButton = ref<HTMLButtonElement>()
function closeMenu(restoreFocus = false) {
  open.value = false
  if (restoreFocus) menuButton.value?.focus()
}
</script>
<template>
  <header class="site-header" @keydown.esc="closeMenu(true)">
    <nav class="container nav" aria-label="主导航">
      <a class="brand" href="#top" :aria-label="profile.name + ' · 回到首页'" @click="closeMenu()"
        ><span class="brand-mark" aria-hidden="true">W<span>↗</span></span
        ><span>{{ profile.name }}</span></a
      >
      <div class="desktop-nav">
        <a
          v-for="item in navigation"
          :key="item.href"
          :href="item.href"
          :aria-label="item.accessibleLabel"
          >{{ item.label }}</a
        >
      </div>
      <div class="nav-actions">
        <ResumeLink compact label="简历" /><a class="nav-contact" href="#contact"
          >联系我 <AppIcon name="external" :size="18"
        /></a>
      </div>
      <button
        ref="menuButton"
        class="menu-toggle"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        :aria-label="open ? '关闭导航' : '打开导航'"
        @click="open = !open"
      >
        <span></span><span></span>
      </button>
    </nav>
    <nav v-if="open" id="mobile-nav" aria-label="移动导航">
      <a v-for="item in navigation" :key="item.href" :href="item.href" @click="closeMenu()"
        >{{ item.accessibleLabel }}<AppIcon :size="18" /></a
      ><ResumeLink label="下载完整简历" /><a href="#contact" @click="closeMenu()"
        >联系我 <AppIcon name="external" :size="18"
      /></a>
    </nav>
  </header>
</template>
