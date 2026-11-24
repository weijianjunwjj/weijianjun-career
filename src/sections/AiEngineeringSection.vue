<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import type { LightboxItem } from '../components/MediaLightbox.vue'
import { aiCompanions, novaWing } from '../data/projects.ts'

const emit = defineEmits<{
  openMedia: [payload: { items: LightboxItem[]; startIndex: number; trigger: HTMLElement | null }]
}>()

const activeNodeIndex = ref(0)
const activeEvidenceIndex = ref(0)

const activeNode = computed(() => novaWing.flow[activeNodeIndex.value] ?? novaWing.flow[0])
const activeEvidence = computed(
  () => novaWing.evidence[activeEvidenceIndex.value] ?? novaWing.evidence[0],
)

function openEvidenceLightbox(event: MouseEvent, startIndex: number) {
  const items: LightboxItem[] = novaWing.evidence.map((ev) => ({
    kind: 'image',
    src: ev.image,
    title: `${novaWing.title} · ${ev.label}`,
    caption: `${ev.title} ${ev.text}`,
    provenance: 'NovaWing 真实运行日志截屏',
    alt: ev.alt,
  }))
  emit('openMedia', {
    items,
    startIndex,
    trigger: event.currentTarget as HTMLElement | null,
  })
}

function openDemoVideo(event: MouseEvent) {
  emit('openMedia', {
    items: [
      {
        kind: 'video',
        src: novaWing.demo.src,
        poster: novaWing.demo.poster,
        title: `${novaWing.fullName} · 完整运行录屏（${novaWing.demo.duration}）`,
        caption: novaWing.demo.description,
        provenance: '原始完整录屏 · 按需请求',
      },
    ],
    startIndex: 0,
    trigger: event.currentTarget as HTMLElement | null,
  })
}
</script>

<template>
  <section id="ai-engineering" class="section-block">
    <div class="container">
      <header class="section-header" data-reveal>
        <span class="eyebrow">
          <span class="eyebrow-dot" />
          <span>AI ENGINEERING LEVERAGE</span>
        </span>
        <h2 class="section-title">AI 工程化加持：用前端确定性思维驾驭 Agent 与流式应用</h2>
        <p class="section-lead">
          不是停留在调用 Prompt，而是把复杂前端的状态边界、流式协议排障与独立验收机制，变成团队可落地的 AI 生产力。
        </p>
      </header>

      <!-- NovaWing Showcase Workbench -->
      <article id="novawing" class="glass-panel nova-workbench" data-reveal>
        <div class="nova-head">
          <div class="nova-title-group">
            <div class="nova-badges">
              <span class="badge badge-violet">{{ novaWing.category }}</span>
              <span class="mono nova-period">{{ novaWing.period }}</span>
            </div>
            <h3 class="nova-title">{{ novaWing.fullName }}</h3>
            <p class="nova-headline">“{{ novaWing.headline }}”</p>
            <p class="nova-desc">{{ novaWing.description }}</p>
          </div>

          <div class="nova-links">
            <a
              :href="novaWing.links.repo"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary btn-sm"
            >
              <AppIcon name="github" :size="14" />
              <span>GitHub 源码</span>
              <AppIcon name="arrow-up-right" :size="13" />
            </a>
            <a
              :href="novaWing.links.project"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-portal btn-sm"
            >
              <span>NovaWing 展示站</span>
              <AppIcon name="arrow-up-right" :size="14" />
            </a>
            <a
              :href="novaWing.links.showcase"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost btn-sm"
            >
              <AppIcon name="github" :size="14" />
              <span>Showcase 仓库</span>
            </a>
          </div>
        </div>

        <!-- Interactive 6-Stage Guarded Pipeline -->
        <div class="pipeline-panel">
          <div class="pipeline-header">
            <span class="mono pipeline-kicker">GUARDED EXECUTION PIPELINE · 点击节点查看职责边界</span>
          </div>
          <div class="pipeline-nodes" role="tablist" aria-label="NovaWing 六阶段守护流程">
            <button
              v-for="(node, idx) in novaWing.flow"
              :key="node.id"
              type="button"
              role="tab"
              :aria-selected="activeNodeIndex === idx"
              class="pipeline-node"
              :class="{ 'is-active': activeNodeIndex === idx }"
              @click="activeNodeIndex = idx"
            >
              <span class="mono node-step">0{{ idx + 1 }}</span>
              <span class="node-en mono">{{ node.english }}</span>
              <span class="node-cn">{{ node.label }}</span>
            </button>
          </div>
          <div class="pipeline-detail" role="tabpanel">
            <span class="badge badge-cyan">{{ activeNode.english }} · {{ activeNode.label }}</span>
            <p class="pipeline-boundary">{{ activeNode.boundary }}</p>
          </div>
        </div>

        <!-- Asymmetric Real Evidence & On-Demand Video Split -->
        <div class="nova-media-grid">
          <div class="nova-evidence-box">
            <div class="evidence-tabs" role="tablist" aria-label="切换 NovaWing 真实日志截屏">
              <button
                v-for="(ev, idx) in novaWing.evidence"
                :key="ev.id"
                type="button"
                role="tab"
                :aria-selected="activeEvidenceIndex === idx"
                class="evidence-tab"
                :class="{ 'is-active': activeEvidenceIndex === idx }"
                @click="activeEvidenceIndex = idx"
              >
                {{ ev.label }}
              </button>
            </div>

            <div class="optical-frame">
              <div class="optical-frame-bar">
                <span class="optical-dots"><span /><span /><span /></span>
                <span class="optical-bar-label">真实执行证据 · {{ activeEvidence.label }}</span>
              </div>
              <button
                type="button"
                class="optical-media-btn"
                :aria-label="`放大查看 ${activeEvidence.label} 真实截屏`"
                @click="openEvidenceLightbox($event, activeEvidenceIndex)"
              >
                <img
                  :src="activeEvidence.thumb"
                  :alt="activeEvidence.alt"
                  loading="lazy"
                  :width="activeEvidence.width"
                  :height="activeEvidence.height"
                />
                <span class="optical-zoom-hint">
                  <AppIcon name="expand" :size="12" />
                  <span>查看高清原图</span>
                </span>
              </button>
            </div>

            <div class="evidence-caption-box">
              <p class="evidence-caption-title">{{ activeEvidence.title }}</p>
              <p class="evidence-caption-text">{{ activeEvidence.text }}</p>
            </div>
          </div>

          <div class="nova-demo-box">
            <div class="problem-solution-stack">
              <div class="ps-card">
                <span class="mono ps-label">核心痛点</span>
                <p class="ps-text">{{ novaWing.problem }}</p>
              </div>
              <div class="ps-card">
                <span class="mono ps-label">架构约束</span>
                <p class="ps-text">{{ novaWing.solution }}</p>
              </div>
            </div>

            <div class="demo-poster-card">
              <div class="demo-poster-wrap">
                <img
                  :src="novaWing.demo.poster"
                  alt="NovaWing 13 分钟完整运行原始录屏封面"
                  loading="lazy"
                  width="640"
                  height="360"
                />
                <span class="mono demo-duration">{{ novaWing.demo.duration }}</span>
              </div>
              <div class="demo-poster-footer">
                <div>
                  <p class="demo-title">完整原始运行录屏</p>
                  <p class="demo-note">点击按需加载播放，首屏零视频带宽消耗</p>
                </div>
                <button type="button" class="btn btn-primary btn-sm" @click="openDemoVideo">
                  <AppIcon name="play" :size="14" />
                  <span>播放录屏</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Companion AI Projects: Enterprise Streaming Fix + OfferFlow -->
      <div class="companions-grid" data-reveal>
        <article
          v-for="item in aiCompanions"
          :id="item.id"
          :key="item.id"
          class="glass-panel companion-card"
        >
          <span class="badge badge-cyan">{{ item.badge }}</span>
          <h3 class="companion-title">{{ item.title }}</h3>
          <p class="companion-summary">{{ item.summary }}</p>
          <ul class="companion-list">
            <li v-for="decision in item.decisions" :key="decision">{{ decision }}</li>
          </ul>
          <div class="companion-footer">
            <div class="tag-row">
              <span v-for="tech in item.stack" :key="tech" class="tech-chip">{{ tech }}</span>
            </div>
            <a
              v-if="item.href"
              :href="item.href"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost btn-sm"
            >
              <AppIcon name="github" :size="14" />
              <span>{{ item.actionLabel }}</span>
              <AppIcon name="arrow-up-right" :size="13" />
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nova-workbench {
  padding: clamp(20px, 2.8vw, 30px);
  display: grid;
  gap: 20px;
  border-color: rgba(139, 92, 246, 0.34);
  background:
    radial-gradient(55% 65% at 0% 0%, rgba(139, 92, 246, 0.12), transparent 65%),
    radial-gradient(45% 55% at 100% 100%, rgba(56, 232, 255, 0.08), transparent 65%),
    var(--bg-glass);
}

.nova-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.nova-title-group {
  display: grid;
  gap: 7px;
  max-width: 72ch;
}

.nova-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.nova-period {
  font-size: 12px;
  color: var(--ink-muted);
}

.nova-title {
  margin: 0;
  font-size: clamp(21px, 2.4vw, 28px);
  line-height: 1.2;
  color: var(--ink-primary);
}

.nova-headline {
  margin: 0;
  font-size: 15.5px;
  font-weight: 600;
  color: #a6f4ff;
}

.nova-desc {
  margin: 0;
  font-size: 13.8px;
  color: var(--ink-secondary);
}

.nova-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* Guarded pipeline */
.pipeline-panel {
  padding: 15px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(148, 179, 255, 0.16);
  background: rgba(4, 8, 19, 0.78);
  display: grid;
  gap: 12px;
}

.pipeline-kicker {
  font-size: 11px;
  color: var(--ink-muted);
  letter-spacing: 0.06em;
}

.pipeline-nodes {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}

.pipeline-node {
  display: grid;
  gap: 3px;
  padding: 10px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(148, 179, 255, 0.14);
  background: rgba(11, 19, 38, 0.8);
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s var(--ease-out),
    background-color 0.2s var(--ease-out);
}

.pipeline-node:hover {
  border-color: rgba(56, 232, 255, 0.36);
}

.pipeline-node.is-active {
  border-color: var(--cyan);
  background: linear-gradient(145deg, rgba(56, 232, 255, 0.18), rgba(139, 92, 246, 0.18));
}

.node-step {
  font-size: 10.5px;
  color: var(--ink-muted);
  white-space: nowrap;
}

.node-en {
  font-size: 12px;
  font-weight: 700;
  color: var(--cyan);
}

.node-cn {
  font-size: 12.5px;
  color: var(--ink-primary);
  font-weight: 500;
}

.pipeline-detail {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(148, 179, 255, 0.12);
}

.pipeline-boundary {
  margin: 0;
  font-size: 13.5px;
  color: #dce9ff;
}

/* Media grid */
.nova-media-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.85fr);
  gap: 18px;
  align-items: start;
}

.nova-evidence-box {
  display: grid;
  gap: 12px;
}

.evidence-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.evidence-tab {
  padding: 7px 13px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--line-subtle);
  background: rgba(8, 14, 29, 0.8);
  color: var(--ink-secondary);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s var(--ease-out), color 0.2s var(--ease-out);
}

.evidence-tab.is-active {
  border-color: var(--cyan);
  background: var(--cyan-soft);
  color: #ffffff;
}

.nova-evidence-box img {
  max-height: 290px;
  width: 100%;
  object-fit: contain;
  background: #0b101b;
}

.evidence-caption-box {
  display: grid;
  gap: 3px;
}

.evidence-caption-title {
  margin: 0;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink-primary);
}

.evidence-caption-text {
  margin: 0;
  font-size: 13px;
  color: var(--ink-secondary);
}

.nova-demo-box {
  display: grid;
  gap: 12px;
}

.problem-solution-stack {
  display: grid;
  gap: 10px;
}

.ps-card {
  padding: 13px 15px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-subtle);
  background: rgba(6, 11, 24, 0.72);
  display: grid;
  gap: 4px;
}

.ps-label {
  font-size: 11px;
  color: #c4b5fd;
  letter-spacing: 0.06em;
}

.ps-text {
  margin: 0;
  font-size: 13px;
  color: var(--ink-secondary);
}

.demo-poster-card {
  border-radius: var(--radius-md);
  border: 1px solid rgba(56, 232, 255, 0.28);
  background: rgba(6, 11, 24, 0.88);
  overflow: hidden;
}

.demo-poster-wrap {
  position: relative;
}

.demo-poster-wrap img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.demo-duration {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  background: rgba(4, 7, 17, 0.86);
  border: 1px solid rgba(56, 232, 255, 0.45);
  color: var(--cyan);
  font-size: 11.5px;
}

.demo-poster-footer {
  padding: 13px 15px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.demo-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-primary);
}

.demo-note {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--ink-muted);
}

/* Companions */
.companions-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.companion-card {
  padding: clamp(18px, 2.2vw, 24px);
  display: flex;
  flex-direction: column;
  gap: 11px;
  align-items: flex-start;
}

.companion-title {
  margin: 0;
  font-size: 18px;
  color: var(--ink-primary);
}

.companion-summary {
  margin: 0;
  font-size: 13.5px;
  color: var(--ink-secondary);
}

.companion-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 5px;
  font-size: 13px;
  color: #cad7ef;
}

.companion-list li::marker {
  color: var(--cyan);
}

.companion-footer {
  width: 100%;
  margin-top: auto;
  padding-top: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

@media (max-width: 1024px) {
  .pipeline-nodes {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .nova-media-grid,
  .companions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .pipeline-nodes {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
