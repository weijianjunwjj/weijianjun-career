<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DecisionCard } from '../workData.ts'

const props = withDefaults(
  defineProps<{
    decisions: DecisionCard[]
    defaultOpenCount?: number
    accent?: 'cyan' | 'violet' | 'emerald'
    sectionId?: string
  }>(),
  {
    defaultOpenCount: 2,
    accent: 'cyan',
    sectionId: 'case-decisions',
  },
)

const openSet = ref<Record<string, boolean>>(
  Object.fromEntries(
    props.decisions.map((item, idx) => [item.index, idx < props.defaultOpenCount]),
  ),
)

const allExpanded = computed(() => props.decisions.every((item) => openSet.value[item.index]))

function toggle(index: string) {
  openSet.value[index] = !openSet.value[index]
}

function toggleAll() {
  const next = !allExpanded.value
  for (const item of props.decisions) {
    openSet.value[item.index] = next
  }
}
</script>

<template>
  <section :id="sectionId" class="decisions-shell glass-panel" :class="`accent-${accent}`">
    <div class="decisions-head">
      <div>
        <span class="eyebrow">ENGINEERING DECISIONS &amp; TRADE-OFFS</span>
        <h3 class="decisions-heading">
          核心技术决策（共 {{ decisions.length }} 项 · 默认展开核心，可按需查验全文）
        </h3>
      </div>
      <button type="button" class="btn btn-ghost btn-sm" @click="toggleAll">
        {{ allExpanded ? '收起次要决策' : `展开全部 ${decisions.length} 项决策` }}
      </button>
    </div>

    <div class="decisions-grid">
      <article
        v-for="item in decisions"
        :key="item.index"
        class="decision-card"
        :class="{ 'is-open': openSet[item.index] }"
      >
        <button
          type="button"
          class="decision-trigger"
          :aria-expanded="openSet[item.index]"
          @click="toggle(item.index)"
        >
          <div class="decision-trigger-top">
            <span class="mono decision-index">DECISION {{ item.index }}</span>
            <span class="decision-toggle-hint">
              {{ openSet[item.index] ? '收起详情 −' : '展开痛点与决策 +' }}
            </span>
          </div>
          <h4 class="decision-title">{{ item.title }}</h4>
          <p v-if="!openSet[item.index]" class="decision-summary">
            <strong>结论：</strong>{{ item.outcome }}
          </p>
        </button>

        <div v-if="openSet[item.index]" class="decision-body">
          <p class="decision-row"><strong>痛点：</strong>{{ item.problem }}</p>
          <p class="decision-row"><strong>决策：</strong>{{ item.decision }}</p>
          <p class="decision-outcome"><strong>结果：</strong>{{ item.outcome }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.decisions-shell {
  padding: clamp(20px, 2.6vw, 28px);
  display: grid;
  gap: 16px;
}

.decisions-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.decisions-heading {
  margin: 4px 0 0;
  font-size: clamp(17px, 2vw, 20px);
  color: var(--ink-primary);
}

.decisions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  align-items: start;
}

.decision-card {
  border-radius: var(--radius-md);
  border: 1px solid var(--line-subtle);
  background: rgba(5, 10, 22, 0.8);
  transition: border-color 0.2s var(--ease-out);
  overflow: hidden;
}

.decision-card.is-open {
  border-color: rgba(148, 179, 255, 0.26);
}

.decision-trigger {
  width: 100%;
  padding: 16px 18px;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  display: grid;
  gap: 7px;
}

.decision-trigger:hover .decision-toggle-hint {
  color: var(--ink-primary);
}

.decision-trigger-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.decision-index {
  font-size: 11px;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.accent-cyan .decision-index {
  color: var(--cyan);
}

.accent-violet .decision-index {
  color: #c4b5fd;
}

.accent-emerald .decision-index {
  color: var(--emerald);
}

.decision-toggle-hint {
  font-size: 12px;
  color: var(--ink-muted);
  white-space: nowrap;
}

.decision-title {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.35;
  color: var(--ink-primary);
}

.decision-summary {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #a6f4ff;
}

.decision-summary strong {
  color: var(--emerald);
}

.decision-body {
  padding: 0 18px 18px;
  display: grid;
  gap: 8px;
}

.decision-row {
  margin: 0;
  font-size: 13.2px;
  color: var(--ink-secondary);
}

.decision-row strong {
  color: var(--ink-primary);
}

.decision-outcome {
  margin: 2px 0 0;
  padding-top: 8px;
  border-top: 1px solid var(--line-subtle);
  font-size: 13.2px;
  color: #a6f4ff;
}

.decision-outcome strong {
  color: var(--emerald);
}

@media (max-width: 820px) {
  .decisions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
