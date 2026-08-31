<script setup lang="ts">
import { ref } from 'vue'
import { novaWing } from '../data/projects'
import AppIcon from '../components/AppIcon.vue'
import MediaDialog from '../components/MediaDialog.vue'
const media = ref<InstanceType<typeof MediaDialog>>()
const active = ref(0)
const showDemo = () =>
  media.value?.open({
    kind: 'video',
    src: novaWing.demo.src,
    poster: novaWing.demo.poster,
    title: 'NovaWing · 13 分钟真实演示',
  })
</script>
<template>
  <video class="demo-preload" preload="auto" muted playsinline aria-hidden="true" tabindex="-1">
    <source :src="novaWing.demo.src" type="video/mp4" />
  </video>
  <section id="novawing" class="nova-section section" aria-labelledby="nova-title">
    <div class="container">
      <div class="case-kicker">
        <p class="eyebrow">01 / 重点项目</p>
        <span>{{ novaWing.period }} · {{ novaWing.role }}</span>
      </div>
      <div class="nova-title-row">
        <p class="nova-brand">{{ novaWing.title }}<span>Development Guardian</span></p>
        <span class="nova-star" aria-hidden="true">✳</span>
      </div>
      <div class="nova-intro">
        <h2 id="nova-title">
          AI 不应该<br />自己给自己的作业<br /><span class="accent">打满分。</span>
        </h2>
        <div>
          <p>{{ novaWing.description }}</p>
          <div class="case-actions">
            <button class="button button-primary" @click="showDemo">
              <AppIcon name="play" :size="18" />查看演示 <span>13 分钟</span></button
            ><a
              class="text-link"
              :href="novaWing.links.showcase"
              target="_blank"
              rel="noopener noreferrer"
              >GitHub 项目介绍<AppIcon name="external" :size="17"
            /></a>
          </div>
          <p class="evidence-boundary">
            独立研发 / 持续迭代 · 公开高层设计与真实运行证据，核心源码私有。
          </p>
        </div>
      </div>
      <div class="nova-evidence">
        <div class="evidence-toolbar">
          <span class="evidence-mark"><span class="status-dot"></span>真实运行证据</span
          ><span class="decorative" aria-hidden="true">证据，而非口号</span>
        </div>
        <div class="evidence-tabs" aria-label="选择运行证据">
          <button
            v-for="(item, i) in novaWing.evidence"
            :key="item.id"
            :aria-pressed="active === i"
            @click="active = i"
          >
            <span aria-hidden="true">0{{ i + 1 }}</span
            >{{ item.label }}
          </button>
        </div>
        <template v-for="(item, i) in novaWing.evidence" :key="item.id">
          <figure v-if="active === i" class="evidence-figure">
            <div
              class="evidence-image-scroll"
              tabindex="0"
              :aria-label="item.label + '真实截图，窄屏可横向滑动'"
            >
              <img
                :src="item.image"
                :srcset="
                  item.image.replace('.webp', '-660.webp') + ' 660w, ' + item.image + ' 1320w'
                "
                sizes="(max-width: 600px) 1320px, (max-width: 1400px) 90vw, 1200px"
                :width="item.width"
                :height="item.height"
                :alt="item.alt"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.text }}</p>
              </div>
              <button
                class="text-link zoom-button"
                @click="
                  media?.open({ kind: 'image', src: item.image, alt: item.alt, title: item.label })
                "
              >
                查看原尺寸 <AppIcon name="external" :size="18" />
              </button>
            </figcaption>
          </figure>
        </template>
        <p class="image-note">
          真实界面局部裁切，未重绘或改写数据。<span class="mobile-note"
            >左右滑动截图可读日志，或打开原尺寸。</span
          >
        </p>
      </div>
      <div class="nova-reasoning">
        <div>
          <h4>问题 / 谁来验收？</h4>
          <p>{{ novaWing.problem }}</p>
          <div class="old-flow">执行 → 自测 → 自我宣布完成 <span aria-hidden="true">↛</span></div>
        </div>
        <div>
          <h4>设计 / 分离职责。</h4>
          <p>{{ novaWing.solution }}</p>
        </div>
      </div>
      <ol class="guardian-flow" aria-label="NovaWing 高层治理流程">
        <li v-for="(step, i) in novaWing.flow" :key="step.english">
          <span class="flow-index" aria-hidden="true">0{{ i + 1 }}</span
          ><strong>{{ step.label }}</strong
          ><span class="decorative" aria-hidden="true">{{ step.english }}</span>
        </li>
      </ol>
      <div class="nova-bottom">
        <p>不是让 AI 多写代码，是让每一步有证据、每个关键决定有归属。</p>
        <a
          class="text-link"
          :href="novaWing.links.project"
          target="_blank"
          rel="noopener noreferrer"
          >完整产品与架构 <AppIcon name="external" :size="17"
        /></a>
      </div>
      <button class="demo-strip" @click="showDemo">
        <img
          :src="novaWing.demo.poster"
          width="650"
          height="280"
          alt="NovaWing 录屏封面：当前活动与阶段日志"
          loading="lazy"
        /><span class="demo-copy"
          ><span class="eyebrow" aria-hidden="true">查看实际运行</span
          ><strong>看一段真实执行。</strong
          ><span>{{ novaWing.demo.description }} / {{ novaWing.demo.duration }}</span></span
        ><span class="demo-play"><AppIcon name="play" :size="24" /></span>
      </button>
    </div>
    <MediaDialog ref="media" />
  </section>
</template>
