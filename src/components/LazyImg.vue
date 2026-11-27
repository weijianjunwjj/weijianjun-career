<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { observeLazyLoad } from '../utils/lazySrc.ts'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    width: number
    height: number
    eager?: boolean
    fetchpriority?: 'high' | 'low' | 'auto'
    decoding?: 'async' | 'sync' | 'auto'
  }>(),
  {
    eager: false,
    decoding: 'async',
  },
)

const imgRef = ref<HTMLImageElement | null>(null)
const currentSrc = ref<string | undefined>(props.eager ? props.src : undefined)
let stop: (() => void) | null = null

function bind() {
  stop?.()
  stop = null
  if (props.eager) {
    currentSrc.value = props.src
    return
  }
  currentSrc.value = undefined
  const el = imgRef.value
  if (!el) return
  stop = observeLazyLoad(el, () => {
    currentSrc.value = props.src
  })
}

onMounted(bind)

watch(
  () => [props.src, props.eager] as const,
  () => bind(),
)

onBeforeUnmount(() => {
  stop?.()
})
</script>

<template>
  <img
    ref="imgRef"
    :src="currentSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :decoding="decoding"
    :fetchpriority="fetchpriority"
  />
</template>

<style scoped>
img {
  display: block;
  width: 100%;
  height: auto;
  background: #070d1b;
}
</style>
