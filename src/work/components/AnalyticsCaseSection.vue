<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '../../components/AppIcon.vue'
import LazyImg from '../../components/LazyImg.vue'
import type { LightboxItem } from '../../components/MediaLightbox.vue'
import { links } from '../../data/links.ts'
import CaseValueStrip from './CaseValueStrip.vue'
import DecisionAccordion from './DecisionAccordion.vue'
import { analyticsCase } from '../workData.ts'

const emit = defineEmits<{
  openMedia: [payload: { items: LightboxItem[]; startIndex: number; trigger: HTMLElement | null }]
}>()

const activeIdx = ref(0)
const activeShot = computed(() => analyticsCase.evidence[activeIdx.value] ?? analyticsCase.evidence[0])

function openGallery(startIndex: number, event: MouseEvent) {
  emit('openMedia', {
    items: analyticsCase.evidence.map((item) => ({
      kind: 'image',
      src: item.src,
      title: `${item.tag} · ${item.title}`,
      caption: item.caption,
      provenance: item.provenance,
      alt: item.alt,
    })),
    startIndex,
    trigger: event.currentTarget as HTMLElement | null,
  })
}
</script>

<template>
  <section id="case-analytics" class="case-section">
    <div class="container case-stack">
      <header class="case-header glass-panel">
        <div class="case-badges">
          <span class="badge badge-violet">{{ analyticsCase.number }} · {{ analyticsCase.tier }}</span>
          <span class="mono case-period">{{ analyticsCase.company }} · {{ analyticsCase.period }}</span>
        </div>

        <h1 class="case-title">{{ analyticsCase.title }}</h1>
        <p class="case-subtitle">{{ analyticsCase.subtitle }}</p>

        <CaseValueStrip :trio="analyticsCase.valueTrio" accent="violet" />

        <div class="tag-row">
          <span v-for="tech in analyticsCase.stack" :key="tech" class="tech-chip">{{ tech }}</span>
        </div>

        <!-- Build Governance & OSS Highlight Strip -->
        <div class="governance-strip">
          <div class="gov-stat">
            <span class="mono gov-val">300s → 30s</span>
            <span class="gov-label">本机无改动二次构建提效（resolutions 统一 Webpack 5 + filesystem 缓存）</span>
          </div>
          <div class="gov-stat">
            <span class="mono gov-val">7 模块局部 Store</span>
            <span class="gov-label">Options API 页面级状态边界，攻克 Vue 2.6 + composition-api RefImpl 失活</span>
          </div>
          <div class="gov-stat">
            <span class="mono gov-val">3 开源包沉淀</span>
            <span class="gov-label">
              vue-page-store / vue-page-scope / vue-page-runtime ·
              <a :href="`${links.main}#credentials`" class="gov-link">查看开源主页 ↗</a>
            </span>
          </div>
        </div>
      </header>

      <!-- 3-Screen Interactive Desensitized Replay Stage -->
      <div id="analytics-replay" class="glass-panel replay-workbench">
        <div class="replay-top">
          <div>
            <span class="eyebrow">DESENSITIZED FUNCTIONAL REPLAY · 3 CORE VIEWS</span>
            <h2 class="replay-title">核心业务现场复现 · 实时监控 / 7 模块状态边界 / CRM 规则校验</h2>
          </div>
          <div class="replay-tabs" role="tablist" aria-label="切换友谊时光 EBI 复现视图">
            <button
              v-for="(shot, idx) in analyticsCase.evidence"
              :key="shot.id"
              type="button"
              role="tab"
              :aria-selected="activeIdx === idx"
              class="replay-tab"
              :class="{ 'is-active': activeIdx === idx }"
              @click="activeIdx = idx"
            >
              {{ shot.tag }}
            </button>
          </div>
        </div>

        <div class="replay-main">
          <div class="optical-frame replay-primary">
            <div class="optical-frame-bar">
              <span class="optical-dots"><span /><span /><span /></span>
              <span class="optical-bar-label">{{ activeShot.title }} · {{ activeShot.provenance }}</span>
            </div>
            <button
              type="button"
              class="optical-media-btn"
              :aria-label="`放大查看 ${activeShot.title}`"
              @click="openGallery(activeIdx, $event)"
            >
              <LazyImg :src="activeShot.thumb || activeShot.src" :alt="activeShot.alt" :width="1320" :height="880" />
              <span class="optical-zoom-hint">
                <AppIcon name="expand" :size="12" />
                <span>高清放大查验</span>
              </span>
            </button>
          </div>

          <aside class="replay-sidebar">
            <div class="active-shot-info">
              <span class="badge badge-violet">{{ activeShot.provenance }}</span>
              <h3 class="shot-heading">{{ activeShot.title }}</h3>
              <p class="shot-desc">{{ activeShot.caption }}</p>
            </div>

            <div class="thumb-list">
              <button
                v-for="(shot, idx) in analyticsCase.evidence"
                :key="shot.id"
                type="button"
                class="thumb-item"
                :class="{ 'is-active': activeIdx === idx }"
                @click="activeIdx = idx"
              >
                <LazyImg :src="shot.thumb || shot.src" :alt="shot.title" :width="88" :height="56" />
                <span class="thumb-meta">
                  <span class="mono thumb-tag">{{ shot.tag }}</span>
                  <span class="thumb-title">{{ shot.title }}</span>
                </span>
              </button>
            </div>

            <p class="provenance-note">{{ analyticsCase.evidenceNote }}</p>
          </aside>
        </div>
      </div>

      <!-- 4 Technical Decisions (Progressive Disclosure: 2 open by default) -->
      <DecisionAccordion
        :decisions="analyticsCase.decisions"
        :default-open-count="2"
        accent="violet"
        section-id="analytics-decisions"
      />
    </div>
  </section>
</template>

<style scoped>
.case-section {
  padding-top: 16px;
  padding-bottom: clamp(24px, 3.2vw, 40px);
}

.case-stack {
  display: grid;
  gap: 18px;
}

.case-header {
  padding: clamp(20px, 2.8vw, 30px);
  display: grid;
  gap: 15px;
  border-color: rgba(139, 92, 246, 0.34);
  background:
    radial-gradient(50% 80% at 100% 0%, rgba(139, 92, 246, 0.12), transparent 65%),
    var(--bg-glass);
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

.case-title {
  margin: 0;
  font-size: clamp(22px, 2.8vw, 32px);
  line-height: 1.22;
  color: var(--ink-primary);
}

.case-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--ink-secondary);
  max-width: 78ch;
}

.governance-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding-top: 2px;
}

.gov-stat {
  padding: 13px 15px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(139, 92, 246, 0.25);
  background: rgba(6, 11, 24, 0.78);
  display: grid;
  gap: 4px;
}

.gov-val {
  font-size: 15.5px;
  font-weight: 700;
  color: #c4b5fd;
}

.gov-label {
  font-size: 12.2px;
  color: var(--ink-secondary);
}

.gov-link {
  color: var(--cyan);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* Replay Workbench */
.replay-workbench {
  padding: clamp(18px, 2.4vw, 28px);
  display: grid;
  gap: 18px;
}

.replay-top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
}

.replay-title {
  margin: 4px 0 0;
  font-size: clamp(17.5px, 2vw, 21px);
  color: var(--ink-primary);
}

.replay-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.replay-tab {
  padding: 7px 12px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--line-subtle);
  background: rgba(5, 10, 22, 0.8);
  color: var(--ink-secondary);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
}

.replay-tab.is-active {
  border-color: rgba(139, 92, 246, 0.65);
  background: var(--violet-soft);
  color: #ffffff;
}

.replay-main {
  display: grid;
  grid-template-columns: minmax(0, 1.38fr) minmax(0, 0.82fr);
  gap: 18px;
  align-items: start;
}

.replay-primary img {
  aspect-ratio: 16 / 10.6;
  object-fit: cover;
  object-position: top left;
}

.replay-sidebar {
  display: grid;
  gap: 14px;
}

.active-shot-info {
  display: grid;
  gap: 6px;
  justify-items: start;
}

.shot-heading {
  margin: 0;
  font-size: 16px;
  color: var(--ink-primary);
}

.shot-desc {
  margin: 0;
  font-size: 13px;
  color: var(--ink-secondary);
}

.thumb-list {
  display: grid;
  gap: 8px;
}

.thumb-item {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 10px;
  padding: 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-subtle);
  background: rgba(5, 10, 22, 0.78);
  text-align: left;
  cursor: pointer;
  align-items: center;
}

.thumb-item.is-active {
  border-color: var(--cyan);
  background: rgba(56, 232, 255, 0.1);
}

.thumb-item img {
  width: 88px;
  height: 56px;
  object-fit: cover;
  object-position: top left;
  border-radius: 5px;
  background: #0b1326;
}

.thumb-meta {
  display: grid;
  gap: 2px;
}

.thumb-tag {
  font-size: 10.5px;
  color: var(--cyan);
}

.thumb-title {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-primary);
}

.provenance-note {
  margin: 0;
  font-size: 12px;
  color: var(--ink-muted);
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .replay-main,
  .governance-strip {
    grid-template-columns: 1fr;
  }
}
</style>
