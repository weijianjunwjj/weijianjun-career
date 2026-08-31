<script setup lang="ts">
import { articles, openSource } from '../data/articles'
import SectionHeading from '../components/SectionHeading.vue'
import AppIcon from '../components/AppIcon.vue'
</script>
<template>
  <section id="writing" class="section container writing-section">
    <SectionHeading
      number="03"
      eyebrow="OPEN SOURCE & WRITING"
      title="把实践留下，也把思考公开。"
      description="项目证据与技术表达，是了解一个工程师的另一条路径。"
    />
    <div class="writing-list">
      <a
        v-for="item in [...articles, ...openSource]"
        :key="item.href"
        :href="item.href"
        target="_blank"
        rel="noopener noreferrer"
        class="writing-row"
        ><div class="writing-source">
          <span>{{ item.source }}</span
          ><small>{{ item.type }}</small>
        </div>
        <div class="writing-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
        </div>
        <span class="writing-action">{{ item.action }}<AppIcon name="external" :size="21" /></span
      ></a>
    </div>
  </section>
</template>
