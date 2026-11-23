<script setup lang="ts">
import { computed, ref } from 'vue'
import { courierCase } from '../workData.ts'

const activeId = ref(courierCase.asyncScenarios[1].id)
const activeScenario = computed(
  () => courierCase.asyncScenarios.find((s) => s.id === activeId.value) ?? courierCase.asyncScenarios[0],
)
</script>

<template>
  <div class="simulator-box glass-panel">
    <div class="sim-header">
      <div class="sim-heading">
        <span class="eyebrow">INTERACTIVE ARCHITECTURE TRACE</span>
        <h3 class="sim-title">核心难点拆解：微信支付分异步出单 · 状态收敛机</h3>
        <p class="sim-desc">
          源码级还原 <code class="mono inline-code">ems-applet/components/web-socket/index.js</code> 与
          <code class="mono inline-code">pages/online-shipping/online-shipping.js</code> 的双轨兜底设计：切换 4 种真实网络/资金路径，查看前端如何避免用户停留在不确定态。
        </p>
      </div>
    </div>

    <div class="sim-tabs" role="tablist" aria-label="切换异步出单执行路径">
      <button
        v-for="scenario in courierCase.asyncScenarios"
        :key="scenario.id"
        type="button"
        role="tab"
        :aria-selected="activeId === scenario.id"
        class="sim-tab"
        :class="{ 'is-active': activeId === scenario.id }"
        @click="activeId = scenario.id"
      >
        <span class="mono sim-tab-badge">{{ scenario.badge }}</span>
        <span class="sim-tab-label">{{ scenario.label }}</span>
      </button>
    </div>

    <div class="sim-stage" role="tabpanel">
      <div class="sim-trigger">
        <span class="mono trigger-tag">触发前提</span>
        <p class="trigger-text">{{ activeScenario.trigger }}</p>
      </div>

      <ol class="sim-timeline">
        <li v-for="step in activeScenario.steps" :key="`${step.time}-${step.channel}`" class="sim-step">
          <div class="step-head">
            <span class="mono step-time">{{ step.time }}</span>
            <span class="badge badge-cyan">{{ step.channel }}</span>
          </div>
          <p class="step-action">{{ step.action }}</p>
          <p class="step-guard"><strong class="guard-prefix">工程守卫：</strong>{{ step.guard }}</p>
        </li>
      </ol>

      <div class="sim-outcome">
        <div class="outcome-pill">
          <span class="mono outcome-kicker">收敛终态</span>
          <span class="outcome-val">{{ activeScenario.terminalState }}</span>
        </div>
        <p class="outcome-ux">{{ activeScenario.uxGuarantee }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.simulator-box {
  padding: clamp(20px, 2.6vw, 30px);
  display: grid;
  gap: 18px;
  border-color: rgba(56, 232, 255, 0.28);
  background:
    radial-gradient(50% 60% at 100% 0%, rgba(56, 232, 255, 0.08), transparent 65%),
    rgba(7, 13, 27, 0.88);
}

.sim-heading {
  display: grid;
  gap: 6px;
}

.sim-title {
  margin: 0;
  font-size: clamp(18px, 2.1vw, 23px);
  color: var(--ink-primary);
}

.sim-desc {
  margin: 0;
  font-size: 13.5px;
  color: var(--ink-secondary);
}

.inline-code {
  padding: 2px 6px;
  border-radius: 5px;
  background: rgba(56, 232, 255, 0.1);
  color: #a6f4ff;
  font-size: 12px;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.sim-tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.sim-tab {
  display: grid;
  gap: 4px;
  padding: 12px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(148, 179, 255, 0.14);
  background: rgba(4, 8, 19, 0.78);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s var(--ease-out), background-color 0.2s var(--ease-out);
}

.sim-tab:hover {
  border-color: rgba(56, 232, 255, 0.36);
}

.sim-tab.is-active {
  border-color: var(--cyan);
  background: linear-gradient(135deg, rgba(56, 232, 255, 0.16), rgba(79, 124, 255, 0.18));
}

.sim-tab-badge {
  font-size: 10px;
  color: var(--cyan);
  letter-spacing: 0.06em;
}

.sim-tab-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-primary);
}

.sim-stage {
  display: grid;
  gap: 14px;
}

.sim-trigger {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: rgba(11, 19, 38, 0.85);
  border: 1px solid var(--line-subtle);
}

.trigger-tag {
  font-size: 11px;
  color: var(--cyan);
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--cyan-soft);
}

.trigger-text {
  margin: 0;
  font-size: 13.5px;
  color: #dce9ff;
}

.sim-timeline {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(230px, 100%), 1fr));
  gap: 12px;
}

.sim-step {
  padding: 15px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(148, 179, 255, 0.15);
  background: rgba(5, 10, 22, 0.82);
  display: grid;
  gap: 8px;
  align-content: start;
}

.step-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.step-time {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--cyan);
}

.step-action {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-primary);
}

.step-guard {
  margin: 0;
  font-size: 12.5px;
  color: var(--ink-secondary);
}

.guard-prefix {
  color: #93f5dc;
  font-weight: 600;
}

.sim-outcome {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(34, 211, 168, 0.34);
  background: rgba(34, 211, 168, 0.08);
}

.outcome-pill {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.outcome-kicker {
  font-size: 11px;
  color: #93f5dc;
}

.outcome-val {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}

.outcome-ux {
  margin: 0;
  font-size: 13px;
  color: #cde8e2;
}

@media (max-width: 960px) {
  .sim-tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .sim-tabs {
    grid-template-columns: 1fr;
  }
}
</style>
