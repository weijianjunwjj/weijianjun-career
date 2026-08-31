<script setup lang="ts">
import { ref } from 'vue'
import { navigation } from '../data/links'
import { profile } from '../data/profile'
import AppIcon from './AppIcon.vue'
const open = ref(false)
</script>
<template>
  <header class="site-header" @keydown.esc="open = false">
    <nav class="container nav" aria-label="主导航">
      <a class="brand" href="#top" @click="open = false"
        ><span class="brand-mark">W<span>.</span></span
        ><span
          >{{ profile.name }}<small>{{ profile.brand }}</small></span
        ></a
      >
      <div class="desktop-nav">
        <a v-for="item in navigation" :key="item.href" :href="item.href">{{ item.label }}</a>
      </div>
      <a class="nav-contact" href="#contact">进一步了解 <AppIcon name="external" :size="17" /></a>
      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        :aria-label="open ? '关闭导航' : '打开导航'"
        @click="open = !open"
      >
        <span></span><span></span>
      </button>
    </nav>
    <nav v-if="open" id="mobile-nav" class="mobile-nav" aria-label="移动导航">
      <a
        v-for="item in [...navigation, { label: '进一步了解', href: '#contact' }]"
        :key="item.href"
        :href="item.href"
        @click="open = false"
        >{{ item.label }} <AppIcon name="arrow" :size="16"
      /></a>
    </nav>
  </header>
</template>
