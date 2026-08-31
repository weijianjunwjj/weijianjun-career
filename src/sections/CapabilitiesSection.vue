<script setup lang="ts">
import { skills } from '../data/skills'
import SectionHeading from '../components/SectionHeading.vue'
</script>
<template>
  <section id="capabilities" class="section container">
    <SectionHeading
      number="02"
      eyebrow="CAPABILITY MAP"
      title="以扎实前端为起点，不止于前端。"
      description="不以技能百分比定义能力，而以能解决什么问题来组织经验。"
    />
    <div class="capability-grid">
      <article v-for="skill in skills" :key="skill.number">
        <span class="capability-number">{{ skill.number }}</span>
        <h3>{{ skill.title }}</h3>
        <span class="capability-english">{{ skill.english }}</span>
        <p>{{ skill.summary }}</p>
        <ul class="skill-list">
          <li v-for="item in skill.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>
