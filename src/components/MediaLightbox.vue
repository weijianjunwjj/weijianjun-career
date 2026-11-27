<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

export interface LightboxChapter {
  label: string
  seconds: number
  timeText: string
}

export interface LightboxItem {
  kind: 'image' | 'video'
  src: string
  poster?: string
  title: string
  caption?: string
  provenance?: string
  alt?: string
  chapters?: LightboxChapter[]
  fullSrc?: string
  previewSrc?: string
  previewLabel?: string
  fullLabel?: string
  bilibiliUrl?: string
}

const props = defineProps<{
  open: boolean
  items: LightboxItem[]
  startIndex: number
  returnFocus: HTMLElement | null
}>()

const emit = defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const currentIndex = ref(0)

const activeItem = computed<LightboxItem | null>(() => props.items[currentIndex.value] ?? null)
const canNavigate = computed(() => props.items.length > 1)
const videoSrcOverride = ref<string | null>(null)

const activeVideoSrc = computed(() => {
  const item = activeItem.value
  if (!item || item.kind !== 'video') return ''
  return videoSrcOverride.value || item.src
})

const isFullVideo = computed(() => {
  const item = activeItem.value
  if (!item?.fullSrc) return false
  return activeVideoSrc.value === item.fullSrc
})

function handleGlobalKeydown(event: KeyboardEvent) {
  if (!props.open) return
  if (event.key === 'Escape') {
    event.preventDefault()
    closeDialog()
  } else if (event.key === 'ArrowLeft') {
    step(-1)
  } else if (event.key === 'ArrowRight') {
    step(1)
  }
}

watch(
  () => [props.open, props.startIndex] as const,
  async ([isOpen, idx]) => {
    currentIndex.value = Math.max(0, Math.min(idx, Math.max(0, props.items.length - 1)))
    videoSrcOverride.value = null
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleGlobalKeydown)
      if (isOpen) {
        window.addEventListener('keydown', handleGlobalKeydown)
      }
    }
    await nextTick()
    const el = dialogRef.value
    if (!el) return
    if (isOpen) {
      if (!el.open) el.showModal()
    } else if (el.open) {
      videoRef.value?.pause()
      el.close()
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleGlobalKeydown)
  }
})

function closeDialog() {
  videoRef.value?.pause()
  if (dialogRef.value?.open) {
    dialogRef.value.close()
  }
  emit('close')
  props.returnFocus?.focus()
}

function handleNativeCancel(event: Event) {
  event.preventDefault()
  closeDialog()
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === dialogRef.value) {
    closeDialog()
  }
}

function step(delta: number) {
  if (!canNavigate.value) return
  videoRef.value?.pause()
  videoSrcOverride.value = null
  currentIndex.value = (currentIndex.value + delta + props.items.length) % props.items.length
}

function switchVideo(nextSrc: string) {
  videoRef.value?.pause()
  videoSrcOverride.value = nextSrc
}

function seekChapter(seconds: number) {
  const video = videoRef.value
  if (!video) return
  video.currentTime = seconds
  void video.play().catch(() => {})
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeDialog()
    return
  }
  if (event.key === 'ArrowLeft') step(-1)
  if (event.key === 'ArrowRight') step(1)
}
</script>

<template>
  <dialog
    ref="dialogRef"
    class="lightbox-dialog"
    aria-modal="true"
    :aria-label="activeItem?.title || '工程证据查看器'"
    @cancel="handleNativeCancel"
    @click="handleBackdropClick"
    @keydown="handleKeydown"
  >
    <div v-if="activeItem" class="lightbox-card">
      <header class="lightbox-header">
        <div class="lightbox-heading">
          <div class="lightbox-meta-row">
            <span v-if="activeItem.provenance" class="badge badge-cyan">{{ activeItem.provenance }}</span>
            <span v-if="canNavigate" class="mono lightbox-counter">
              {{ currentIndex + 1 }} / {{ items.length }}
            </span>
          </div>
          <h3 class="lightbox-title">{{ activeItem.title }}</h3>
          <p v-if="activeItem.caption" class="lightbox-caption">{{ activeItem.caption }}</p>
        </div>

        <div class="lightbox-controls">
          <button
            v-if="canNavigate"
            type="button"
            class="btn btn-ghost btn-sm"
            aria-label="上一项证据"
            @click="step(-1)"
          >
            <AppIcon name="chevron-left" :size="16" />
          </button>
          <button
            v-if="canNavigate"
            type="button"
            class="btn btn-ghost btn-sm"
            aria-label="下一项证据"
            @click="step(1)"
          >
            <AppIcon name="chevron-right" :size="16" />
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            aria-label="关闭证据查看器"
            @click="closeDialog"
          >
            <AppIcon name="close" :size="16" />
            <span>关闭</span>
          </button>
        </div>
      </header>

      <div class="lightbox-body">
        <img
          v-if="activeItem.kind === 'image'"
          :src="activeItem.src"
          :alt="activeItem.alt || activeItem.title"
          class="lightbox-image"
        />
        <div v-else class="lightbox-video-wrap">
          <video
            ref="videoRef"
            :key="activeVideoSrc"
            class="lightbox-video"
            controls
            playsinline
            preload="metadata"
            :poster="activeItem.poster"
            :src="activeVideoSrc"
          />
          <div v-if="activeItem.fullSrc || activeItem.bilibiliUrl" class="lightbox-video-switch">
            <button
              v-if="activeItem.fullSrc && !isFullVideo"
              type="button"
              class="btn btn-ghost btn-sm"
              @click="switchVideo(activeItem.fullSrc)"
            >
              {{ activeItem.fullLabel || '切换完整原始录屏' }}
            </button>
            <button
              v-if="activeItem.previewSrc && isFullVideo"
              type="button"
              class="btn btn-ghost btn-sm"
              @click="switchVideo(activeItem.previewSrc)"
            >
              {{ activeItem.previewLabel || '切回精华预览' }}
            </button>
            <a
              v-if="activeItem.bilibiliUrl"
              :href="activeItem.bilibiliUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-link btn-sm"
            >
              B 站观看
            </a>
          </div>
          <div v-if="activeItem.chapters?.length" class="lightbox-chapters">
            <span class="mono chapters-label">分章跳转</span>
            <button
              v-for="chapter in activeItem.chapters"
              :key="chapter.label"
              type="button"
              class="btn btn-ghost btn-sm"
              @click="seekChapter(chapter.seconds)"
            >
              <span class="mono chapter-time">{{ chapter.timeText }}</span>
              <span>{{ chapter.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.lightbox-dialog {
  width: min(1120px, calc(100vw - 28px));
  max-width: 1120px;
  max-height: calc(100vh - 28px);
  margin: auto;
  padding: 0;
  border: 1px solid rgba(56, 232, 255, 0.34);
  border-radius: var(--radius-lg);
  background: #060b18;
  color: var(--ink-primary);
  box-shadow: 0 36px 90px rgba(0, 0, 0, 0.92);
  overflow: hidden;
}

.lightbox-dialog::backdrop {
  background: rgba(2, 5, 13, 0.84);
  backdrop-filter: blur(10px);
}

.lightbox-card {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 30px);
}

.lightbox-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  border-bottom: 1px solid var(--line-subtle);
  background: rgba(11, 19, 38, 0.9);
}

.lightbox-heading {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.lightbox-meta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.lightbox-counter {
  font-size: 12px;
  color: var(--ink-muted);
}

.lightbox-title {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: var(--ink-primary);
}

.lightbox-caption {
  margin: 0;
  font-size: 13px;
  color: var(--ink-secondary);
}

.lightbox-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.lightbox-body {
  padding: 20px;
  overflow: auto;
  display: grid;
  place-items: center;
  background: #03060f;
}

.lightbox-image {
  max-height: 74vh;
  width: auto;
  max-width: 100%;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(148, 179, 255, 0.18);
}

.lightbox-video-wrap {
  width: 100%;
  display: grid;
  gap: 14px;
}

.lightbox-video-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.lightbox-video {
  width: 100%;
  max-height: 68vh;
  border-radius: var(--radius-sm);
  background: #000000;
  border: 1px solid rgba(148, 179, 255, 0.2);
}

.lightbox-chapters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.chapters-label {
  font-size: 12px;
  color: var(--ink-muted);
  margin-right: 4px;
}

.chapter-time {
  color: var(--cyan);
}

@media (max-width: 640px) {
  .lightbox-header {
    flex-direction: column;
    padding: 14px 16px;
  }

  .lightbox-body {
    padding: 12px;
  }
}
</style>
