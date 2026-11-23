<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '../../components/AppIcon.vue'
import type { LightboxItem } from '../../components/MediaLightbox.vue'
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

        <h2 class="case-title">{{ analyticsCase.title }}</h2>
        <p class="case-subtitle">{{ analyticsCase.subtitle }}</p>

        <div class="tag-row">
          <span v-for="tech in analyticsCase.stack" :key="tech" class="tech-chip">{{ tech }}</span>
        </div>

        <!-- Build Governance Highlight Strip -->
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
            <span class="gov-label">vue-page-store / vue-page-scope / vue-page-runtime（npm 已发布）</span>
          </div>
        </div>
      </header>

      <!-- 3-Screen Interactive Desensitized Replay Stage -->
      <div class="glass-panel replay-workbench">
        <div class="replay-top">
          <div>
            <span class="eyebrow">DESENSITIZED FUNCTIONAL REPLAY · 3 CORE VIEWS</span>
            <h3 class="replay-title">核心业务现场复现 · 实时监控 / 7 模块状态边界 / CRM 规则校验</h3>
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
              <img :src="activeShot.src" :alt="activeShot.alt" loading="lazy" width="1320" height="880" />
              <span class="optical-zoom-hint">
                <AppIcon name="expand" :size="12" />
                <span>高清放大查验</span>
              </span>
            </button>
          </div>

          <aside class="replay-sidebar">
            <div class="active-shot-info">
              <span class="badge badge-violet">{{ activeShot.provenance }}</span>
              <h4 class="shot-heading">{{ activeShot.title }}</h4>
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
                <img :src="shot.src" :alt="shot.title" loading="lazy" width="320" height="213" />
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

      <!-- 4 Technical Decisions -->
      <div class="decisions-grid">
        <article
          v-for="item in analyticsCase.decisions"
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
  padding: clamp(22px, 3vw, 32px);
  display: grid;
  gap: 16px;
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
  font-size: 14.5px;
  color: var(--ink-secondary);
  max-width: 78ch;
}

.governance-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding-top: 6px;
}

.gov-stat {
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(139, 92, 246, 0.25);
  background: rgba(6, 11, 24, 0.78);
  display: grid;
  gap: 4px;
}

.gov-val {
  font-size: 16px;
  font-weight: 700;
  color: #c4b5fd;
}

.gov-label {
  font-size: 12.5px;
  color: var(--ink-secondary);
}

/* Replay Workbench */
.replay-workbench {
  padding: clamp(20px, 2.6vw, 30px);
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
  font-size: clamp(18px, 2.1vw, 22px);
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
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: 5px;
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

.decisions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.decision-card {
  padding: 20px 22px;
  display: grid;
  gap: 9px;
  align-content: start;
}

.decision-index {
  font-size: 11px;
  color: #c4b5fd;
  letter-spacing: 0.08em;
}

.decision-title {
  margin: 0;
  font-size: 16px;
  color: var(--ink-primary);
}

.decision-row {
  margin: 0;
  font-size: 13.5px;
  color: var(--ink-secondary);
}

.decision-row strong {
  color: var(--ink-primary);
}

.decision-outcome {
  margin: 2px 0 0;
  padding-top: 8px;
  border-top: 1px solid var(--line-subtle);
  font-size: 13.5px;
  color: #a6f4ff;
}

.decision-outcome strong {
  color: var(--emerald);
}

@media (max-width: 1024px) {
  .replay-main,
  .governance-strip {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .decisions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
