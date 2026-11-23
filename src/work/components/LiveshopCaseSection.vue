<script setup lang="ts">
import AppIcon from '../../components/AppIcon.vue'
import type { LightboxItem } from '../../components/MediaLightbox.vue'
import { liveshopCase } from '../workData.ts'

const emit = defineEmits<{
  openMedia: [payload: { items: LightboxItem[]; startIndex: number; trigger: HTMLElement | null }]
}>()

function openShot(event: MouseEvent) {
  const shot = liveshopCase.evidence[0]
  emit('openMedia', {
    items: [
      {
        kind: 'image',
        src: shot.src,
        title: `${shot.tag} · ${shot.title}`,
        caption: shot.caption,
        provenance: shot.provenance,
        alt: shot.alt,
      },
    ],
    startIndex: 0,
    trigger: event.currentTarget as HTMLElement | null,
  })
}
</script>

<template>
  <section id="case-liveshop" class="case-section">
    <div class="container case-stack">
      <header class="case-header glass-panel">
        <div class="case-badges">
          <span class="badge badge-emerald">{{ liveshopCase.number }} · {{ liveshopCase.tier }}</span>
          <span class="mono case-period">{{ liveshopCase.company }} · {{ liveshopCase.period }}</span>
        </div>

        <h2 class="case-title">{{ liveshopCase.title }}</h2>
        <p class="case-subtitle">{{ liveshopCase.subtitle }}</p>

        <div class="tag-row">
          <span v-for="tech in liveshopCase.stack" :key="tech" class="tech-chip">{{ tech }}</span>
        </div>
      </header>

      <!-- Visual Evidence + Contract Strip -->
      <div class="glass-panel liveshop-stage">
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
            @click="openShot"
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
          <span class="eyebrow">CONTRACT &amp; RBAC VERIFICATION</span>
          <h3 class="contract-title">接口契约覆盖与多端原生兜底</h3>
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
      </div>

      <!-- 3 Decisions -->
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
  padding: clamp(22px, 3vw, 32px);
  display: grid;
  gap: 14px;
  border-color: rgba(34, 211, 168, 0.28);
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
  font-size: 12px;
  color: var(--ink-muted);
  line-height: 1.5;
}

.decisions-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
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

@media (max-width: 1024px) {
  .liveshop-stage,
  .decisions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
