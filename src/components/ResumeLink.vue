<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { RESUME_FILENAME, RESUME_HREF } from '../data/siteConfig.ts'

withDefaults(
  defineProps<{
    label?: string
    variant?: 'ghost' | 'primary' | 'portal' | 'link'
    compact?: boolean
  }>(),
  {
    label: '下载简历',
    variant: 'ghost',
    compact: false,
  },
)
</script>

<template>
  <a
    :href="RESUME_HREF"
    :download="RESUME_FILENAME"
    class="btn"
    :class="[`btn-${variant}`, compact ? 'btn-sm' : '']"
    :aria-label="`${label}（${RESUME_FILENAME}）`"
  >
    <AppIcon name="download" :size="compact ? 14 : 15" />
    <span>{{ label }}</span>
  </a>
</template>
