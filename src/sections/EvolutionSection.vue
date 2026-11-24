<script setup lang="ts">
import { stackDomains } from '../data/skills.ts'
</script>

<template>
  <section id="capabilities" class="section-block">
    <div class="container">
      <header class="section-header" data-reveal>
        <span class="eyebrow">
          <span class="eyebrow-dot" />
          <span>CORE FRONTEND ARCHITECTURE &amp; AI LEVERAGE</span>
        </span>
        <h2 class="section-title">核心能力矩阵：7 年前端工程底盘 + AI 加持</h2>
        <p class="section-lead">
          以复杂中后台、微前端治理、数据可视化与多端交付为根基，把确定性状态边界迁移到 AI 流式应用与受约束 Agent 系统。
        </p>
      </header>

      <div class="domains-grid" data-reveal>
        <article
          v-for="domain in stackDomains"
          :key="domain.category"
          class="domain-card"
          :class="{ 'is-ai-domain': domain.tag === 'AI LEVERAGE' }"
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
  white-space: nowrap;
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
