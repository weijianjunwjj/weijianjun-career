<script setup lang="ts">
import { selectedWork } from '../data/projects'
import AppIcon from '../components/AppIcon.vue'
</script>
<template>
  <section id="work" class="container work-index" aria-labelledby="work-title">
    <div class="section-top">
      <p class="eyebrow">01 / 代表作品</p>
      <h2 id="work-title">真实问题。<br /><span class="muted">具体的工程回答。</span></h2>
    </div>
    <div class="work-links">
      <a v-for="item in selectedWork" :key="item.number" :href="item.href"
        ><span class="work-number">{{ item.number }}</span
        ><span
          ><strong>{{ item.title }}</strong
          ><small>{{ item.category }}</small></span
        ><AppIcon name="external" :size="28"
      /></a>
    </div>
  </section>
</template>
