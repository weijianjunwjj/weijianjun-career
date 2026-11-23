<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { links } from '../data/links.ts'
import { profile } from '../data/profile.ts'

const buildCommit = __COMMIT_SHA__
const shortCommit = buildCommit.length > 10 ? buildCommit.slice(0, 7) : buildCommit
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <span class="footer-name">{{ profile.name }} · {{ profile.positioning }}</span>
        <span class="mono footer-meta" :data-build-sha="buildCommit">
          weijianjun.me · build {{ shortCommit }}
        </span>
      </div>

      <div class="footer-links">
        <a :href="links.work" class="footer-link footer-link-highlight">
          <span>工程项目体验中心 (work.weijianjun.me)</span>
          <AppIcon name="arrow-up-right" :size="13" />
        </a>
        <a :href="links.github" target="_blank" rel="noopener noreferrer" class="footer-link">
          GitHub
        </a>
        <a :href="links.articles" target="_blank" rel="noopener noreferrer" class="footer-link">
          掘金专栏
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--line-subtle);
  background: rgba(3, 6, 15, 0.9);
  padding-block: 24px;
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.footer-brand {
  display: grid;
  gap: 3px;
}

.footer-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-primary);
}

.footer-meta {
  font-size: 12px;
  color: var(--ink-muted);
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--ink-secondary);
}

.footer-link:hover {
  color: var(--ink-primary);
}

.footer-link-highlight {
  color: var(--cyan);
  font-weight: 500;
}
</style>
