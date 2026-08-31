<script setup lang="ts">
import { profile } from '../data/profile'
import { links } from '../data/links'
import AppIcon from '../components/AppIcon.vue'
import ResumeLink from '../components/ResumeLink.vue'
</script>
<template>
  <section class="hero container" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow hero-eyebrow">
        <span class="status-dot"></span>{{ profile.englishName }}
        <span class="eyebrow-divider">/</span> {{ profile.name }}
      </p>
      <h1 id="hero-title">
        {{ profile.role }}<span class="role-separator"> · </span><br class="desktop-break" /><span
          class="accent"
          >{{ profile.focusParts[0] }}</span
        >{{ profile.focusParts[1] }}<br class="mobile-break" /><span class="accent">{{
          profile.focusParts[2]
        }}</span>
      </h1>
      <p class="hero-intro">{{ profile.intro }}</p>
      <p class="hero-description">{{ profile.description }}</p>
      <ul class="tags hero-tags" aria-label="核心能力">
        <li v-for="tag in profile.tags" :key="tag">{{ tag }}</li>
      </ul>
      <div class="hero-actions">
        <a class="button button-primary" href="#projects">查看代表项目<AppIcon :size="18" /></a
        ><ResumeLink /><a
          class="github-link"
          :href="links.github"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub（新窗口打开）"
          ><AppIcon name="github" />GitHub<AppIcon name="external" :size="15"
        /></a>
      </div>
    </div>
    <aside class="hero-note" aria-label="工程价值主张">
      <span class="note-index">ENGINEERING PERSPECTIVE</span>
      <div class="note-line"></div>
      <p>从界面，<br />到系统，<br />到<span>可信交付。</span></p>
      <span class="note-caption">Build with intent.<br />Deliver with evidence.</span
      ><a href="#why">我的工程视角 <AppIcon name="external" :size="18" /></a>
    </aside>
    <div class="value-strip">
      <div v-for="pillar in profile.pillars" :key="pillar.number">
        <span>{{ pillar.number }}</span>
        <section>
          <h2>{{ pillar.title }}</h2>
          <p>{{ pillar.text }}</p>
        </section>
      </div>
    </div>
  </section>
</template>
