<script setup lang="ts">
import { profile } from '../data/profile'
import { links } from '../data/links'

const commitSha = __COMMIT_SHA__
// Drill: a number cannot hold a string, so the typecheck must fail.
const launchYear: number = '2026'
const commitUrl = /^[0-9a-f]{40}$/.test(commitSha)
  ? `${links.github}/weijianjun-career/commit/${commitSha}`
  : undefined
</script>
<template>
  <footer class="site-footer container">
    <p>© {{ new Date().getFullYear() }} {{ profile.name }}<span>不止于前端，持续构建。{{ launchYear }}</span></p>
    <div>
      <a :href="links.github" target="_blank" rel="noopener noreferrer">GitHub ↗</a
      ><a :href="links.articles" target="_blank" rel="noopener noreferrer">掘金 ↗</a
      ><a href="#top">回到顶部 ↑</a
      ><a
        v-if="commitUrl"
        :href="commitUrl"
        target="_blank"
        rel="noopener noreferrer"
        title="当前线上版本对应的提交"
        >build {{ commitSha.slice(0, 7) }}</a
      >
    </div>
  </footer>
</template>
