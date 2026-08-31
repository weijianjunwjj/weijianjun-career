<script setup lang="ts">
import { profile } from '../data/profile'
import { links } from '../data/links'
</script>
<template>
  <footer class="site-footer container">
    <p>© {{ new Date().getFullYear() }} {{ profile.name }}<span>不止于前端，持续构建。</span></p>
    <div>
      <a :href="links.github" target="_blank" rel="noopener noreferrer">GitHub ↗</a
      ><a :href="links.articles" target="_blank" rel="noopener noreferrer">掘金 ↗</a
      ><a href="#top">回到顶部 ↑</a>
    </div>
  </footer>
</template>
