<script setup lang="ts">
import { links } from '../data/links'
import { profile } from '../data/profile'
import AppIcon from '../components/AppIcon.vue'
import ResumeLink from '../components/ResumeLink.vue'
</script>
<template>
  <section id="contact" class="contact-section container">
    <p class="eyebrow">LET’S BUILD SOMETHING MEANINGFUL</p>
    <h2>想进一步了解？</h2>
    <p>从项目、代码和技术思考，开始一次有内容的交流。</p>
    <div class="contact-actions">
      <a
        class="button button-primary"
        :href="links.novaProject"
        target="_blank"
        rel="noopener noreferrer"
        >查看 NovaWing<AppIcon name="external" :size="17" /></a
      ><a
        class="button button-secondary"
        :href="links.github"
        target="_blank"
        rel="noopener noreferrer"
        ><AppIcon name="github" :size="18" />查看 GitHub</a
      ><a
        class="button button-secondary"
        :href="links.articles"
        target="_blank"
        rel="noopener noreferrer"
        >查看技术文章<AppIcon name="external" :size="17" /></a
      ><ResumeLink label="下载简历" />
    </div>
    <span class="contact-note">当前公开入口如上，更多履历信息可待进一步交流。</span>
  </section>
  <footer class="container footer">
    <a href="#top"
      >{{ profile.name }}<span>{{ profile.brand }}</span></a
    >
    <p>认真定义问题。可靠完成交付。</p>
    <a href="#top" class="back-top">回到顶部 ↑</a>
  </footer>
</template>
