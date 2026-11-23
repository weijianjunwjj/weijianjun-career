<script setup lang="ts">
import { computed, ref } from 'vue'
import { evolutionStages, stackDomains } from '../data/skills.ts'

const activeIndex = ref(3)
const activeStage = computed(() => evolutionStages[activeIndex.value] ?? evolutionStages[0])
</script>

<template>
  <section id="evolution" class="section-block">
    <div class="container">
      <header class="section-header" data-reveal>
        <span class="eyebrow">
          <span class="eyebrow-dot" />
          <span>TRADITIONAL FOUNDATION × AI EVOLUTION</span>
        </span>
        <h2 class="section-title">7 年技术底盘，如何演进为 AI 应用工程化能力？</h2>
        <p class="section-lead">
          不是抛弃传统工程去追逐概念，而是把复杂 B 端与多端系统里锤炼出的状态边界、异步兜底和架构治理方法论，直接迁移到 LLM 流式交互与可验证 Agent 系统中。
        </p>
      </header>

      <!-- Interactive 4-Stage Trajectory -->
      <div class="evolution-workbench glass-panel" data-reveal>
        <div class="stage-rail" role="tablist" aria-label="能力演进四个阶段">
          <button
            v-for="(stage, idx) in evolutionStages"
            :key="stage.number"
            type="button"
            role="tab"
            :aria-selected="activeIndex === idx"
            class="rail-node"
            :class="{ 'is-active': activeIndex === idx }"
            @click="activeIndex = idx"
          >
            <span class="mono rail-num">{{ stage.number }}</span>
            <span class="rail-meta">
              <span class="rail-phase">{{ stage.phase }}</span>
              <span class="mono rail-period">{{ stage.period }}</span>
            </span>
          </button>
        </div>

        <article class="stage-detail" role="tabpanel">
          <div class="stage-detail-top">
            <span class="badge badge-cyan">{{ activeStage.company }}</span>
            <span class="mono stage-detail-period">{{ activeStage.period }}</span>
          </div>
          <h3 class="stage-detail-title">{{ activeStage.title }}</h3>
          <p class="stage-detail-summary">{{ activeStage.summary }}</p>

          <div class="breakthrough-box">
            <span class="mono breakthrough-label">关键工程突破</span>
            <p class="breakthrough-text">{{ activeStage.breakthrough }}</p>
          </div>

          <div class="tag-row">
            <span v-for="tech in activeStage.stack" :key="tech" class="tech-chip">{{ tech }}</span>
          </div>
        </article>
      </div>

      <!-- 6-Domain Technical Blueprint -->
      <div class="domains-grid" data-reveal>
        <article
          v-for="domain in stackDomains"
          :key="domain.category"
          class="domain-card"
          :class="{ 'is-ai-domain': domain.tag === 'AI EVOLUTION' }"
        >
          <div class="domain-head">
            <h3 class="domain-title">{{ domain.category }}</h3>
            <span class="mono domain-tag">{{ domain.tag }}</span>
          </div>
          <div class="tag-row">
            <span v-for="item in domain.items" :key="item" class="tech-chip">{{ item }}</span>
          </div>
          <p class="domain-note">{{ domain.note }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.evolution-workbench {
  padding: clamp(18px, 2.5vw, 28px);
  display: grid;
  grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
  gap: clamp(18px, 2.8vw, 32px);
  margin-bottom: 24px;
}

.stage-rail {
  display: grid;
  gap: 8px;
}

.rail-node {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(148, 179, 255, 0.12);
  background: rgba(6, 11, 24, 0.72);
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s var(--ease-out),
    background-color 0.2s var(--ease-out);
}

.rail-node:hover {
  border-color: rgba(148, 179, 255, 0.34);
}

.rail-node.is-active {
  border-color: rgba(56, 232, 255, 0.55);
  background: linear-gradient(125deg, rgba(56, 232, 255, 0.14), rgba(79, 124, 255, 0.14));
}

.rail-num {
  font-size: 13px;
  font-weight: 700;
  color: var(--cyan);
  padding-top: 2px;
}

.rail-meta {
  display: grid;
  gap: 2px;
}

.rail-phase {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-primary);
}

.rail-period {
  font-size: 11.5px;
  color: var(--ink-muted);
}

.stage-detail {
  display: grid;
  gap: 14px;
  align-content: center;
  padding: 6px 4px;
}

.stage-detail-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.stage-detail-period {
  font-size: 12px;
  color: var(--ink-muted);
}

.stage-detail-title {
  margin: 0;
  font-size: clamp(20px, 2.2vw, 26px);
  line-height: 1.25;
  color: var(--ink-primary);
}

.stage-detail-summary {
  margin: 0;
  font-size: 14.5px;
  color: var(--ink-secondary);
}

.breakthrough-box {
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--cyan);
  background: rgba(56, 232, 255, 0.06);
  display: grid;
  gap: 4px;
}

.breakthrough-label {
  font-size: 11px;
  color: var(--cyan);
  letter-spacing: 0.06em;
}

.breakthrough-text {
  margin: 0;
  font-size: 13.5px;
  color: #dce9ff;
}

.domains-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.domain-card {
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line-subtle);
  background: rgba(8, 14, 29, 0.74);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.domain-card.is-ai-domain {
  border-color: rgba(139, 92, 246, 0.42);
  background: linear-gradient(155deg, rgba(139, 92, 246, 0.12), rgba(8, 14, 29, 0.84));
}

.domain-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.domain-title {
  margin: 0;
  font-size: 15.5px;
  font-weight: 600;
  color: var(--ink-primary);
}

.domain-tag {
  font-size: 10.5px;
  color: var(--cyan);
  letter-spacing: 0.06em;
}

.domain-card.is-ai-domain .domain-tag {
  color: #c4b5fd;
}

.domain-note {
  margin: auto 0 0;
  font-size: 12.5px;
  color: var(--ink-muted);
}

@media (max-width: 980px) {
  .evolution-workbench {
    grid-template-columns: 1fr;
  }

  .domains-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .domains-grid {
    grid-template-columns: 1fr;
  }
}
</style>
