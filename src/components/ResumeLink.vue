<script setup lang="ts">
import { links } from '../data/links'
import AppIcon from './AppIcon.vue'
withDefaults(defineProps<{ label?: string; compact?: boolean }>(), {
  label: '下载简历',
  compact: false,
})
</script>
<template>
  <a
    :class="compact ? 'nav-resume' : 'button button-secondary'"
    :href="links.resume"
    download="Wei-Jianjun-Resume.pdf"
    ><span>{{ label }}</span
    ><AppIcon name="download" :size="18"
  /></a>
</template>
