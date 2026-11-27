<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import ResumeLink from '../components/ResumeLink.vue'
import type { LightboxItem } from '../components/MediaLightbox.vue'
import WorkNav from './components/WorkNav.vue'
import CourierCaseSection from './components/CourierCaseSection.vue'
import AnalyticsCaseSection from './components/AnalyticsCaseSection.vue'
import LowcodeCaseSection from './components/LowcodeCaseSection.vue'
import LiveshopCaseSection from './components/LiveshopCaseSection.vue'
import { links } from '../data/links.ts'
import { profile } from '../data/profile.ts'
import { RESUME_FILENAME } from '../data/siteConfig.ts'
import { notifyVisitorRouteChange, resolveWorkProjectId } from '../shared/visitorWidget.ts'
import {
  workIndexCards,
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

const CASE_TITLES: Record<WorkCaseId, string> = {
  all: `工程项目体验中心 · ${profile.name}｜${profile.positioning}`,
  courier: `01 中邮通快递双端（逍遥邮） · 工程证据｜${profile.name}`,
  analytics: `02 友谊时光 EBI 与微前端治理 · 工程证据｜${profile.name}`,
  lowcode: `03 企业级低代码引擎交互沙盒 · 工程证据｜${profile.name}`,
  liveshop: `04 LiveShop 海外社交电商双端 · 工程证据｜${profile.name}`,
}

const CASE_ANCHORS: Record<Exclude<WorkCaseId, 'all'>, { label: string; href: string }[]> = {
  courier: [
    { label: '双端录屏与截图', href: '#courier-evidence' },
    { label: '异步出单状态机', href: '#courier-simulator' },
    { label: '核心技术决策', href: '#courier-decisions' },
  ],
  analytics: [
    { label: '3 组脱敏业务复现', href: '#analytics-replay' },
    { label: '核心技术决策', href: '#analytics-decisions' },
  ],
  lowcode: [
    { label: '四层架构落点', href: '#lowcode-arch' },
    { label: '3 合 1 交互沙盒', href: '#lowcode-sandbox' },
    { label: '核心技术决策', href: '#lowcode-decisions' },
  ],
  liveshop: [
    { label: 'App 核心界面', href: '#liveshop-app' },
    { label: '后台与权责边界', href: '#liveshop-admin' },
    { label: '核心技术决策', href: '#liveshop-decisions' },
  ],
}

const activeCardMeta = computed(() =>
  activeCase.value === 'all'
    ? null
    : (workIndexCards.find((item) => item.id === activeCase.value) ?? null),
)

const activeAnchors = computed(() =>
  activeCase.value === 'all' ? [] : CASE_ANCHORS[activeCase.value],
)

const siblingCases = computed(() => {
  if (activeCase.value === 'all') return { prev: null, next: null }
  const idx = workIndexCards.findIndex((item) => item.id === activeCase.value)
  if (idx < 0) return { prev: null, next: null }
  return {
    prev: idx > 0 ? workIndexCards[idx - 1] : null,
    next: idx < workIndexCards.length - 1 ? workIndexCards[idx + 1] : null,
  }
})

function updateDocumentTitle() {
  if (activeCase.value === 'courier' && courierSubView.value === 'mini') {
    document.title = `01 中邮通微信小程序 · 真机与支付分证据｜${profile.name}`
    return
  }
  if (activeCase.value === 'courier' && courierSubView.value === 'admin') {
    document.title = `01 中邮通运营管理后台 · 订单与对账证据｜${profile.name}`
    return
  }
  document.title = CASE_TITLES[activeCase.value]
}

function emitVisitorContext() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  notifyVisitorRouteChange({
    site: 'work',
    path,
    title: document.title,
    projectId: resolveWorkProjectId(path),
  })
}

async function scrollToHashIfPresent() {
  const hash = window.location.hash
  if (!hash || hash.length < 2) return
  await nextTick()
  const target = document.getElementById(hash.slice(1))
  if (target) {
    target.scrollIntoView({ behavior: 'auto', block: 'start' })
  }
}

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
  } else if (path === '/projects/lowcode') {
    activeCase.value = 'lowcode'
  } else if (path === '/projects/liveshop') {
    activeCase.value = 'liveshop'
  } else {
    activeCase.value = 'all'
    courierSubView.value = 'overview'
  }
  updateDocumentTitle()
  emitVisitorContext()
  void scrollToHashIfPresent()
}

function navigateTo(target: { caseId: WorkCaseId; path: string }) {
  activeCase.value = target.caseId
  if (target.caseId === 'courier' && target.path === '/projects/courier/') {
    courierSubView.value = 'overview'
  }
  if (window.location.pathname !== target.path || window.location.hash) {
    window.history.pushState({}, '', target.path)
  }
  updateDocumentTitle()
  emitVisitorContext()
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
  updateDocumentTitle()
  emitVisitorContext()
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
</script>

<template>
  <div class="space-shell">
    <a href="#work-main" class="skip-link">跳至项目证据内容</a>
    <WorkNav :active-case="activeCase" @navigate="navigateTo" />

    <main id="work-main">
      <!-- Option A: Lightweight Project Index Workbench (Only shown on '/') -->
      <section v-if="activeCase === 'all'" class="work-index-hub">
        <div class="container work-hero-stack">
          <div class="index-hero-top">
            <div class="work-hero-copy">
              <div class="hero-badges">
                <span class="badge badge-cyan">
                  <span class="eyebrow-dot" />
                  <span>{{ profile.positioning }}</span>
                </span>
                <span class="mono hero-domain">work.weijianjun.me · 技术验证索引台</span>
              </div>

              <h1 class="work-hero-title">真实业务 · 工程证据项目索引</h1>
              <p class="work-hero-lead">
                按业务复杂度与高级前端区分度排布四大真实体系。点击任意项目，首屏直达该项目价值结论、脱敏实拍、录屏、交互沙盒与工程取舍，无需在巨型长页中翻找。
              </p>

              <div class="work-hero-actions">
                <a :href="links.main" class="btn btn-portal btn-sm">
                  <AppIcon name="arrow-left" :size="14" />
                  <span>返回个人主页 (weijianjun.me)</span>
                </a>
                <ResumeLink label="下载完整简历 (PDF)" variant="primary" compact />
              </div>
            </div>

            <div class="overview-stats">
              <article v-for="stat in workOverviewStats" :key="stat.label" class="stat-tile">
                <p class="mono stat-val">{{ stat.value }}</p>
                <p class="stat-label">{{ stat.label }}</p>
              </article>
            </div>
          </div>

          <!-- 2x2 Visual Project Index Grid -->
          <div class="index-grid" aria-label="四大真实工程案例导航">
            <article
              v-for="card in workIndexCards"
              :key="card.id"
              class="glass-panel glass-panel-interactive index-card"
              :class="`tone-${card.accent}`"
            >
              <a
                :href="card.path"
                class="index-card-link"
                @click.prevent="navigateTo({ caseId: card.id, path: card.path })"
              >
                <div class="index-card-head">
                  <span
                    class="badge"
                    :class="
                      card.accent === 'violet'
                        ? 'badge-violet'
                        : card.accent === 'emerald'
                          ? 'badge-emerald'
                          : 'badge-cyan'
                    "
                  >
                    {{ card.number }} · {{ card.tier }}
                  </span>
                  <span class="mono index-period">{{ card.company }} · {{ card.period }}</span>
                </div>

                <div class="index-preview" :class="{ 'is-dual': Boolean(card.secondaryThumb) }">
                  <div class="optical-frame index-desktop-thumb">
                    <img
                      :src="card.thumb"
                      :alt="card.thumbAlt"
                      width="1320"
                      height="820"
                    />
                  </div>
                  <div v-if="card.secondaryThumb" class="phone-bezel index-phone-thumb">
                    <div class="phone-bezel-screen">
                      <img
                        :src="card.secondaryThumb"
                        :alt="card.secondaryAlt || card.thumbAlt"
                        width="390"
                        height="844"
                      />
                    </div>
                  </div>
                </div>

                <h2 class="index-card-title">{{ card.title }}</h2>
                <p class="index-card-pitch">{{ card.valuePitch }}</p>

                <div class="index-proof-row">
                  <span v-for="item in card.proofItems" :key="item" class="proof-pill">{{ item }}</span>
                </div>

                <div class="index-card-cta">
                  <span>{{ card.ctaLabel }}</span>
                  <AppIcon name="arrow-right" :size="15" />
                </div>
              </a>
            </article>
          </div>
        </div>
      </section>

      <!-- Focused Case Context Bar (Only shown on '/projects/*') -->
      <div v-else class="case-context-wrap">
        <div class="container case-context-bar">
          <div class="context-left">
            <a
              href="/"
              class="btn btn-ghost btn-sm context-back-btn"
              @click.prevent="navigateTo({ caseId: 'all', path: '/' })"
            >
              <AppIcon name="arrow-left" :size="14" />
              <span>返回 4 项目索引</span>
            </a>
            <span v-if="activeCardMeta" class="mono context-crumb">
              {{ activeCardMeta.number }} / 04 · {{ activeCardMeta.tier }}
            </span>
          </div>

          <nav v-if="activeAnchors.length" class="context-anchors" aria-label="当前案例页内快速定位">
            <a
              v-for="anchor in activeAnchors"
              :key="anchor.href"
              :href="anchor.href"
              class="context-anchor-link"
            >
              {{ anchor.label }}
            </a>
          </nav>
        </div>
      </div>

      <!-- Focused Individual Case Section (Zero duplicated hero above!) -->
      <CourierCaseSection
        v-if="activeCase === 'courier'"
        :sub-view="courierSubView"
        @change-sub-view="handleCourierSubView"
        @open-media="handleOpenMedia"
      />

      <AnalyticsCaseSection
        v-if="activeCase === 'analytics'"
        @open-media="handleOpenMedia"
      />

      <LowcodeCaseSection v-if="activeCase === 'lowcode'" />

      <LiveshopCaseSection
        v-if="activeCase === 'liveshop'"
        @open-media="handleOpenMedia"
      />

      <!-- Sequential Case Switcher on Individual Pages -->
      <section v-if="activeCase !== 'all'" class="case-pager-section" aria-label="切换其他项目案例">
        <div class="container case-pager-grid">
          <a
            v-if="siblingCases.prev"
            :href="siblingCases.prev.path"
            class="glass-panel pager-card"
            @click.prevent="
              navigateTo({ caseId: siblingCases.prev.id, path: siblingCases.prev.path })
            "
          >
            <span class="mono pager-dir">← 上一个案例</span>
            <strong class="pager-title">
              {{ siblingCases.prev.number }} · {{ siblingCases.prev.title }}
            </strong>
          </a>
          <a
            v-else
            href="/"
            class="glass-panel pager-card"
            @click.prevent="navigateTo({ caseId: 'all', path: '/' })"
          >
            <span class="mono pager-dir">← 索引总览</span>
            <strong class="pager-title">返回全部 4 个真实业务项目索引</strong>
          </a>

          <a
            v-if="siblingCases.next"
            :href="siblingCases.next.path"
            class="glass-panel pager-card is-next"
            @click.prevent="
              navigateTo({ caseId: siblingCases.next.id, path: siblingCases.next.path })
            "
          >
            <span class="mono pager-dir">下一个案例 →</span>
            <strong class="pager-title">
              {{ siblingCases.next.number }} · {{ siblingCases.next.title }}
            </strong>
          </a>
          <a
            v-else
            href="/"
            class="glass-panel pager-card is-next"
            @click.prevent="navigateTo({ caseId: 'all', path: '/' })"
          >
            <span class="mono pager-dir">完成全部 4 项查验 →</span>
            <strong class="pager-title">返回项目索引或下载完整简历</strong>
          </a>
        </div>
      </section>

      <!-- Reciprocal Return Conversion Banner -->
      <section class="return-section">
        <div class="container">
          <div class="glass-panel return-panel">
            <div class="return-copy">
              <span class="eyebrow">WEIJIANJUN.ME · PERSONAL BRAND &amp; AI ENGINEERING</span>
              <h2 class="return-title">查看完整 7 年履历、npm 开源资产与 NovaWing AI 工程化？</h2>
              <p class="return-desc">
                返回个人主页查看完整工作经历、掘金专栏、NovaWing 13 分钟运行录屏与直接联系方式。
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
/* Lightweight Index Hub on '/' */
.work-index-hub {
  padding-top: clamp(24px, 3.2vw, 40px);
  padding-bottom: clamp(20px, 3vw, 36px);
}

.work-hero-stack {
  display: grid;
  gap: 22px;
}

.index-hero-top {
  display: grid;
  grid-template-columns: minmax(0, 1.38fr) minmax(0, 0.82fr);
  gap: 22px;
  align-items: center;
}

.work-hero-copy {
  display: grid;
  gap: 12px;
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
  font-size: clamp(26px, 3.4vw, 42px);
  line-height: 1.15;
  letter-spacing: -0.03em;
  background: linear-gradient(95deg, #ffffff 0%, #8bf0ff 56%, #9cb2ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.work-hero-lead {
  margin: 0;
  font-size: 14px;
  color: var(--ink-secondary);
  max-width: 64ch;
}

.work-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 2px;
}

.overview-stats {
  display: grid;
  gap: 9px;
}

.stat-tile {
  padding: 12px 15px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line-subtle);
  background: rgba(8, 14, 29, 0.78);
  display: grid;
  gap: 2px;
}

.stat-val {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--cyan);
}

.stat-label {
  margin: 0;
  font-size: 12.2px;
  color: var(--ink-secondary);
}

/* 2x2 Visual Index Grid */
.index-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.index-card {
  display: flex;
  overflow: hidden;
}

.index-card.tone-cyan {
  border-color: rgba(56, 232, 255, 0.22);
}

.index-card.tone-violet {
  border-color: rgba(139, 92, 246, 0.28);
}

.index-card.tone-emerald {
  border-color: rgba(34, 211, 168, 0.26);
}

.index-card-link {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.index-card-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.index-period {
  font-size: 11.5px;
  color: var(--ink-muted);
}

.index-preview {
  display: grid;
  gap: 10px;
  align-items: end;
}

.index-preview.is-dual {
  grid-template-columns: minmax(0, 1fr) 92px;
}

.index-desktop-thumb img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9.5;
  object-fit: cover;
  object-position: top left;
}

.index-phone-thumb {
  padding: 4px;
  border-radius: 14px;
}

.index-phone-thumb .phone-bezel-screen {
  border-radius: 10px;
  cursor: pointer;
}

.index-phone-thumb img {
  width: 100%;
  height: auto;
  aspect-ratio: 9 / 19;
  object-fit: cover;
  object-position: top;
}

.index-card-title {
  margin: 0;
  font-size: 18px;
  line-height: 1.3;
  color: var(--ink-primary);
}

.index-card-pitch {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--ink-secondary);
}

.index-proof-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.proof-pill {
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  border: 1px solid rgba(148, 179, 255, 0.14);
  background: rgba(6, 11, 24, 0.78);
  font-family: var(--font-mono);
  font-size: 11px;
  color: #93f5dc;
}

.index-card-cta {
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid var(--line-subtle);
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--cyan);
}

/* Focused Single-Case Context Bar */
.case-context-wrap {
  padding-top: 16px;
}

.case-context-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(56, 232, 255, 0.2);
  background: rgba(7, 13, 27, 0.86);
}

.context-left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.context-crumb {
  font-size: 12px;
  color: var(--ink-secondary);
}

.context-anchors {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.context-anchor-link {
  padding: 5px 10px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(148, 179, 255, 0.16);
  background: rgba(16, 27, 51, 0.65);
  font-size: 12px;
  color: #cde3ff;
  transition: border-color 0.2s var(--ease-out), color 0.2s var(--ease-out);
}

.context-anchor-link:hover {
  border-color: var(--cyan);
  color: #ffffff;
}

/* Sequential Case Pager */
.case-pager-section {
  padding-top: 8px;
  padding-bottom: 12px;
}

.case-pager-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.pager-card {
  padding: 16px 20px;
  display: grid;
  gap: 4px;
  transition: border-color 0.2s var(--ease-out), transform 0.2s var(--ease-out);
}

.pager-card:hover {
  border-color: var(--cyan-line);
  transform: translateY(-1px);
}

.pager-card.is-next {
  text-align: right;
}

.pager-dir {
  font-size: 11.5px;
  color: var(--cyan);
}

.pager-title {
  font-size: 14.5px;
  color: var(--ink-primary);
}

/* Return Banner */
.return-section {
  padding-block: clamp(20px, 3vw, 38px);
}

.return-panel {
  padding: clamp(20px, 2.8vw, 30px);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
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
  gap: 5px;
  max-width: 64ch;
}

.return-title {
  margin: 0;
  font-size: clamp(18px, 2vw, 22px);
  color: #ffffff;
}

.return-desc {
  margin: 0;
  font-size: 13.5px;
  color: #c2d4f0;
}

.resume-note {
  margin: 2px 0 0;
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
  .index-hero-top,
  .index-grid,
  .case-pager-grid {
    grid-template-columns: 1fr;
  }

  .pager-card.is-next {
    text-align: left;
  }
}

@media (max-width: 560px) {
  .index-preview.is-dual {
    grid-template-columns: minmax(0, 1fr) 76px;
    gap: 8px;
  }

  .context-anchors {
    width: 100%;
  }
}
</style>
