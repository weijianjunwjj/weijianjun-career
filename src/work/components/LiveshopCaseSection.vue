<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '../../components/AppIcon.vue'
import type { LightboxItem } from '../../components/MediaLightbox.vue'
import { liveshopCase, type EvidenceMedia } from '../workData.ts'

const emit = defineEmits<{
  openMedia: [payload: { items: LightboxItem[]; startIndex: number; trigger: HTMLElement | null }]
}>()

type LiveshopView = 'overview' | 'app' | 'admin'
const activeView = ref<LiveshopView>('overview')

function openGallery(list: EvidenceMedia[], startIndex: number, event: MouseEvent) {
  emit('openMedia', {
    items: list.map((shot) => ({
      kind: 'image',
      src: shot.src,
      title: `${shot.tag} · ${shot.title}`,
      caption: shot.caption,
      provenance: shot.provenance,
      alt: shot.alt,
    })),
    startIndex,
    trigger: event.currentTarget as HTMLElement | null,
  })
}
</script>

<template>
  <section id="case-liveshop" class="case-section">
    <div class="container case-stack">
      <!-- Header + Product Positioning + Cross-End Flow -->
      <header class="case-header glass-panel">
        <div class="case-header-top">
          <div class="case-badges">
            <span class="badge badge-emerald">{{ liveshopCase.number }} · {{ liveshopCase.tier }}</span>
            <span class="mono case-period">{{ liveshopCase.company }} · {{ liveshopCase.period }}</span>
          </div>

          <div class="subview-switch" role="tablist" aria-label="LiveShop 双端视角切换">
            <button
              type="button"
              role="tab"
              :aria-selected="activeView === 'overview'"
              class="subview-btn"
              :class="{ 'is-active': activeView === 'overview' }"
              @click="activeView = 'overview'"
            >
              双端全景
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="activeView === 'app'"
              class="subview-btn"
              :class="{ 'is-active': activeView === 'app' }"
              @click="activeView = 'app'"
            >
              uni-app 客户端（7 屏 H5 演示）
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="activeView === 'admin'"
              class="subview-btn"
              :class="{ 'is-active': activeView === 'admin' }"
              @click="activeView = 'admin'"
            >
              运营后台（109 API）
            </button>
          </div>
        </div>

        <h2 class="case-title">{{ liveshopCase.title }}</h2>
        <p class="case-subtitle">{{ liveshopCase.subtitle }}</p>
        <p class="case-positioning"><strong>产品定位：</strong>{{ liveshopCase.positioning }}</p>

        <div class="tag-row">
          <span v-for="tech in liveshopCase.stack" :key="tech" class="tech-chip">{{ tech }}</span>
        </div>

        <!-- App ↔ Admin Cross-End Business Relationship Diagram -->
        <div class="flow-block" aria-label="App 与运营管理后台业务关系图">
          <div class="flow-head">
            <span class="eyebrow">CROSS-END ARCHITECTURE · APP ↔ ADMIN</span>
            <span class="mono flow-legend">app-live-shop (84 APIs) ⇄ admin-live-shop (109 APIs)</span>
          </div>
          <div class="lifecycle-grid">
            <article v-for="node in liveshopCase.crossEndFlow" :key="node.step" class="lifecycle-node">
              <div class="lifecycle-top">
                <span class="mono lifecycle-step">{{ node.step }}</span>
                <span class="badge badge-emerald-soft">{{ node.side }}</span>
              </div>
              <h3 class="lifecycle-title">{{ node.title }}</h3>
              <p class="lifecycle-detail">{{ node.detail }}</p>
            </article>
          </div>
        </div>
      </header>

      <!-- App Core Screens Gallery (5 Screens, 390px H5 Mock) -->
      <section v-if="activeView !== 'admin'" class="glass-panel app-stage" aria-label="uni-app 客户端核心页面截图">
        <div class="stage-head">
          <div>
            <span class="eyebrow">UNI-APP CLIENT · 7 CORE SCREENS · H5 MOCK</span>
            <h3 class="stage-title">uni-app 移动端核心界面 · 首页、个人主页、登录、社区与电商订单</h3>
          </div>
          <span class="badge badge-amber">H5 Mock 演示 · 非线上真实数据</span>
        </div>

        <p class="provenance-note">{{ liveshopCase.appEvidenceNote }}</p>

        <div class="phone-gallery">
          <article
            v-for="(shot, index) in liveshopCase.appEvidence"
            :key="shot.id"
            class="phone-card"
          >
            <button
              type="button"
              class="phone-frame-btn"
              :aria-label="`放大查看：${shot.title}`"
              @click="openGallery(liveshopCase.appEvidence, index, $event)"
            >
              <div class="phone-bezel">
                <img
                  :src="shot.src"
                  :alt="shot.alt"
                  loading="lazy"
                  width="390"
                  height="844"
                />
              </div>
              <span class="optical-zoom-hint">
                <AppIcon name="expand" :size="12" />
                <span>放大查验</span>
              </span>
            </button>
            <div class="phone-meta">
              <span class="mono phone-tag">{{ shot.tag }}</span>
              <h4 class="phone-title">{{ shot.title }}</h4>
              <p class="phone-caption">{{ shot.caption }}</p>
            </div>
          </article>
        </div>

        <!-- uni-app Cross-Platform Practice Strip -->
        <div class="practice-block">
          <span class="eyebrow">UNI-APP CROSS-PLATFORM ENGINEERING</span>
          <div class="practice-grid">
            <article
              v-for="item in liveshopCase.crossPlatformPractices"
              :key="item.label"
              class="practice-card"
            >
              <p class="mono practice-val">{{ item.value }}</p>
              <p class="practice-label">{{ item.label }}</p>
              <p class="practice-detail">{{ item.detail }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- Admin Backend Stage + Contract Verification -->
      <section v-if="activeView !== 'app'" class="glass-panel liveshop-stage" aria-label="运营管理后台与接口覆盖">
        <div class="optical-frame">
          <div class="optical-frame-bar">
            <span class="optical-dots"><span /><span /><span /></span>
            <span class="optical-bar-label">
              {{ liveshopCase.evidence[0].title }} · {{ liveshopCase.evidence[0].provenance }}
            </span>
          </div>
          <button
            type="button"
            class="optical-media-btn"
            aria-label="放大查看 LiveShop 管理后台商品订单截图"
            @click="openGallery(liveshopCase.evidence, 0, $event)"
          >
            <img
              :src="liveshopCase.evidence[0].src"
              :alt="liveshopCase.evidence[0].alt"
              loading="lazy"
              width="1320"
              height="920"
            />
            <span class="optical-zoom-hint">
              <AppIcon name="expand" :size="12" />
              <span>放大查验</span>
            </span>
          </button>
        </div>

        <div class="contract-col">
          <span class="eyebrow">ADMIN BACKEND &amp; CONTRACT VERIFICATION</span>
          <h3 class="contract-title">运营后台动态路由与双端契约核验</h3>
          <div class="metric-stack">
            <article
              v-for="metric in liveshopCase.contractMetrics"
              :key="metric.label"
              class="metric-card"
            >
              <p class="mono metric-val">{{ metric.value }}</p>
              <p class="metric-label">{{ metric.label }}</p>
              <p class="metric-detail">{{ metric.detail }}</p>
            </article>
          </div>
          <p class="provenance-note">{{ liveshopCase.evidenceNote }}</p>
        </div>
      </section>

      <!-- Ownership & Team Collaboration Boundary -->
      <section class="glass-panel ownership-panel" aria-label="个人职责与团队协作边界">
        <div class="ownership-head">
          <span class="eyebrow">OWNERSHIP &amp; COLLABORATION BOUNDARY</span>
          <h3 class="ownership-heading">个人实际负责模块与团队协作边界</h3>
        </div>
        <div class="ownership-grid">
          <article class="ownership-card is-led">
            <h4 class="ownership-col-title">{{ liveshopCase.ownership.ledTitle }}</h4>
            <ul class="ownership-list">
              <li v-for="item in liveshopCase.ownership.ledItems" :key="item">{{ item }}</li>
            </ul>
          </article>
          <article class="ownership-card is-collab">
            <h4 class="ownership-col-title">{{ liveshopCase.ownership.collabTitle }}</h4>
            <ul class="ownership-list">
              <li v-for="item in liveshopCase.ownership.collabItems" :key="item">{{ item }}</li>
            </ul>
          </article>
        </div>
      </section>

      <!-- 4 Key Technical Decisions -->
      <div class="decisions-grid">
        <article
          v-for="item in liveshopCase.decisions"
          :key="item.index"
          class="glass-panel decision-card"
        >
          <span class="mono decision-index">DECISION {{ item.index }}</span>
          <h3 class="decision-title">{{ item.title }}</h3>
          <p class="decision-row"><strong>痛点：</strong>{{ item.problem }}</p>
          <p class="decision-row"><strong>决策：</strong>{{ item.decision }}</p>
          <p class="decision-outcome"><strong>结果：</strong>{{ item.outcome }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.case-section {
  padding-block: clamp(28px, 4vw, 52px);
}

.case-stack {
  display: grid;
  gap: 20px;
}

.case-header {
  padding: clamp(20px, 3vw, 32px);
  display: grid;
  gap: 14px;
  border-color: rgba(34, 211, 168, 0.28);
}

.case-header-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.case-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.case-period {
  font-size: 12px;
  color: var(--ink-muted);
}

.subview-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.subview-btn {
  padding: 7px 13px;
  border-radius: 999px;
  border: 1px solid var(--line-subtle);
  background: rgba(8, 14, 29, 0.72);
  color: var(--ink-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: border-color 0.2s var(--ease-out), color 0.2s var(--ease-out), background-color 0.2s var(--ease-out);
}

.subview-btn:hover {
  border-color: rgba(34, 211, 168, 0.45);
  color: var(--ink-primary);
}

.subview-btn.is-active {
  border-color: var(--emerald);
  background: rgba(34, 211, 168, 0.16);
  color: #a7f3d0;
  font-weight: 600;
}

.case-title {
  margin: 0;
  font-size: clamp(22px, 2.8vw, 30px);
  line-height: 1.22;
  color: var(--ink-primary);
}

.case-subtitle {
  margin: 0;
  font-size: 14.5px;
  color: var(--ink-secondary);
  max-width: 78ch;
}

.case-positioning {
  margin: 0;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(34, 211, 168, 0.2);
  background: rgba(6, 20, 32, 0.68);
  font-size: 13px;
  color: #d6e9f7;
  line-height: 1.55;
}

.case-positioning strong {
  color: var(--emerald);
}

/* Cross-End Flow */
.flow-block {
  display: grid;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--line-subtle);
}

.flow-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.flow-legend {
  font-size: 11.5px;
  color: #93f5dc;
}

.lifecycle-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.lifecycle-node {
  padding: 14px 15px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-subtle);
  background: rgba(6, 12, 26, 0.78);
  display: grid;
  gap: 6px;
  align-content: start;
}

.lifecycle-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.lifecycle-step {
  font-size: 12px;
  font-weight: 700;
  color: var(--emerald);
}

.badge-emerald-soft {
  padding: 2px 8px;
  font-size: 11px;
  border-radius: 999px;
  background: rgba(34, 211, 168, 0.14);
  border: 1px solid rgba(34, 211, 168, 0.3);
  color: #a7f3d0;
}

.lifecycle-title {
  margin: 0;
  font-size: 14px;
  color: var(--ink-primary);
}

.lifecycle-detail {
  margin: 0;
  font-size: 12.2px;
  color: var(--ink-secondary);
  line-height: 1.5;
}

/* App Phone Gallery */
.app-stage {
  padding: clamp(20px, 2.8vw, 30px);
  display: grid;
  gap: 18px;
}

.stage-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.stage-title {
  margin: 4px 0 0;
  font-size: clamp(18px, 2.2vw, 22px);
  color: var(--ink-primary);
}

.badge-amber {
  background: rgba(245, 158, 11, 0.14);
  border-color: rgba(245, 158, 11, 0.42);
  color: #fde68a;
}

.phone-gallery {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.phone-card {
  display: grid;
  gap: 10px;
  align-content: start;
}

.phone-frame-btn {
  position: relative;
  display: block;
  width: 100%;
  padding: 6px;
  border-radius: 20px;
  border: 1px solid rgba(56, 232, 255, 0.24);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(5, 10, 22, 0.95));
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s var(--ease-out), border-color 0.2s var(--ease-out);
}

.phone-frame-btn:hover {
  transform: translateY(-2px);
  border-color: var(--emerald);
}

.phone-bezel {
  border-radius: 14px;
  overflow: hidden;
  background: #0b1120;
  aspect-ratio: 390 / 844;
}

.phone-bezel img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.phone-meta {
  display: grid;
  gap: 4px;
}

.phone-tag {
  font-size: 11px;
  color: var(--emerald);
}

.phone-title {
  margin: 0;
  font-size: 13.5px;
  color: var(--ink-primary);
}

.phone-caption {
  margin: 0;
  font-size: 12px;
  color: var(--ink-secondary);
  line-height: 1.5;
}

/* Cross-platform Practice Strip */
.practice-block {
  display: grid;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid var(--line-subtle);
}

.practice-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.practice-card {
  padding: 13px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-subtle);
  background: rgba(5, 10, 22, 0.78);
  display: grid;
  gap: 4px;
  align-content: start;
}

.practice-val {
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--cyan);
}

.practice-label {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-primary);
}

.practice-detail {
  margin: 0;
  font-size: 12px;
  color: var(--ink-secondary);
  line-height: 1.48;
}

/* Admin Stage */
.liveshop-stage {
  padding: clamp(20px, 2.6vw, 30px);
  display: grid;
  grid-template-columns: minmax(0, 1.32fr) minmax(0, 0.88fr);
  gap: 20px;
  align-items: start;
}

.liveshop-stage img {
  aspect-ratio: 16 / 11;
  object-fit: cover;
  object-position: top left;
}

.contract-col {
  display: grid;
  gap: 12px;
}

.contract-title {
  margin: 0;
  font-size: 18px;
  color: var(--ink-primary);
}

.metric-stack {
  display: grid;
  gap: 10px;
}

.metric-card {
  padding: 13px 15px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-subtle);
  background: rgba(5, 10, 22, 0.8);
  display: grid;
  gap: 3px;
}

.metric-val {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--emerald);
}

.metric-label {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-primary);
}

.metric-detail {
  margin: 0;
  font-size: 12px;
  color: var(--ink-secondary);
}

.provenance-note {
  margin: 0;
  font-size: 12.2px;
  color: var(--ink-muted);
  line-height: 1.55;
}

/* Ownership Boundary */
.ownership-panel {
  padding: clamp(20px, 2.6vw, 28px);
  display: grid;
  gap: 14px;
}

.ownership-head {
  display: grid;
  gap: 4px;
}

.ownership-heading {
  margin: 0;
  font-size: 18px;
  color: var(--ink-primary);
}

.ownership-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.ownership-card {
  padding: 16px 18px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-subtle);
  background: rgba(5, 10, 22, 0.78);
  display: grid;
  gap: 10px;
  align-content: start;
}

.ownership-card.is-led {
  border-color: rgba(34, 211, 168, 0.34);
}

.ownership-card.is-collab {
  border-color: rgba(245, 158, 11, 0.34);
}

.ownership-col-title {
  margin: 0;
  font-size: 14.5px;
  color: var(--ink-primary);
}

.ownership-card.is-led .ownership-col-title {
  color: #6ee7b7;
}

.ownership-card.is-collab .ownership-col-title {
  color: #fde68a;
}

.ownership-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 7px;
  font-size: 13px;
  color: var(--ink-secondary);
  line-height: 1.55;
}

/* 4 Decisions Grid */
.decisions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.decision-card {
  padding: 20px;
  display: grid;
  gap: 9px;
  align-content: start;
}

.decision-index {
  font-size: 11px;
  color: var(--emerald);
  letter-spacing: 0.08em;
}

.decision-title {
  margin: 0;
  font-size: 15.5px;
  color: var(--ink-primary);
}

.decision-row {
  margin: 0;
  font-size: 13px;
  color: var(--ink-secondary);
}

.decision-row strong {
  color: var(--ink-primary);
}

.decision-outcome {
  margin: 2px 0 0;
  padding-top: 8px;
  border-top: 1px solid var(--line-subtle);
  font-size: 13px;
  color: #a6f4ff;
}

.decision-outcome strong {
  color: var(--emerald);
}

@media (max-width: 1180px) {
  .phone-gallery {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .lifecycle-grid,
  .practice-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .liveshop-stage,
  .ownership-grid,
  .decisions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .phone-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .lifecycle-grid,
  .practice-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .phone-gallery {
    grid-template-columns: 1fr;
  }
}
</style>
