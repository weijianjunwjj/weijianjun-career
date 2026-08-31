<script setup lang="ts">
import { articles, openSource } from '../data/articles'
import { links } from '../data/links'
import AppIcon from '../components/AppIcon.vue'
</script>
<template>
  <section id="writing" class="writing-section section" aria-labelledby="writing-title">
    <div class="container">
      <div class="section-heading">
        <div>
          <p class="eyebrow">开源与文章</p>
          <h2 id="writing-title">
            把经验，<span class="writing-title-tail">变成可复用的东西。</span>
          </h2>
        </div>
        <a class="text-link" :href="links.github" target="_blank" rel="noopener noreferrer"
          >GitHub 主页<AppIcon name="external" :size="17"
        /></a>
      </div>
      <div class="writing-layout">
        <a
          v-for="article in articles"
          :key="article.title"
          class="writing-feature"
          :href="article.href"
          target="_blank"
          rel="noopener noreferrer"
          ><p class="writing-type">{{ article.source }} / {{ article.type }}</p>
          <span class="writing-symbol" aria-hidden="true">{ }</span>
          <h3>{{ article.title }}</h3>
          <p>{{ article.summary }}</p>
          <span class="text-link">{{ article.action }}<AppIcon name="external" :size="18" /></span
        ></a>
        <div class="opensource-list">
          <a
            v-for="item in openSource"
            :key="item.title"
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
            ><div>
              <span class="writing-type">{{ item.type }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.summary }}</p>
            </div>
            <AppIcon name="external" :size="20"
          /></a>
        </div>
      </div>
    </div>
  </section>
</template>
