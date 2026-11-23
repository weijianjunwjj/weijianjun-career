<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import ResumeLink from '../components/ResumeLink.vue'
import { links } from '../data/links.ts'
import { profile } from '../data/profile.ts'
import { RESUME_FILENAME } from '../data/siteConfig.ts'

const copiedKey = ref<'email' | 'phone' | null>(null)

async function copyText(key: 'email' | 'phone', value: string) {
  try {
    await navigator.clipboard.writeText(value)
    copiedKey.value = key
    window.setTimeout(() => {
      if (copiedKey.value === key) copiedKey.value = null
    }, 2000)
  } catch {
    copiedKey.value = null
  }
}
</script>

<template>
  <section id="contact" class="section-block contact-section">
    <div class="container">
      <div class="glass-panel contact-panel" data-reveal>
        <div class="contact-copy">
          <span class="eyebrow">
            <span class="eyebrow-dot" />
            <span>READY FOR HIGH-IMPACT ENGINEERING</span>
          </span>
          <h2 class="contact-title">{{ profile.statement }}</h2>
          <p class="contact-desc">
            如果你正在寻找一位既能啃下复杂中后台/小程序/微前端老系统治理、又能把 AI 应用与 Agent 工作流真正落地的资深前端工程师，欢迎直接联系或查看完整工程项目体验中心。
          </p>

          <div class="contact-actions">
            <a :href="links.work" class="btn btn-primary">
              <span>前往工程项目体验中心</span>
              <AppIcon name="arrow-up-right" :size="15" />
            </a>
            <ResumeLink label="下载简历 (PDF)" variant="portal" />
            <a
              :href="links.github"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost"
            >
              <AppIcon name="github" :size="15" />
              <span>GitHub 主页</span>
            </a>
          </div>
          <p class="mono resume-file-hint">统一简历文件：{{ RESUME_FILENAME }}</p>
        </div>

        <div class="contact-cards">
          <div class="channel-card">
            <div class="channel-info">
              <span class="mono channel-label">EMAIL</span>
              <a :href="`mailto:${profile.email}`" class="channel-value mono">{{ profile.email }}</a>
            </div>
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              @click="copyText('email', profile.email)"
            >
              <AppIcon :name="copiedKey === 'email' ? 'check' : 'copy'" :size="14" />
              <span>{{ copiedKey === 'email' ? '已复制' : '复制邮箱' }}</span>
            </button>
          </div>

          <div class="channel-card">
            <div class="channel-info">
              <span class="mono channel-label">PHONE / WECHAT</span>
              <a :href="`tel:${profile.phone}`" class="channel-value mono">{{ profile.phone }}</a>
            </div>
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              @click="copyText('phone', profile.phone)"
            >
              <AppIcon :name="copiedKey === 'phone' ? 'check' : 'copy'" :size="14" />
              <span>{{ copiedKey === 'phone' ? '已复制' : '复制电话' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  padding-bottom: clamp(48px, 6vw, 80px);
}

.contact-panel {
  padding: clamp(24px, 3.4vw, 40px);
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.85fr);
  gap: clamp(22px, 3vw, 40px);
  align-items: center;
  border-color: rgba(56, 232, 255, 0.24);
  background:
    radial-gradient(60% 90% at 100% 0%, rgba(56, 232, 255, 0.1), transparent 65%),
    var(--bg-glass);
}

.contact-copy {
  display: grid;
  gap: 14px;
}

.contact-title {
  margin: 0;
  font-size: clamp(22px, 2.8vw, 32px);
  line-height: 1.22;
  color: var(--ink-primary);
}

.contact-desc {
  margin: 0;
  font-size: 14.5px;
  color: var(--ink-secondary);
}

.contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 4px;
}

.resume-file-hint {
  margin: 0;
  font-size: 12px;
  color: var(--ink-muted);
}

.contact-cards {
  display: grid;
  gap: 12px;
}

.channel-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line-subtle);
  background: rgba(6, 11, 24, 0.78);
}

.channel-info {
  display: grid;
  gap: 3px;
}

.channel-label {
  font-size: 11px;
  color: var(--cyan);
  letter-spacing: 0.08em;
}

.channel-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-primary);
}

@media (max-width: 960px) {
  .contact-panel {
    grid-template-columns: 1fr;
  }
}
</style>
