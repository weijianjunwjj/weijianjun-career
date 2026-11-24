<script setup lang="ts">
export interface CaseValueTrio {
  whatIDid: string
  hardProblem: string
  whyItMatters: string
}

withDefaults(
  defineProps<{
    trio: CaseValueTrio
    accent?: 'cyan' | 'violet' | 'emerald'
  }>(),
  { accent: 'cyan' },
)
</script>

<template>
  <div class="value-trio" :class="`accent-${accent}`" aria-label="项目核心价值速览">
    <article class="trio-item">
      <span class="mono trio-kicker">01 我做了什么</span>
      <p class="trio-text">{{ trio.whatIDid }}</p>
    </article>
    <article class="trio-item">
      <span class="mono trio-kicker">02 解决了什么难题</span>
      <p class="trio-text">{{ trio.hardProblem }}</p>
    </article>
    <article class="trio-item is-highlight">
      <span class="mono trio-kicker">03 为什么值得认可</span>
      <p class="trio-text">{{ trio.whyItMatters }}</p>
    </article>
  </div>
</template>

<style scoped>
.value-trio {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding-top: 4px;
}

.trio-item {
  padding: 13px 15px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-subtle);
  background: rgba(5, 10, 22, 0.78);
  display: grid;
  gap: 5px;
  align-content: start;
}

.accent-cyan .trio-kicker {
  color: var(--cyan);
}

.accent-violet .trio-kicker {
  color: #c4b5fd;
}

.accent-emerald .trio-kicker {
  color: var(--emerald);
}

.trio-item.is-highlight {
  border-color: rgba(56, 232, 255, 0.28);
  background: rgba(9, 20, 40, 0.86);
}

.accent-violet .trio-item.is-highlight {
  border-color: rgba(139, 92, 246, 0.34);
  background: rgba(20, 14, 42, 0.72);
}

.accent-emerald .trio-item.is-highlight {
  border-color: rgba(34, 211, 168, 0.32);
  background: rgba(7, 24, 34, 0.78);
}

.trio-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.trio-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #dce8ff;
}

@media (max-width: 900px) {
  .value-trio {
    grid-template-columns: 1fr;
  }
}
</style>
