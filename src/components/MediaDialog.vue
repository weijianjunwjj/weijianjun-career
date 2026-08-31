<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'
type Media =
  | { kind: 'image'; src: string; alt: string; title: string }
  | { kind: 'video'; src: string; poster: string; title: string }
const dialog = ref<HTMLDialogElement>()
const current = ref<Media>()
const failed = ref(false)
let returnFocus: HTMLElement | null = null
let previousOverflow = ''
async function open(media: Media) {
  returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  current.value = media
  failed.value = false
  await nextTick()
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value?.showModal()
}
function finish() {
  document.body.style.overflow = previousOverflow
  current.value = undefined
  returnFocus?.focus()
}
function close() {
  dialog.value?.close()
}
onBeforeUnmount(() => {
  if (dialog.value?.open) document.body.style.overflow = previousOverflow
})
defineExpose({ open })
</script>
<template>
  <dialog
    ref="dialog"
    class="media-dialog"
    aria-labelledby="media-title"
    @keydown.esc.prevent="close"
    @close="finish"
    @click="
      (event) => {
        if (event.target === dialog) close()
      }
    "
  >
    <div v-if="current" class="media-dialog-content">
      <header class="media-dialog-header">
        <div>
          <h2 id="media-title">{{ current.title }}</h2>
          <p v-if="current.kind === 'image'">原尺寸真实局部 · 可横向滑动查看细节</p>
        </div>
        <button class="dialog-close" autofocus aria-label="关闭预览" @click="close">×</button>
      </header>
      <div
        v-if="current.kind === 'image'"
        class="image-zoom"
        tabindex="0"
        aria-label="原尺寸截图，可使用方向键滚动"
      >
        <img :src="current.src" :alt="current.alt" width="1320" @error="failed = true" />
      </div>
      <template v-else>
        <video
          controls
          playsinline
          preload="auto"
          :poster="current.poster"
          aria-label="NovaWing 真实运行演示原始录屏"
          @error="failed = true"
        >
          <source :src="current.src" type="video/mp4" />
          当前浏览器不支持视频播放。
        </video>
        <p class="video-transcript">
          无声原始录屏，展示 NovaWing 完整运行过程；无加速、无重绘。原视频约 13 分钟。
        </p>
        <a class="text-link" :href="current.src" target="_blank" rel="noopener noreferrer"
          >在新窗口打开视频 ↗</a
        >
      </template>
      <p v-if="failed" role="alert">媒体未能加载，请重新打开，或通过项目 Showcase 查看原始素材。</p>
    </div>
  </dialog>
</template>
