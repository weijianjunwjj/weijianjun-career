<script setup lang="ts">
import { experience, education } from '../data/experience'
import ResumeLink from '../components/ResumeLink.vue'
</script>
<template>
  <section
    id="experience"
    class="experience-section section container"
    aria-labelledby="experience-title"
  >
    <div class="section-heading">
      <div>
        <p class="eyebrow">职业经历</p>
        <h2 id="experience-title">在真实业务中，<br />积累工程判断。</h2>
      </div>
      <ResumeLink label="完整履历 · 下载 PDF" />
    </div>
    <ol class="experience-list">
      <li v-for="job in experience" :key="job.company">
        <div class="experience-date">
          {{ job.period }}<span>{{ job.role }}</span>
        </div>
        <div>
          <h3>{{ job.company }}</h3>
          <p class="experience-focus">{{ job.focus }}</p>
          <p>{{ job.highlights }}</p>
        </div>
      </li>
    </ol>
    <div class="education-row">
      <h3>教育背景</h3>
      <ul>
        <li v-for="entry in education" :key="entry.school">
          <strong>{{ entry.school }}</strong
          ><span>{{ entry.degree }}</span
          ><span>{{ entry.period }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
