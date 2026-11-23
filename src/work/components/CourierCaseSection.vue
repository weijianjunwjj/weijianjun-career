<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '../../components/AppIcon.vue'
import type { LightboxItem } from '../../components/MediaLightbox.vue'
import AsyncOrderSimulator from './AsyncOrderSimulator.vue'
import { courierCase, type CourierSubView, type EvidenceMedia, type VideoEvidence } from '../workData.ts'

defineProps<{
  subView: CourierSubView
}>()

const emit = defineEmits<{
  changeSubView: [view: CourierSubView]
  openMedia: [payload: { items: LightboxItem[]; startIndex: number; trigger: HTMLElement | null }]
}>()

const copiedMiniName = ref(false)

async function copyMiniName() {
  try {
    await navigator.clipboard.writeText(courierCase.miniProgramName)
    copiedMiniName.value = true
    window.setTimeout(() => {
      copiedMiniName.value = false
    }, 2000)
  } catch {
    copiedMiniName.value = false
  }
}

function openGallery(list: EvidenceMedia[], startIndex: number, event: MouseEvent) {
  emit('openMedia', {
    items: list.map((item) => ({
      kind: 'image',
      src: item.src,
      title: `${item.tag} · ${item.title}`,
      caption: item.caption,
      provenance: item.provenance,
      alt: item.alt,
    })),
    startIndex,
    trigger: event.currentTarget as HTMLElement | null,
  })
}

function openVideo(video: VideoEvidence, event: MouseEvent) {
  emit('openMedia', {
    items: [
      {
        kind: 'video',
        src: video.src,
        poster: video.poster,
        title: video.title,
        caption: video.description,
        provenance: video.provenance,
        chapters: video.chapters,
      },
    ],
    startIndex: 0,
    trigger: event.currentTarget as HTMLElement | null,
  })
}

function openQr(event: MouseEvent) {
  emit('openMedia', {
    items: [
      {
        kind: 'image',
        src: courierCase.qrCode.src,
        title: `「${courierCase.miniProgramName}」微信小程序码`,
        caption: courierCase.qrCode.caption,
        provenance: '线上真实小程序码原图',
        alt: courierCase.qrCode.alt,
      },
    ],
    startIndex: 0,
    trigger: event.currentTarget as HTMLElement | null,
  })
}
</script>

<template>
  <section id="case-courier" class="case-section">
    <div class="container case-stack">
      <!-- Case Header -->
      <header class="case-header glass-panel">
        <div class="case-header-top">
          <div class="case-badges">
            <span class="badge badge-cyan">{{ courierCase.number }} · {{ courierCase.tier }}</span>
            <span class="mono case-period">{{ courierCase.company }} · {{ courierCase.period }}</span>
          </div>
          <div class="subview-switch" role="tablist" aria-label="中邮通双端视角切换">
            <button
              type="button"
              role="tab"
              :aria-selected="subView === 'overview'"
              class="subview-btn"
              :class="{ 'is-active': subView === 'overview' }"
              @click="emit('changeSubView', 'overview')"
            >
              双端全景
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="subView === 'mini'"
              class="subview-btn"
              :class="{ 'is-active': subView === 'mini' }"
              @click="emit('changeSubView', 'mini')"
            >
              微信小程序（5 图 + 录屏 + 码）
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="subView === 'admin'"
              class="subview-btn"
              :class="{ 'is-active': subView === 'admin' }"
              @click="emit('changeSubView', 'admin')"
            >
              运营后台（4 图 + 51s 录屏）
            </button>
          </div>
        </div>

        <h2 class="case-title">{{ courierCase.title }}</h2>
        <p class="case-subtitle">{{ courierCase.subtitle }}</p>

        <div class="tag-row">
          <span v-for="tech in courierCase.stack" :key="tech" class="tech-chip">{{ tech }}</span>
        </div>

        <!-- 4-Step Cross-End Lifecycle -->
        <div class="lifecycle-grid">
          <article v-for="node in courierCase.crossEndFlow" :key="node.step" class="lifecycle-node">
            <div class="lifecycle-top">
              <span class="mono lifecycle-step">{{ node.step }}</span>
              <span class="badge">{{ node.side }}</span>
            </div>
            <h3 class="lifecycle-title">{{ node.title }}</h3>
            <p class="lifecycle-detail">{{ node.detail }}</p>
          </article>
        </div>
      </header>

      <!-- Mini-Program Evidence Block -->
      <div v-if="subView !== 'admin'" class="evidence-panel glass-panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">WECHAT MINI-PROGRAM · REAL DEVICE EVIDENCE</span>
            <h3 class="panel-title">逍遥邮微信小程序 · 扫码寄件、支付分先寄后付到扣款闭环</h3>
          </div>
          <div class="panel-actions">
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="openVideo(courierCase.miniVideo, $event)"
            >
              <AppIcon name="play" :size="14" />
              <span>播放真机脱敏录屏</span>
            </button>
          </div>
        </div>

        <!-- Video + QR Dual Hero Card -->
        <div class="mini-spotlight">
          <div class="video-trigger-card">
            <div class="video-thumb">
              <img
                :src="courierCase.miniVideo.poster"
                alt="逍遥邮微信小程序真机录屏封面"
              />
              <button
                type="button"
                class="play-overlay-btn"
                aria-label="播放逍遥邮微信小程序真机脱敏录屏"
                @click="openVideo(courierCase.miniVideo, $event)"
              >
                <AppIcon name="play" :size="20" />
                <span>观看真机录屏</span>
              </button>
            </div>
            <div class="video-info">
              <span class="badge badge-emerald">{{ courierCase.miniVideo.provenance }}</span>
              <h4 class="video-title">{{ courierCase.miniVideo.title }}</h4>
              <p class="video-desc">{{ courierCase.miniVideo.description }}</p>
              <div class="chapter-pills">
                <span
                  v-for="ch in courierCase.miniVideo.chapters"
                  :key="ch.label"
                  class="mono chapter-pill"
                >
                  {{ ch.timeText }} {{ ch.label }}
                </span>
              </div>
              <button
                type="button"
                class="btn btn-portal btn-sm"
                @click="openVideo(courierCase.miniVideo, $event)"
              >
                <AppIcon name="play" :size="14" />
                <span>打开分章播放器</span>
              </button>
            </div>
          </div>

          <aside class="qr-card">
            <button
              type="button"
              class="qr-img-btn"
              aria-label="放大查看逍遥邮微信小程序码"
              @click="openQr"
            >
              <img
                :src="courierCase.qrCode.src"
                :alt="courierCase.qrCode.alt"
              />
            </button>
            <div class="qr-meta">
              <span class="badge badge-cyan">真实线上小程序码</span>
              <p class="qr-name">小程序名称：{{ courierCase.miniProgramName }}</p>
              <p class="qr-caption">{{ courierCase.qrCode.caption }}</p>
              <button type="button" class="btn btn-ghost btn-sm" @click="copyMiniName">
                <AppIcon :name="copiedMiniName ? 'check' : 'copy'" :size="14" />
                <span>{{ copiedMiniName ? '已复制「逍遥邮」' : '复制小程序名称' }}</span>
              </button>
            </div>
          </aside>
        </div>

        <!-- 5 Real Phone Captures Strip -->
        <div class="phone-strip">
          <article
            v-for="(shot, idx) in courierCase.miniEvidence"
            :key="shot.id"
            class="phone-shot-card"
          >
            <div class="phone-bezel">
              <button
                type="button"
                class="phone-bezel-screen"
                :aria-label="`放大查看 ${shot.title}`"
                @click="openGallery(courierCase.miniEvidence, idx, $event)"
              >
                <img :src="shot.src" :alt="shot.alt" loading="lazy" width="420" height="910" />
              </button>
            </div>
            <div class="shot-copy">
              <span class="mono shot-tag">{{ shot.tag }}</span>
              <h4 class="shot-title">{{ shot.title }}</h4>
              <p class="shot-caption">{{ shot.caption }}</p>
            </div>
          </article>
        </div>
      </div>

      <!-- Admin Console Evidence Block -->
      <div v-if="subView !== 'mini'" class="evidence-panel glass-panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">VUE 3 + NAIVE UI ADMIN · HISTORICAL BACKEND MOCK RUN</span>
            <h3 class="panel-title">逍遥邮运营管理后台 · 订单检索、出账统计、双账单比对与权限</h3>
          </div>
          <div class="panel-actions">
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="openVideo(courierCase.adminVideo, $event)"
            >
              <AppIcon name="play" :size="14" />
              <span>播放 51 秒后台实录</span>
            </button>
          </div>
        </div>

        <div class="admin-video-banner">
          <div class="admin-video-info">
            <span class="badge badge-amber">{{ courierCase.adminVideo.provenance }}</span>
            <h4 class="video-title">{{ courierCase.adminVideo.title }}</h4>
            <p class="video-desc">{{ courierCase.adminVideo.description }}</p>
          </div>
          <button
            type="button"
            class="btn btn-portal btn-sm"
            @click="openVideo(courierCase.adminVideo, $event)"
          >
            <AppIcon name="play" :size="14" />
            <span>分章播放 ({{ courierCase.adminVideo.duration }})</span>
          </button>
        </div>

        <div class="admin-grid">
          <article
            v-for="(shot, idx) in courierCase.adminEvidence"
            :key="shot.id"
            class="desktop-shot-card"
          >
            <div class="optical-frame">
              <div class="optical-frame-bar">
                <span class="optical-dots"><span /><span /><span /></span>
                <span class="optical-bar-label">{{ shot.tag }} · {{ shot.provenance }}</span>
              </div>
              <button
                type="button"
                class="optical-media-btn"
                :aria-label="`放大查看 ${shot.title}`"
                @click="openGallery(courierCase.adminEvidence, idx, $event)"
              >
                <img :src="shot.src" :alt="shot.alt" loading="lazy" width="1320" height="820" />
                <span class="optical-zoom-hint">
                  <AppIcon name="expand" :size="12" />
                  <span>放大原图</span>
                </span>
              </button>
            </div>
            <div class="shot-copy">
              <h4 class="shot-title">{{ shot.title }}</h4>
              <p class="shot-caption">{{ shot.caption }}</p>
            </div>
          </article>
        </div>
      </div>

      <!-- Interactive Async Order State Machine -->
      <AsyncOrderSimulator />

      <!-- 4 Key Technical Decisions -->
      <div class="decisions-grid">
        <article
          v-for="item in courierCase.decisions"
          :key="item.index"
          class="glass-panel decision-card"
        >
          <span class="mono decision-index">DECISION {{ item.index }}</span>
          <h3 class="decision-title">{{ item.title }}</h3>
          <p class="decision-row"><strong>痛点：</strong>{{ item.problem }}</p>
          <p class="decision-row"><strong>决策：</strong>{{ item.decision }}</p>
          <p class="decision-outcome"><strong>结果：</strong>{{ item.outcome }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.case-section {
  padding-block: clamp(28px, 4vw, 52px);
}

.case-stack {
  display: grid;
  gap: 20px;
}

.case-header {
  padding: clamp(22px, 3vw, 32px);
  display: grid;
  gap: 16px;
  border-color: rgba(56, 232, 255, 0.26);
}

.case-header-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.case-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.case-period {
  font-size: 12px;
  color: var(--ink-muted);
}

.subview-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 4px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(148, 179, 255, 0.14);
  background: rgba(4, 8, 19, 0.8);
}

.subview-btn {
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--ink-secondary);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
}

.subview-btn.is-active {
  border-color: rgba(56, 232, 255, 0.45);
  background: rgba(56, 232, 255, 0.16);
  color: #ffffff;
  font-weight: 600;
}

.case-title {
  margin: 0;
  font-size: clamp(22px, 2.8vw, 32px);
  line-height: 1.22;
  color: var(--ink-primary);
}

.case-subtitle {
  margin: 0;
  font-size: 14.5px;
  color: var(--ink-secondary);
  max-width: 78ch;
}

.lifecycle-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding-top: 6px;
}

.lifecycle-node {
  padding: 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-subtle);
  background: rgba(5, 10, 22, 0.78);
  display: grid;
  gap: 6px;
  align-content: start;
}

.lifecycle-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.lifecycle-step {
  font-size: 12px;
  font-weight: 700;
  color: var(--cyan);
}

.lifecycle-title {
  margin: 0;
  font-size: 14px;
  color: var(--ink-primary);
}

.lifecycle-detail {
  margin: 0;
  font-size: 12.5px;
  color: var(--ink-secondary);
}

/* Evidence Panels */
.evidence-panel {
  padding: clamp(20px, 2.6vw, 30px);
  display: grid;
  gap: 20px;
}

.panel-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
}

.panel-title {
  margin: 4px 0 0;
  font-size: clamp(18px, 2.1vw, 22px);
  color: var(--ink-primary);
}

.mini-spotlight {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(0, 0.85fr);
  gap: 16px;
}

.video-trigger-card {
  display: grid;
  grid-template-columns: 136px minmax(0, 1fr);
  gap: 18px;
  padding: 18px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(56, 232, 255, 0.22);
  background: rgba(5, 10, 22, 0.82);
  align-items: center;
}

.video-thumb {
  position: relative;
  width: 136px;
  height: 238px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(148, 179, 255, 0.24);
  background: #ffffff;
}

.video-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.play-overlay-btn {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 0;
  background: rgba(4, 7, 17, 0.56);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s var(--ease-out);
}

.play-overlay-btn:hover {
  background: rgba(4, 7, 17, 0.38);
}

.video-info {
  display: grid;
  gap: 10px;
  justify-items: start;
}

.video-title {
  margin: 0;
  font-size: 16px;
  color: var(--ink-primary);
}

.video-desc {
  margin: 0;
  font-size: 13px;
  color: var(--ink-secondary);
}

.chapter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chapter-pill {
  padding: 3px 8px;
  border-radius: 5px;
  border: 1px solid var(--line-subtle);
  background: rgba(11, 19, 38, 0.8);
  font-size: 11.5px;
  color: #a6f4ff;
}

.qr-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line-subtle);
  background: rgba(5, 10, 22, 0.82);
}

.qr-img-btn {
  flex-shrink: 0;
  width: 148px;
  padding: 10px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(56, 232, 255, 0.34);
  background: #ffffff;
  cursor: zoom-in;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-img-btn img {
  width: 100%;
  height: auto;
  display: block;
}

.qr-meta {
  display: grid;
  gap: 6px;
  justify-items: start;
}

.qr-name {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink-primary);
}

.qr-caption {
  margin: 0;
  font-size: 12px;
  color: var(--ink-secondary);
}

/* 5 Phone Shots */
.phone-strip {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}

.phone-shot-card {
  display: grid;
  gap: 10px;
  align-content: start;
}

.phone-shot-card img {
  aspect-ratio: 9 / 19;
  object-fit: cover;
  object-position: top;
}

/* Admin Evidence */
.admin-video-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 18px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(56, 232, 255, 0.22);
  background: rgba(5, 10, 22, 0.82);
}

.admin-video-info {
  display: grid;
  gap: 5px;
  max-width: 72ch;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.desktop-shot-card {
  display: grid;
  gap: 10px;
  align-content: start;
}

.desktop-shot-card img {
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top left;
}

.shot-copy {
  display: grid;
  gap: 4px;
}

.shot-tag {
  font-size: 11px;
  color: var(--cyan);
}

.shot-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-primary);
}

.shot-caption {
  margin: 0;
  font-size: 12.5px;
  color: var(--ink-secondary);
}

/* Decisions */
.decisions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.decision-card {
  padding: 20px 22px;
  display: grid;
  gap: 9px;
  align-content: start;
}

.decision-index {
  font-size: 11px;
  color: var(--cyan);
  letter-spacing: 0.08em;
}

.decision-title {
  margin: 0;
  font-size: 16px;
  color: var(--ink-primary);
}

.decision-row {
  margin: 0;
  font-size: 13.5px;
  color: var(--ink-secondary);
}

.decision-row strong {
  color: var(--ink-primary);
}

.decision-outcome {
  margin: 2px 0 0;
  padding-top: 8px;
  border-top: 1px solid var(--line-subtle);
  font-size: 13.5px;
  color: #a6f4ff;
}

.decision-outcome strong {
  color: var(--emerald);
}

@media (max-width: 1100px) {
  .lifecycle-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mini-spotlight {
    grid-template-columns: 1fr;
  }

  .phone-strip {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .admin-grid,
  .decisions-grid,
  .lifecycle-grid {
    grid-template-columns: 1fr;
  }

  .video-trigger-card,
  .qr-card {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }

  .video-thumb {
    width: 140px;
  }

  .phone-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
