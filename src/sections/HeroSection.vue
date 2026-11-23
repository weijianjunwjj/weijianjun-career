<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import ResumeLink from '../components/ResumeLink.vue'
import type { LightboxItem } from '../components/MediaLightbox.vue'
import { links } from '../data/links.ts'
import { profile } from '../data/profile.ts'
import { heroStageItems } from '../data/projects.ts'

const emit = defineEmits<{
  openMedia: [payload: { items: LightboxItem[]; startIndex: number; trigger: HTMLElement | null }]
}>()

const activeId = ref(heroStageItems[0].id)
const activeItem = computed(
  () => heroStageItems.find((item) => item.id === activeId.value) ?? heroStageItems[0],
)

function openStageLightbox(event: MouseEvent, startSecondary = false) {
  const item = activeItem.value
  const list: LightboxItem[] = [
    {
      kind: 'image',
      src: item.image,
      title: item.title,
      caption: item.highlight,
      provenance: item.provenance,
      alt: item.alt,
    },
  ]
  if (item.secondaryImage) {
    list.push({
      kind: 'image',
      src: item.secondaryImage,
      title: `${item.title} · 移动端真机视图`,
      caption: item.subtitle,
      provenance: item.provenance,
      alt: item.secondaryAlt || item.alt,
    })
  }
  emit('openMedia', {
    items: list,
    startIndex: startSecondary && list.length > 1 ? 1 : 0,
    trigger: event.currentTarget as HTMLElement | null,
  })
}
</script>

<template>
  <section id="top" class="hero-section">
    <div class="container hero-grid">
      <!-- Left Editorial Pitch -->
      <div class="hero-copy">
        <div class="hero-eyebrow-row">
          <span class="badge badge-cyan">
            <span class="eyebrow-dot" />
            <span>{{ profile.positioning }}</span>
          </span>
          <span class="mono hero-exp-tag">{{ profile.experience }}</span>
        </div>

        <h1 class="hero-title">
          <span class="hero-title-line">{{ profile.headlineTop }}</span>
          <span class="hero-title-accent">{{ profile.headlineBottom }}</span>
        </h1>

        <p class="hero-intro">{{ profile.intro }}</p>
        <p class="hero-desc">{{ profile.description }}</p>

        <div class="hero-cta-row">
          <a :href="links.work" class="btn btn-primary hero-primary-cta">
            <span>进入工程项目体验中心</span>
            <AppIcon name="arrow-up-right" :size="16" />
          </a>
          <ResumeLink label="下载完整简历" variant="ghost" />
          <a :href="links.github" target="_blank" rel="noopener noreferrer" class="btn btn-link">
            <AppIcon name="github" :size="16" />
            <span>GitHub</span>
          </a>
        </div>

        <div class="hero-facts" aria-label="核心履历事实概览">
          <article v-for="fact in profile.heroFacts" :key="fact.label" class="fact-tile">
            <p class="mono fact-value">{{ fact.value }}</p>
            <p class="fact-label">{{ fact.label }}</p>
            <p class="fact-detail">{{ fact.detail }}</p>
          </article>
        </div>
      </div>

      <!-- Right Interactive Real Evidence Stage (Replaces empty decorative graphics) -->
      <div class="hero-stage glass-panel" aria-label="真实工程项目实时预览台">
        <div class="stage-top">
          <div class="stage-heading">
            <span class="eyebrow">REAL EVIDENCE DECK</span>
            <span class="stage-provenance">{{ activeItem.provenance }}</span>
          </div>
          <div class="stage-tabs" role="tablist" aria-label="切换真实工程项目预览">
            <button
              v-for="item in heroStageItems"
              :key="item.id"
              type="button"
              role="tab"
              :aria-selected="activeId === item.id"
              class="stage-tab"
              :class="{ 'is-active': activeId === item.id }"
              @click="activeId = item.id"
            >
              {{ item.tabLabel }}
            </button>
          </div>
        </div>

        <div class="stage-viewport">
          <div v-if="activeItem.layout === 'dual'" class="dual-showcase">
            <div class="optical-frame dual-desktop">
              <div class="optical-frame-bar">
                <span class="optical-dots"><span /><span /><span /></span>
                <span class="optical-bar-label">逍遥邮管理后台 · Vue 3 / Naive UI</span>
              </div>
              <button
                type="button"
                class="optical-media-btn"
                aria-label="放大查看逍遥邮运营后台真实截图"
                @click="openStageLightbox($event, false)"
              >
                <img :src="activeItem.image" :alt="activeItem.alt" width="1320" height="820" />
                <span class="optical-zoom-hint">
                  <AppIcon name="expand" :size="12" />
                  <span>放大查验</span>
                </span>
              </button>
            </div>

            <div class="phone-bezel dual-phone">
              <button
                type="button"
                class="phone-bezel-screen"
                aria-label="放大查看逍遥邮微信小程序真机截图"
                @click="openStageLightbox($event, true)"
              >
                <img
                  :src="activeItem.secondaryImage"
                  :alt="activeItem.secondaryAlt || activeItem.alt"
                  width="420"
                  height="910"
                />
              </button>
            </div>
          </div>

          <div v-else class="optical-frame single-showcase">
            <div class="optical-frame-bar">
              <span class="optical-dots"><span /><span /><span /></span>
              <span class="optical-bar-label">{{ activeItem.badge }}</span>
            </div>
            <button
              type="button"
              class="optical-media-btn"
              :aria-label="`放大查看 ${activeItem.title} 截图`"
              @click="openStageLightbox($event, false)"
            >
              <img :src="activeItem.image" :alt="activeItem.alt" width="1320" height="880" />
              <span class="optical-zoom-hint">
                <AppIcon name="expand" :size="12" />
                <span>点击放大</span>
              </span>
            </button>
          </div>
        </div>

        <div class="stage-footer">
          <div class="stage-meta">
            <p class="stage-item-title">{{ activeItem.title }}</p>
            <p class="stage-item-highlight">{{ activeItem.highlight }}</p>
          </div>
          <a
            :href="activeItem.actionHref"
            class="btn btn-portal btn-sm stage-action"
          >
            <span>{{ activeItem.actionLabel }}</span>
            <AppIcon :name="activeItem.isExternal ? 'arrow-up-right' : 'arrow-right'" :size="14" />
          </a>
        </div>
      </div>
    </div>

    <!-- Recruiter 3-Pillar Thesis Strip -->
    <div class="container pillars-strip">
      <article v-for="pillar in profile.valuePillars" :key="pillar.index" class="pillar-card">
        <span class="mono pillar-index">{{ pillar.index }}</span>
        <div class="pillar-body">
          <h2 class="pillar-title">{{ pillar.title }}</h2>
          <p class="pillar-text">{{ pillar.text }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  padding-top: clamp(32px, 4.5vw, 60px);
  padding-bottom: clamp(44px, 5vw, 72px);
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 1.08fr);
  gap: clamp(26px, 3.6vw, 48px);
  align-items: center;
}

.hero-copy {
  display: grid;
  gap: 18px;
}

.hero-eyebrow-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.hero-exp-tag {
  font-size: 12px;
  color: var(--ink-muted);
}

.hero-title {
  margin: 0;
  display: grid;
  gap: 4px;
  font-size: clamp(34px, 4.4vw, 56px);
  line-height: 1.1;
  letter-spacing: -0.03em;
  font-weight: 800;
}

.hero-title-line {
  color: var(--ink-primary);
}

.hero-title-accent {
  background: linear-gradient(96deg, #e8f8ff 0%, #5ceeff 42%, #8b9dff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-intro {
  margin: 0;
  font-size: clamp(16px, 1.5vw, 18px);
  font-weight: 500;
  color: #dce8ff;
  line-height: 1.5;
}

.hero-desc {
  margin: 0;
  font-size: 14.5px;
  color: var(--ink-secondary);
  max-width: 56ch;
}

.hero-cta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding-top: 4px;
}

.hero-primary-cta {
  padding: 13px 22px;
  font-size: 14.5px;
}

.hero-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding-top: 10px;
}

.fact-tile {
  padding: 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line-subtle);
  background: rgba(9, 16, 33, 0.72);
  display: grid;
  gap: 4px;
  align-content: start;
}

.fact-value {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--cyan);
  letter-spacing: -0.02em;
}

.fact-label {
  margin: 0;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-primary);
}

.fact-detail {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--ink-muted);
}

/* Interactive Evidence Stage */
.hero-stage {
  padding: 18px;
  display: grid;
  gap: 14px;
  position: relative;
}

.stage-top {
  display: grid;
  gap: 10px;
}

.stage-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.stage-provenance {
  font-size: 11.5px;
  color: var(--ink-muted);
}

.stage-tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  padding: 4px;
  border-radius: var(--radius-sm);
  background: rgba(4, 8, 19, 0.8);
  border: 1px solid rgba(148, 179, 255, 0.12);
}

.stage-tab {
  padding: 8px 6px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--ink-secondary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition:
    background-color 0.2s var(--ease-out),
    color 0.2s var(--ease-out),
    border-color 0.2s var(--ease-out);
}

.stage-tab:hover {
  color: var(--ink-primary);
}

.stage-tab.is-active {
  background: linear-gradient(135deg, rgba(56, 232, 255, 0.18), rgba(79, 124, 255, 0.22));
  border-color: rgba(56, 232, 255, 0.44);
  color: #ffffff;
  font-weight: 600;
}

.stage-viewport {
  min-height: 310px;
  display: grid;
  align-items: center;
}

.dual-showcase {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 144px;
  gap: 12px;
  align-items: end;
}

.dual-desktop :deep(img),
.dual-desktop img {
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top left;
}

.dual-phone {
  width: 100%;
}

.dual-phone img {
  aspect-ratio: 9 / 19;
  object-fit: cover;
  object-position: top;
}

.single-showcase img {
  max-height: 332px;
  width: 100%;
  object-fit: cover;
  object-position: top center;
}

.stage-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--line-subtle);
}

.stage-meta {
  display: grid;
  gap: 3px;
  min-width: 0;
  flex: 1 1 240px;
}

.stage-item-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-primary);
}

.stage-item-highlight {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--ink-secondary);
}

.stage-action {
  flex-shrink: 0;
}

/* Pillars strip */
.pillars-strip {
  margin-top: clamp(28px, 4vw, 48px);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.pillar-card {
  display: flex;
  gap: 14px;
  padding: 18px 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line-subtle);
  background: rgba(8, 14, 29, 0.72);
}

.pillar-index {
  font-size: 13px;
  font-weight: 700;
  color: var(--cyan);
  padding-top: 2px;
}

.pillar-body {
  display: grid;
  gap: 5px;
}

.pillar-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-primary);
}

.pillar-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--ink-secondary);
}

@media (max-width: 1080px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .pillars-strip {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .hero-facts {
    grid-template-columns: 1fr;
  }

  .stage-tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dual-showcase {
    grid-template-columns: minmax(0, 1fr) 104px;
    gap: 8px;
  }

  .stage-viewport {
    min-height: 220px;
  }

  .stage-action {
    width: 100%;
  }
}
</style>
