<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import ResumeLink from '../components/ResumeLink.vue'
import type { LightboxItem } from '../components/MediaLightbox.vue'
import WorkNav from './components/WorkNav.vue'
import CourierCaseSection from './components/CourierCaseSection.vue'
import AnalyticsCaseSection from './components/AnalyticsCaseSection.vue'
import LiveshopCaseSection from './components/LiveshopCaseSection.vue'
import { links } from '../data/links.ts'
import { profile } from '../data/profile.ts'
import { RESUME_FILENAME } from '../data/siteConfig.ts'
import {
  workOverviewStats,
  type CourierSubView,
  type WorkCaseId,
} from './workData.ts'

const MediaLightbox = defineAsyncComponent(() => import('../components/MediaLightbox.vue'))

const activeCase = ref<WorkCaseId>('all')
const courierSubView = ref<CourierSubView>('overview')

const lightboxOpen = ref(false)
const lightboxLoaded = ref(false)
const lightboxItems = ref<LightboxItem[]>([])
const lightboxStart = ref(0)
const lightboxTrigger = ref<HTMLElement | null>(null)

const buildCommit = __COMMIT_SHA__
const shortCommit = buildCommit.length > 10 ? buildCommit.slice(0, 7) : buildCommit

function syncFromLocation() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/projects/courier/mini') {
    activeCase.value = 'courier'
    courierSubView.value = 'mini'
  } else if (path === '/projects/courier/admin') {
    activeCase.value = 'courier'
    courierSubView.value = 'admin'
  } else if (path === '/projects/courier') {
    activeCase.value = 'courier'
    courierSubView.value = 'overview'
  } else if (path === '/projects/analytics') {
    activeCase.value = 'analytics'
  } else if (path === '/projects/liveshop') {
    activeCase.value = 'liveshop'
  } else {
    activeCase.value = 'all'
    courierSubView.value = 'overview'
  }
}

function navigateTo(target: { caseId: WorkCaseId; path: string }) {
  activeCase.value = target.caseId
  if (target.caseId === 'courier' && target.path === '/projects/courier/') {
    courierSubView.value = 'overview'
  }
  if (window.location.pathname !== target.path) {
    window.history.pushState({}, '', target.path)
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleCourierSubView(view: CourierSubView) {
  courierSubView.value = view
  const pathMap: Record<CourierSubView, string> = {
    overview: '/projects/courier/',
    mini: '/projects/courier/mini/',
    admin: '/projects/courier/admin/',
  }
  const nextPath = pathMap[view]
  if (activeCase.value === 'courier' && window.location.pathname !== nextPath) {
    window.history.pushState({}, '', nextPath)
  }
}

function handleOpenMedia(payload: {
  items: LightboxItem[]
  startIndex: number
  trigger: HTMLElement | null
}) {
  lightboxLoaded.value = true
  lightboxItems.value = payload.items
  lightboxStart.value = payload.startIndex
  lightboxTrigger.value = payload.trigger
  lightboxOpen.value = true
}

function handleCloseMedia() {
  lightboxOpen.value = false
}

onMounted(() => {
  syncFromLocation()
  window.addEventListener('popstate', syncFromLocation)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncFromLocation)
})

const dockCards: {
  id: WorkCaseId
  path: string
  index: string
  tier: string
  title: string
  summary: string
  proof: string
}[] = [
  {
    id: 'courier',
    path: '/projects/courier/',
    index: '01',
    tier: '核心项目',
    title: '中邮通快递体系（逍遥邮）',
    summary: '微信原生小程序先寄后付 + 异步出单状态机 + Vue 3 运营后台双账单 CSV 比对',
    proof: '5 张真机截图 · 4 张后台截图 · 2 段录屏 · 小程序码',
  },
  {
    id: 'analytics',
    path: '/projects/analytics/',
    index: '02',
    tier: '真实企业案例',
    title: '友谊时光 · EBI 与 SDK 监控',
    summary: 'Vue 2.6 Options API 页面级 Store 治理 · 7 模块局部状态 · Webpack 5 缓存 300s → 30s',
    proof: '3 组脱敏复现视图 · 4 项架构决策 · 3 开源包',
  },
  {
    id: 'liveshop',
    path: '/projects/liveshop/',
    index: '03',
    tier: '补充案例',
    title: 'LiveShop 海外社交电商',
    summary: 'Vue 3 + Pinia 动态菜单路由 RBAC · 109 接口路径覆测 · X 浏览器 OAuth 回跳',
    proof: '历史后台订单截图 · 109 AST 接口覆盖',
  },
]
</script>

<template>
  <div class="space-shell">
    <a href="#work-main" class="skip-link">跳至项目证据内容</a>
    <WorkNav :active-case="activeCase" @navigate="navigateTo" />

    <main id="work-main">
      <!-- Executive Workbench Hero -->
      <section class="work-hero">
        <div class="container work-hero-stack">
          <div class="work-hero-top">
            <div class="work-hero-copy">
              <div class="hero-badges">
                <span class="badge badge-cyan">
                  <span class="eyebrow-dot" />
                  <span>{{ profile.positioning }}</span>
                </span>
                <span class="mono hero-domain">work.weijianjun.me</span>
              </div>

              <h1 class="work-hero-title">
                真实业务 · 可验证工程证据工作台
              </h1>
              <p class="work-hero-lead">
                无需在几十个静态链接间反复跳转：这里按业务复杂度与真实证据密度，集中呈现中邮通快递体系、友谊时光数据平台与 LiveShop 后台的架构决策、脱敏界面、真机录屏与交互式状态机。
              </p>

              <div class="work-hero-actions">
                <a :href="links.main" class="btn btn-portal">
                  <AppIcon name="arrow-left" :size="15" />
                  <span>返回魏建军个人主页 (weijianjun.me)</span>
                </a>
                <ResumeLink label="下载完整简历 (PDF)" variant="primary" />
              </div>
            </div>

            <div class="overview-stats">
              <article v-for="stat in workOverviewStats" :key="stat.label" class="stat-tile">
                <p class="mono stat-val">{{ stat.value }}</p>
                <p class="stat-label">{{ stat.label }}</p>
                <p class="stat-detail">{{ stat.detail }}</p>
              </article>
            </div>
          </div>

          <!-- Instant 3-Case Dock (Zero Click Tax) -->
          <div class="case-dock" aria-label="三大真实工程案例快速切换">
            <button
              v-for="card in dockCards"
              :key="card.id"
              type="button"
              class="dock-card"
              :class="{ 'is-active': activeCase === card.id }"
              @click="navigateTo({ caseId: card.id, path: card.path })"
            >
              <div class="dock-head">
                <span class="mono dock-idx">{{ card.index }} · {{ card.tier }}</span>
                <AppIcon name="arrow-right" :size="14" />
              </div>
              <h2 class="dock-title">{{ card.title }}</h2>
              <p class="dock-summary">{{ card.summary }}</p>
              <p class="mono dock-proof">{{ card.proof }}</p>
            </button>
          </div>

          <div v-if="activeCase !== 'all'" class="filter-bar">
            <span class="filter-hint">当前聚焦单个案例视图，可随时一键回到三案例全景浏览。</span>
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              @click="navigateTo({ caseId: 'all', path: '/' })"
            >
              查看全部 3 个案例全景
            </button>
          </div>
        </div>
      </section>

      <!-- Case Sections (All visible on '/', or single-focused on deep links) -->
      <CourierCaseSection
        v-if="activeCase === 'all' || activeCase === 'courier'"
        :sub-view="courierSubView"
        @change-sub-view="handleCourierSubView"
        @open-media="handleOpenMedia"
      />

      <AnalyticsCaseSection
        v-if="activeCase === 'all' || activeCase === 'analytics'"
        @open-media="handleOpenMedia"
      />

      <LiveshopCaseSection
        v-if="activeCase === 'all' || activeCase === 'liveshop'"
        @open-media="handleOpenMedia"
      />

      <!-- Reciprocal Return Conversion Banner -->
      <section class="return-section">
        <div class="container">
          <div class="glass-panel return-panel">
            <div class="return-copy">
              <span class="eyebrow">WEIJIANJUN.ME · PERSONAL BRAND &amp; AI ENGINEERING</span>
              <h2 class="return-title">想查看 NovaWing Agent 工程化、OfferFlow 全栈 AI 与 7 年履历全貌？</h2>
              <p class="return-desc">
                返回个人品牌主站，查看 AI 应用与 Agent 工程化实践、13 分钟 NovaWing 完整运行录屏、npm 开源资产及直接联系方式。
              </p>
              <p class="mono resume-note">统一简历文件名：{{ RESUME_FILENAME }}</p>
            </div>
            <div class="return-actions">
              <a :href="links.main" class="btn btn-primary">
                <AppIcon name="arrow-left" :size="15" />
                <span>返回个人主页 (weijianjun.me)</span>
              </a>
              <ResumeLink label="下载简历 (PDF)" variant="portal" />
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="work-footer">
      <div class="container work-footer-inner">
        <div class="footer-left">
          <span class="footer-title">{{ profile.name }} · {{ profile.positioning }}</span>
          <span class="mono footer-meta" :data-build-sha="buildCommit">
            work.weijianjun.me · build {{ shortCommit }} · 邮箱 {{ profile.email }} · 电话 {{ profile.phone }}
          </span>
        </div>
        <div class="footer-right">
          <a :href="links.main" class="footer-link-main">
            <AppIcon name="arrow-left" :size="13" />
            <span>返回个人主页 (weijianjun.me)</span>
          </a>
          <a :href="links.github" target="_blank" rel="noopener noreferrer" class="footer-link">
            GitHub
          </a>
        </div>
      </div>
    </footer>

    <MediaLightbox
      v-if="lightboxLoaded"
      :open="lightboxOpen"
      :items="lightboxItems"
      :start-index="lightboxStart"
      :return-focus="lightboxTrigger"
      @close="handleCloseMedia"
    />
  </div>
</template>

<style scoped>
.work-hero {
  padding-top: clamp(28px, 4vw, 52px);
  padding-bottom: clamp(24px, 3vw, 36px);
}

.work-hero-stack {
  display: grid;
  gap: 22px;
}

.work-hero-top {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.85fr);
  gap: 24px;
  align-items: center;
}

.work-hero-copy {
  display: grid;
  gap: 14px;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.hero-domain {
  font-size: 12px;
  color: var(--ink-muted);
}

.work-hero-title {
  margin: 0;
  font-size: clamp(28px, 3.8vw, 46px);
  line-height: 1.14;
  letter-spacing: -0.03em;
  background: linear-gradient(95deg, #ffffff 0%, #8bf0ff 56%, #9cb2ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.work-hero-lead {
  margin: 0;
  font-size: 14.5px;
  color: var(--ink-secondary);
  max-width: 66ch;
}

.work-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 4px;
}

.overview-stats {
  display: grid;
  gap: 10px;
}

.stat-tile {
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line-subtle);
  background: rgba(8, 14, 29, 0.78);
  display: grid;
  gap: 2px;
}

.stat-val {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--cyan);
}

.stat-label {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-primary);
}

.stat-detail {
  margin: 0;
  font-size: 12px;
  color: var(--ink-muted);
}

/* 3-Case Dock */
.case-dock {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.dock-card {
  display: grid;
  gap: 7px;
  padding: 18px 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line-subtle);
  background: rgba(8, 14, 29, 0.8);
  text-align: left;
  cursor: pointer;
  align-content: start;
  transition:
    border-color 0.2s var(--ease-out),
    transform 0.2s var(--ease-out),
    background-color 0.2s var(--ease-out);
}

.dock-card:hover {
  border-color: var(--cyan-line);
  transform: translateY(-2px);
}

.dock-card.is-active {
  border-color: var(--cyan);
  background: linear-gradient(135deg, rgba(56, 232, 255, 0.14), rgba(79, 124, 255, 0.14));
}

.dock-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--cyan);
}

.dock-idx {
  font-size: 11.5px;
  font-weight: 700;
}

.dock-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink-primary);
}

.dock-summary {
  margin: 0;
  font-size: 12.5px;
  color: var(--ink-secondary);
}

.dock-proof {
  margin: 4px 0 0;
  font-size: 11px;
  color: #93f5dc;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(56, 232, 255, 0.28);
  background: rgba(56, 232, 255, 0.08);
}

.filter-hint {
  font-size: 13px;
  color: #dce9ff;
}

/* Return Banner */
.return-section {
  padding-block: clamp(24px, 4vw, 52px);
}

.return-panel {
  padding: clamp(22px, 3vw, 34px);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-color: rgba(56, 232, 255, 0.3);
  background: linear-gradient(
    115deg,
    rgba(11, 22, 46, 0.92) 0%,
    rgba(16, 32, 66, 0.86) 55%,
    rgba(36, 22, 72, 0.84) 100%
  );
}

.return-copy {
  display: grid;
  gap: 6px;
  max-width: 66ch;
}

.return-title {
  margin: 0;
  font-size: clamp(19px, 2.2vw, 24px);
  color: #ffffff;
}

.return-desc {
  margin: 0;
  font-size: 13.5px;
  color: #c2d4f0;
}

.resume-note {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--cyan);
}

.return-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* Footer */
.work-footer {
  border-top: 1px solid var(--line-subtle);
  background: rgba(3, 6, 15, 0.92);
  padding-block: 22px;
}

.work-footer-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.footer-left {
  display: grid;
  gap: 3px;
}

.footer-title {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-primary);
}

.footer-meta {
  font-size: 12px;
  color: var(--ink-muted);
}

.footer-right {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.footer-link-main {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: var(--cyan);
}

.footer-link {
  font-size: 13px;
  color: var(--ink-secondary);
}

@media (max-width: 980px) {
  .work-hero-top,
  .case-dock {
    grid-template-columns: 1fr;
  }
}
</style>
