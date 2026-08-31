<script setup lang="ts">
import { ref } from 'vue'
import { profile } from '../data/profile'
import { links } from '../data/links'
import ResumeLink from '../components/ResumeLink.vue'
import AppIcon from '../components/AppIcon.vue'
const message = ref('')
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    message.value = '邮箱已复制。'
  } catch {
    message.value = '未能自动复制，请选择上方邮箱手动复制。'
  }
}
</script>
<template>
  <section id="contact" class="contact-section section" aria-labelledby="contact-title">
    <div class="container">
      <p class="eyebrow">一起解决下一个问题</p>
      <div class="contact-grid">
        <div>
          <h2 id="contact-title">下一个值得解决的<br /><span class="accent">问题，聊聊？</span></h2>
          <p>
            如果你需要连接复杂前端、全栈交付与 AI 工程化的人，<br
              class="desktop-break"
            />欢迎从一次具体的交流开始。
          </p>
          <a class="contact-email" :href="'mailto:' + profile.email"
            >{{ profile.email }}<AppIcon name="arrow" :size="26"
          /></a>
          <div class="email-actions">
            <button class="text-link" @click="copyEmail">复制邮箱</button
            ><a class="text-link" :href="'mailto:' + profile.email">发送邮件 ↗</a>
          </div>
          <p class="copy-status" role="status" aria-live="polite">{{ message }}</p>
        </div>
        <aside class="resume-panel" aria-labelledby="resume-title">
          <span class="resume-index" aria-hidden="true">↗</span>
          <p class="eyebrow">完整履历</p>
          <h3 id="resume-title">先看完整简历。</h3>
          <p>工作经历、项目细节与联系方式。<br />一份 PDF，便于保存和转发。</p>
          <ResumeLink label="下载简历 PDF" /><a
            class="text-link"
            :href="links.resume"
            target="_blank"
            rel="noopener noreferrer"
            >在线阅读简历<AppIcon name="external" :size="17"
          /></a>
        </aside>
      </div>
    </div>
  </section>
</template>
