<script setup lang="ts">
import { skills, fullStackBridge } from '../data/skills'
import { profile } from '../data/profile'
</script>
<template>
  <section id="evolution" class="evolution-section section" aria-labelledby="evolution-title">
    <div class="container">
      <div class="section-heading">
        <div>
          <p class="eyebrow">能力演化</p>
          <h2 id="evolution-title">
            不是技能叠加。<br /><span class="accent">是责任边界的延伸。</span>
          </h2>
        </div>
        <p class="section-description">
          从把一个页面做好，到组织复杂系统，再到约束 AI 交付。每一次延伸，都来自真实工程问题。
        </p>
      </div>
      <ol class="evolution-timeline">
        <li v-for="stage in skills" :key="stage.number">
          <div class="evolution-time">
            <span class="timeline-dot" aria-hidden="true"></span><span>{{ stage.period }}</span>
          </div>
          <div class="evolution-stage">
            <p class="evolution-word">{{ stage.english }}</p>
            <h3>{{ stage.title }}</h3>
            <p>{{ stage.summary }}</p>
            <a :href="stage.href" class="evolution-evidence"
              >{{ stage.evidence }} <span aria-hidden="true">↗</span></a
            >
          </div>
        </li>
      </ol>
      <p class="fullstack-bridge">{{ fullStackBridge }}</p>
      <div class="ownership-statement">
        <p class="eyebrow">我的构建方式</p>
        <h3>代码可以生成，<br /><span>交付需要判断。</span></h3>
        <ol aria-label="我的交付责任链">
          <li v-for="(step, index) in profile.ownership" :key="step">
            <span class="decorative" aria-hidden="true">0{{ index + 1 }}</span
            >{{ step }}
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
