<script setup lang="ts">
import { experience, experienceNote } from '../data/experience'
import { profile } from '../data/profile'
import SectionHeading from '../components/SectionHeading.vue'
import ResumeLink from '../components/ResumeLink.vue'
</script>
<template>
  <section id="experience" class="section container experience-section">
    <div class="experience-intro">
      <SectionHeading number="04" eyebrow="EXPERIENCE" title="来自真实业务，走向更完整的交付。" />
      <p>{{ profile.experienceSummary }}<br />企业项目积累是基础，AI 工程实践是延伸。</p>
      <ResumeLink /><small>{{ experienceNote }}</small>
    </div>
    <ol class="timeline">
      <li v-for="item in experience" :key="item.stage">
        <span class="timeline-dot"></span>
        <p class="timeline-stage">{{ item.stage }}</p>
        <h3>{{ item.role }}</h3>
        <p class="timeline-description">{{ item.direction }}</p>
        <div class="timeline-tags">
          <span v-for="tag in item.capabilities" :key="tag">{{ tag }}</span>
        </div>
      </li>
    </ol>
  </section>
</template>
