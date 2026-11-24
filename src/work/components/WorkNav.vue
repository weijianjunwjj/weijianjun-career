<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '../../components/AppIcon.vue'
import ResumeLink from '../../components/ResumeLink.vue'
import { links } from '../../data/links.ts'
import { profile } from '../../data/profile.ts'
import type { WorkCaseId } from '../workData.ts'

defineProps<{
  activeCase: WorkCaseId
}>()

const emit = defineEmits<{
  navigate: [target: { caseId: WorkCaseId; path: string }]
}>()

const menuOpen = ref(false)

const tabs: { id: WorkCaseId; label: string; path: string }[] = [
  { id: 'all', label: '项目索引', path: '/' },
  { id: 'courier', label: '01 中邮通', path: '/projects/courier/' },
  { id: 'analytics', label: '02 友谊时光', path: '/projects/analytics/' },
  { id: 'lowcode', label: '03 低代码引擎', path: '/projects/lowcode/' },
  { id: 'liveshop', label: '04 LiveShop', path: '/projects/liveshop/' },
]

function selectTab(tab: { id: WorkCaseId; path: string }) {
  menuOpen.value = false
  emit('navigate', { caseId: tab.id, path: tab.path })
}
</script>

<template>
  <header class="work-nav" @keydown.esc="menuOpen = false">
    <div class="container work-nav-inner">
      <a
        href="/"
        class="work-brand"
        aria-label="工程项目体验中心首页"
        @click.prevent="selectTab(tabs[0])"
      >
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
          <span class="brand-title">工程项目体验中心</span>
          <span class="brand-sub">{{ profile.name }} · {{ profile.positioning }}</span>
        </span>
      </a>

      <nav class="work-tabs" aria-label="项目案例切换导航">
        <a
          v-for="tab in tabs"
          :key="tab.id"
          :href="tab.path"
          class="work-tab"
          :class="{ 'is-active': activeCase === tab.id }"
          :aria-current="activeCase === tab.id ? 'page' : undefined"
          @click.prevent="selectTab(tab)"
        >
          {{ tab.label }}
        </a>
      </nav>

      <div class="work-nav-actions">
        <a :href="links.main" class="btn btn-portal btn-sm return-home-cta">
          <AppIcon name="arrow-left" :size="14" />
          <span>返回个人主页</span>
        </a>
        <ResumeLink class="work-resume-desktop" label="下载简历" variant="ghost" compact />
        <button
          type="button"
          class="work-menu-btn"
          :aria-expanded="menuOpen"
          aria-controls="work-mobile-drawer"
          aria-label="打开或关闭移动端项目导航"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="18" />
        </button>
      </div>
    </div>

    <div v-if="menuOpen" id="work-mobile-drawer" class="work-drawer">
      <div class="container work-drawer-inner">
        <p class="mono drawer-role">{{ profile.name }} · {{ profile.positioning }}</p>
        <div class="drawer-tabs">
          <a
            v-for="tab in tabs"
            :key="tab.id"
            :href="tab.path"
            class="drawer-tab"
            :class="{ 'is-active': activeCase === tab.id }"
            @click.prevent="selectTab(tab)"
          >
            <span>{{ tab.label }}</span>
            <AppIcon name="arrow-right" :size="14" />
          </a>
        </div>
        <div class="drawer-actions">
          <a :href="links.main" class="btn btn-primary">
            <AppIcon name="arrow-left" :size="15" />
            <span>返回魏建军个人主页 (weijianjun.me)</span>
          </a>
          <ResumeLink label="下载完整简历 (PDF)" variant="ghost" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.work-nav {
  position: sticky;
  top: 0;
  z-index: 80;
  border-bottom: 1px solid rgba(56, 232, 255, 0.18);
  background: rgba(4, 7, 17, 0.9);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.work-nav-inner {
  min-height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.work-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
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

.brand-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--ink-primary);
}

.brand-sub {
  font-size: 11px;
  color: var(--cyan);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.work-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(148, 179, 255, 0.14);
  background: rgba(7, 13, 27, 0.85);
}

.work-tab {
  padding: 6px 12px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-secondary);
  white-space: nowrap;
  transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out);
}

.work-tab:hover {
  color: var(--ink-primary);
}

.work-tab.is-active {
  background: linear-gradient(135deg, rgba(56, 232, 255, 0.2), rgba(79, 124, 255, 0.24));
  color: #ffffff;
  font-weight: 600;
}

.work-nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.work-menu-btn {
  display: none;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-strong);
  background: rgba(16, 27, 51, 0.8);
  color: var(--ink-primary);
  cursor: pointer;
}

.work-drawer {
  border-top: 1px solid var(--line-subtle);
  background: rgba(5, 9, 21, 0.98);
  padding-block: 16px 22px;
}

.work-drawer-inner {
  display: grid;
  gap: 14px;
}

.drawer-role {
  margin: 0;
  font-size: 12px;
  color: var(--cyan);
}

.drawer-tabs {
  display: grid;
  gap: 6px;
}

.drawer-tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(148, 179, 255, 0.1);
  background: rgba(16, 27, 51, 0.5);
  color: var(--ink-primary);
  font-size: 14px;
}

.drawer-tab.is-active {
  border-color: var(--cyan);
  background: rgba(56, 232, 255, 0.14);
}

.drawer-actions {
  display: grid;
  gap: 10px;
}

@media (max-width: 1120px) {
  .work-tabs {
    display: none;
  }

  .work-menu-btn {
    display: inline-flex;
  }
}

@media (max-width: 720px) {
  .brand-sub,
  .work-resume-desktop {
    display: none;
  }

  .return-home-cta {
    padding: 8px 11px;
    font-size: 12.5px;
  }
}
</style>
