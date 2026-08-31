<script setup lang="ts">
import { novaWing, projects } from '../data/projects'
import SectionHeading from '../components/SectionHeading.vue'
import AppIcon from '../components/AppIcon.vue'
</script>
<template>
  <section
    id="projects"
    class="section projects-section container"
    aria-labelledby="projects-heading"
  >
    <SectionHeading
      heading-id="projects-heading"
      number="01"
      eyebrow="SELECTED WORK"
      title="让工程能力，有迹可循。"
      description="三个代表方向：企业工程的深度，端到端交付的广度，以及 AI 工程化的实践。"
    />
    <article id="novawing" class="featured-project">
      <div class="featured-content">
        <div class="project-overline">
          <span class="small-pill">核心项目</span><span>{{ novaWing.eyebrow }}</span>
        </div>
        <h3>{{ novaWing.title }}<span class="project-star" aria-hidden="true">↗</span></h3>
        <p class="project-subtitle">{{ novaWing.subtitle }}</p>
        <p class="project-description">{{ novaWing.description }}</p>
        <ul class="nova-capabilities">
          <li v-for="item in novaWing.capabilities" :key="item.title">
            <AppIcon name="check" :size="16" />
            <div>
              <strong>{{ item.title }}</strong
              ><span>{{ item.text }}</span>
            </div>
          </li>
        </ul>
        <ul class="tags">
          <li v-for="tag in novaWing.tags" :key="tag">{{ tag }}</li>
        </ul>
        <div class="project-actions">
          <a
            class="button button-primary"
            :href="novaWing.links.project"
            target="_blank"
            rel="noopener noreferrer"
            >查看项目<AppIcon name="external" :size="17" /></a
          ><a
            class="text-link"
            :href="novaWing.links.showcase"
            target="_blank"
            rel="noopener noreferrer"
            ><AppIcon name="github" :size="17" />GitHub Showcase</a
          >
        </div>
      </div>
      <div class="project-visual">
        <div class="visual-header">
          <span class="window-dots"><i></i><i></i><i></i></span
          ><span>NOVAWING / DEVELOPMENT GUARDIAN</span>
        </div>
        <a
          class="project-cover"
          :href="novaWing.links.demo"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="观看 NovaWing 真实运行 Demo（新窗口打开）"
          ><img
            :src="novaWing.image"
            :alt="novaWing.imageAlt"
            width="1440"
            height="900"
            loading="lazy"
            decoding="async" /><span class="play-label"
            ><AppIcon name="play" :size="16" />观看真实运行 Demo<AppIcon
              name="external"
              :size="16" /></span
        ></a>
        <div class="visual-caption">
          <span class="caption-dot"></span>真实界面 · Work Session / Final Review
        </div>
        <div class="review-principle">
          <span>THE PRINCIPLE</span>
          <p>不是「AI 说完成了」<br /><strong>而是「有证据证明完成了」</strong></p>
        </div>
      </div>
      <div class="nova-flow" aria-label="NovaWing 工程闭环">
        <span>可验证的研发闭环</span>
        <ol>
          <li v-for="(step, index) in novaWing.flow" :key="step">
            <span>{{ step }}</span
            ><AppIcon v-if="index < novaWing.flow.length - 1" :size="13" />
          </li>
        </ol>
      </div>
    </article>
    <div class="project-grid">
      <article
        v-for="project in projects"
        :id="project.id"
        :key="project.id"
        class="secondary-project"
      >
        <div class="secondary-top">
          <span>{{ project.number }} / {{ project.eyebrow }}</span
          ><AppIcon :name="project.id === 'enterprise' ? 'layers' : 'code'" :size="23" />
        </div>
        <h3>{{ project.title }}</h3>
        <p class="secondary-subtitle">{{ project.subtitle }}</p>
        <p class="project-description">{{ project.description }}</p>
        <dl class="project-points">
          <div v-for="item in project.capabilities" :key="item.title">
            <dt>{{ item.title }}</dt>
            <dd>{{ item.text }}</dd>
          </div>
        </dl>
        <ul class="tags">
          <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
        </ul>
        <span class="project-footnote">能力方向展示 / 具体案例可进一步交流</span>
      </article>
    </div>
  </section>
</template>
