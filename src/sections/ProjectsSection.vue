<script setup lang="ts">
import { projects } from '../data/projects'
import AppIcon from '../components/AppIcon.vue'
const analytics = projects[0]!
const offerflow = projects[1]!
</script>
<template>
  <section class="engineering-section section" aria-labelledby="engineering-title">
    <div class="container">
      <div class="section-heading">
        <div>
          <p class="eyebrow">工程实践</p>
          <h2 id="engineering-title">复杂问题，<br />有结构地解决。</h2>
        </div>
        <p class="section-description">
          从企业系统里的渐进治理，到独立 AI 产品的端到端交付。不同场景，同样重视边界与结果。
        </p>
      </div>
      <article
        id="analytics"
        class="engineering-case analytics-case"
        aria-labelledby="analytics-title"
      >
        <div class="engineering-aside">
          <p class="eyebrow">02 / 企业级工程</p>
          <h3 id="analytics-title">{{ analytics.title }}</h3>
          <p class="case-role">{{ analytics.role }}<br />{{ analytics.period }}</p>
          <p>{{ analytics.context }}</p>
          <figure class="schema-visual">
            <figcaption>数据链路 · 结构示意</figcaption>
            <div class="schema-source">字段 Schema<span>组件类型 / 操作符 / 校验规则</span></div>
            <span class="diagram-arrow" aria-hidden="true">↓</span>
            <div class="schema-layer">adapter / mapper / resolver</div>
            <span class="diagram-arrow" aria-hidden="true">↓</span>
            <div class="schema-outputs">
              <span>列表</span><span>聚合</span><span>明细</span><span>导出</span>
            </div>
          </figure>
          <ul class="stack" aria-label="技术栈">
            <li v-for="tech in analytics.stack" :key="tech">{{ tech }}</li>
          </ul>
        </div>
        <div class="engineering-detail">
          <div>
            <h4>工程问题</h4>
            <p>{{ analytics.problem }}</p>
          </div>
          <div>
            <h4>我负责的实现</h4>
            <ul class="built-list">
              <li v-for="item in analytics.built" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div>
            <h4>关键决策</h4>
            <p>{{ analytics.decision }}</p>
          </div>
          <div class="case-outcome">
            <h4>结果与沉淀</h4>
            <p>{{ analytics.outcome }}</p>
          </div>
        </div>
      </article>
      <article
        id="offerflow"
        class="engineering-case offerflow-case"
        aria-labelledby="offerflow-title"
      >
        <div class="offerflow-head">
          <div>
            <p class="eyebrow">03 / 全栈 AI 产品</p>
            <h3 id="offerflow-title">{{ offerflow.title }}<span>AI 求职决策台</span></h3>
          </div>
          <p>{{ offerflow.role }}<br /><span class="muted">产品 / 前端 / 服务端 / 数据</span></p>
        </div>
        <p class="offerflow-thesis">
          让 AI 的回答，<br /><span class="accent">成为可持续使用的数据。</span>
        </p>
        <figure class="offerflow-visual">
          <figcaption>产品数据流 · 结构示意，非产品截图</figcaption>
          <ol>
            <li><strong>业务实体</strong><span>岗位 / 公司 / 流程</span></li>
            <li><strong>LLM + SSE</strong><span>流式分析 / 取消与异常</span></li>
            <li><strong>结构化结果</strong><span>技能 / 风险 / 行动建议</span></li>
            <li><strong>持久化与比较</strong><span>策略 / 版本 / 后续流程</span></li>
          </ol>
        </figure>
        <div class="offerflow-detail">
          <div>
            <h4>场景与问题</h4>
            <p>{{ offerflow.context }}{{ offerflow.problem }}</p>
            <h4>我的实现</h4>
            <ul class="built-list">
              <li v-for="item in offerflow.built" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div>
            <h4>工程选择</h4>
            <p>{{ offerflow.decision }}</p>
            <div class="case-outcome">
              <h4>交付价值</h4>
              <p>{{ offerflow.outcome }}</p>
            </div>
            <ul class="stack" aria-label="技术栈">
              <li v-for="tech in offerflow.stack" :key="tech">{{ tech }}</li>
            </ul>
            <a class="text-link" :href="offerflow.href" target="_blank" rel="noopener noreferrer"
              >查看公开仓库<AppIcon name="external" :size="17"
            /></a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
