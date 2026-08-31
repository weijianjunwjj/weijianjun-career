<script setup lang="ts">
import { profile } from '../data/profile'
import { links } from '../data/links'
import AppIcon from '../components/AppIcon.vue'
import ResumeLink from '../components/ResumeLink.vue'
</script>
<template>
  <section class="hero container" aria-labelledby="hero-title">
    <div class="hero-kicker">
      <p class="eyebrow"><span class="status-dot"></span>工程师 · 构建者 · 问题解决者</p>
      <span class="decorative">个人作品集 / 2026</span>
    </div>
    <div class="hero-grid">
      <div class="hero-type">
        <h1 id="hero-title">
          <span>{{ profile.headline[0] }}</span
          ><span class="accent">{{ profile.headline[1] }}<i aria-hidden="true">↗</i></span
          ><span>{{ profile.headline[2] }}</span>
        </h1>
        <div class="hero-baseline">
          <span>前端</span><span aria-hidden="true">→</span><span>全栈</span
          ><span aria-hidden="true">→</span><span>AI Agent</span>
        </div>
      </div>
      <div class="hero-profile">
        <p class="hero-name">
          {{ profile.name }}<span>{{ profile.englishName }}</span>
        </p>
        <p class="hero-role">{{ profile.role }}</p>
        <p class="hero-chinese-role">{{ profile.chineseRole }}</p>
        <div class="hero-intro">
          <p>{{ profile.intro }}</p>
          <p>{{ profile.description }}</p>
        </div>
        <p class="experience-signal">
          <span>{{ profile.experience }}</span
          ><span>从真实业务，到可信交付</span>
        </p>
        <div class="hero-actions">
          <a class="button button-primary" href="#work">查看作品<AppIcon :size="20" /></a
          ><ResumeLink /><a
            class="hero-github"
            :href="links.github"
            target="_blank"
            rel="noopener noreferrer"
            ><AppIcon name="github" :size="20" />GitHub<AppIcon name="external" :size="16"
          /></a>
        </div>
      </div>
    </div>
    <div class="hero-end">
      <span>让作品，先于自我评价。</span
      ><a href="#work">浏览代表作品<span aria-hidden="true">↓</span></a>
    </div>
  </section>
</template>
