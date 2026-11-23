<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import ResumeLink from './ResumeLink.vue'
import { links, navigation } from '../data/links.ts'
import { profile } from '../data/profile.ts'

const menuOpen = ref(false)
const scrolled = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function handleScroll() {
  scrolled.value = window.scrollY > 12
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="site-nav" :class="{ 'is-scrolled': scrolled }" @keydown.esc="closeMenu">
    <div class="container nav-inner">
      <a href="#top" class="brand-lockup" aria-label="返回顶部 · 魏建军个人主页">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="28" height="28">
            <rect width="32" height="32" rx="8" fill="#071124" stroke="#38e8ff" stroke-opacity="0.45" />
            <path
              d="M6.5 10.5l3.5 12.5h3.2L16 15.2 18.8 23H22l3.5-12.5h-3.4l-1.8 7.9-2.7-7.9h-3.1l-2.7 7.9-1.8-7.9H6.5z"
              fill="#f0f5ff"
            />
            <circle cx="24.5" cy="7.5" r="2" fill="#38e8ff" />
          </svg>
        </span>
        <span class="brand-copy">
          <span class="brand-name">{{ profile.name }}</span>
          <span class="brand-role">{{ profile.positioning }}</span>
        </span>
      </a>

      <nav class="nav-links" aria-label="主站页面导航">
        <a
          v-for="item in navigation"
          :key="item.href"
          :href="item.href"
          :aria-label="item.accessibleLabel"
          class="nav-link"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="nav-actions">
        <a :href="links.work" class="btn btn-portal btn-sm nav-work-cta">
          <span>工程项目体验中心</span>
          <AppIcon name="arrow-up-right" :size="14" />
        </a>
        <ResumeLink class="nav-resume-desktop" label="下载简历" variant="ghost" compact />
        <button
          type="button"
          class="nav-menu-btn"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav-drawer"
          aria-label="打开或关闭移动端导航菜单"
          @click="toggleMenu"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="18" />
        </button>
      </div>
    </div>

    <div v-if="menuOpen" id="mobile-nav-drawer" class="mobile-drawer">
      <div class="container drawer-inner">
        <p class="drawer-positioning">{{ profile.positioning }}</p>
        <div class="drawer-links">
          <a
            v-for="item in navigation"
            :key="item.href"
            :href="item.href"
            class="drawer-link"
            @click="closeMenu"
          >
            <span>{{ item.label }}</span>
            <AppIcon name="arrow-right" :size="15" />
          </a>
        </div>
        <div class="drawer-actions">
          <a :href="links.work" class="btn btn-primary" @click="closeMenu">
            <span>进入工程项目体验中心</span>
            <AppIcon name="arrow-up-right" :size="15" />
          </a>
          <ResumeLink label="下载完整简历 (PDF)" variant="ghost" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-nav {
  position: sticky;
  top: 0;
  z-index: 80;
  border-bottom: 1px solid rgba(148, 179, 255, 0.1);
  background: rgba(4, 7, 17, 0.78);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition: background-color 0.25s var(--ease-out), border-color 0.25s var(--ease-out);
}

.site-nav.is-scrolled {
  background: rgba(4, 7, 17, 0.92);
  border-bottom-color: rgba(56, 232, 255, 0.2);
}

.nav-inner {
  min-height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand-lockup {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.brand-mark {
  flex-shrink: 0;
  display: inline-flex;
}

.brand-copy {
  display: grid;
  line-height: 1.2;
  min-width: 0;
}

.brand-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink-primary);
  letter-spacing: -0.01em;
}

.brand-role {
  font-size: 11px;
  color: var(--cyan);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link {
  padding: 7px 12px;
  border-radius: var(--radius-xs);
  font-size: 13.5px;
  font-weight: 500;
  color: var(--ink-secondary);
  transition: color 0.2s var(--ease-out), background-color 0.2s var(--ease-out);
}

.nav-link:hover {
  color: var(--ink-primary);
  background: rgba(148, 179, 255, 0.08);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.nav-menu-btn {
  display: none;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-strong);
  background: rgba(16, 27, 51, 0.78);
  color: var(--ink-primary);
  cursor: pointer;
}

.mobile-drawer {
  border-top: 1px solid var(--line-subtle);
  background: rgba(5, 9, 21, 0.98);
  padding-block: 16px 22px;
}

.drawer-inner {
  display: grid;
  gap: 14px;
}

.drawer-positioning {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--cyan);
}

.drawer-links {
  display: grid;
  gap: 4px;
}

.drawer-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 12px;
  border-radius: var(--radius-sm);
  color: var(--ink-primary);
  font-weight: 500;
  background: rgba(16, 27, 51, 0.5);
  border: 1px solid rgba(148, 179, 255, 0.08);
}

.drawer-actions {
  display: grid;
  gap: 10px;
  padding-top: 6px;
}

@media (max-width: 1080px) {
  .nav-links {
    display: none;
  }

  .nav-menu-btn {
    display: inline-flex;
  }
}

@media (max-width: 720px) {
  .brand-role {
    display: none;
  }

  .nav-resume-desktop {
    display: none;
  }

  .nav-work-cta {
    padding: 8px 11px;
    font-size: 12.5px;
  }
}
</style>
