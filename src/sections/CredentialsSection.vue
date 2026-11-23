<script setup lang="ts">
import AppIcon from '../components/AppIcon.vue'
import { articles, openSource } from '../data/articles.ts'
import { education, experience, languageSkill } from '../data/experience.ts'
import { links } from '../data/links.ts'
</script>

<template>
  <section id="credentials" class="section-block">
    <div class="container">
      <header class="section-header" data-reveal>
        <span class="eyebrow">
          <span class="eyebrow-dot" />
          <span>VERIFIED CREDENTIALS &amp; OPEN SOURCE</span>
        </span>
        <h2 class="section-title">职业经历、教育背景与工程开源沉淀</h2>
        <p class="section-lead">
          所有履历时间线、职责描述与教育信息均与投递简历完全一致；开源包与掘金专栏均由真实企业痛点抽象而来。
        </p>
      </header>

      <div class="credentials-grid">
        <!-- Left: Experience & Education -->
        <div class="experience-column" data-reveal>
          <div class="timeline-list">
            <article v-for="job in experience" :key="job.company" class="glass-panel job-card">
              <div class="job-top">
                <div>
                  <h3 class="job-company">{{ job.company }}</h3>
                  <p class="job-meta">{{ job.role }} · {{ job.department }}</p>
                </div>
                <span class="mono job-period">{{ job.period }}</span>
              </div>

              <ul class="job-highlights">
                <li v-for="line in job.highlights" :key="line">{{ line }}</li>
              </ul>

              <div class="tag-row">
                <span v-for="tech in job.stack" :key="tech" class="tech-chip">{{ tech }}</span>
              </div>
            </article>
          </div>

          <div class="glass-panel edu-card">
            <div class="edu-header">
              <span class="eyebrow">EDUCATION</span>
              <span class="edu-lang">{{ languageSkill }}</span>
            </div>
            <div class="edu-list">
              <div v-for="edu in education" :key="edu.school" class="edu-row">
                <div>
                  <p class="edu-school">{{ edu.school }}</p>
                  <p class="edu-detail">{{ edu.major }} · {{ edu.degree }}</p>
                </div>
                <span class="mono edu-period">{{ edu.period }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Open Source & Writing -->
        <aside class="assets-column" data-reveal>
          <div class="glass-panel assets-panel">
            <div class="assets-head">
              <div>
                <span class="eyebrow">OPEN SOURCE &amp; WRITING</span>
                <h3 class="assets-title">npm 开源工程资产与专栏</h3>
              </div>
              <a
                :href="links.repositories"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-link btn-sm"
              >
                <span>全部仓库</span>
                <AppIcon name="arrow-up-right" :size="13" />
              </a>
            </div>

            <div class="pub-list">
              <a
                v-for="item in [...openSource, ...articles]"
                :key="item.title"
                :href="item.href"
                target="_blank"
                rel="noopener noreferrer"
                class="pub-item"
              >
                <div class="pub-top">
                  <span class="pub-title mono">{{ item.title }}</span>
                  <span class="badge">{{ item.type }}</span>
                </div>
                <p class="pub-summary">{{ item.summary }}</p>
                <span class="pub-action">
                  <span>{{ item.source }} · {{ item.action }}</span>
                  <AppIcon name="arrow-up-right" :size="13" />
                </span>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.credentials-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.9fr);
  gap: 20px;
  align-items: start;
}

.experience-column {
  display: grid;
  gap: 16px;
}

.timeline-list {
  display: grid;
  gap: 14px;
}

.job-card {
  padding: 22px;
  display: grid;
  gap: 12px;
}

.job-top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.job-company {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--ink-primary);
}

.job-meta {
  margin: 3px 0 0;
  font-size: 13px;
  color: var(--cyan);
}

.job-period {
  font-size: 12px;
  padding: 4px 9px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--line-subtle);
  background: rgba(6, 11, 24, 0.72);
  color: var(--ink-secondary);
}

.job-highlights {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 7px;
  font-size: 13.5px;
  color: #cad7ef;
}

.job-highlights li::marker {
  color: var(--cyan);
}

.edu-card {
  padding: 20px 22px;
  display: grid;
  gap: 14px;
}

.edu-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.edu-lang {
  font-size: 12px;
  color: var(--ink-muted);
}

.edu-list {
  display: grid;
  gap: 12px;
}

.edu-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--line-subtle);
}

.edu-row:first-child {
  padding-top: 0;
  border-top: 0;
}

.edu-school {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-primary);
}

.edu-detail {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--ink-secondary);
}

.edu-period {
  font-size: 12.5px;
  color: var(--cyan);
}

.assets-panel {
  padding: 22px;
  display: grid;
  gap: 16px;
}

.assets-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
}

.assets-title {
  margin: 4px 0 0;
  font-size: 18px;
  color: var(--ink-primary);
}

.pub-list {
  display: grid;
  gap: 10px;
}

.pub-item {
  display: grid;
  gap: 6px;
  padding: 14px 15px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(148, 179, 255, 0.12);
  background: rgba(6, 11, 24, 0.72);
  transition:
    border-color 0.2s var(--ease-out),
    transform 0.2s var(--ease-out);
}

.pub-item:hover {
  border-color: var(--cyan-line);
  transform: translateY(-1px);
}

.pub-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.pub-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink-primary);
}

.pub-summary {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--ink-secondary);
}

.pub-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--cyan);
  font-weight: 500;
}

@media (max-width: 980px) {
  .credentials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
