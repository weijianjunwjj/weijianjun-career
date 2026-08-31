<script setup lang="ts">
import { links } from '../data/links'
import AppIcon from './AppIcon.vue'
withDefaults(defineProps<{ label?: string }>(), { label: '下载 PDF 简历' })
</script>

<template>
  <a v-if="links.resume" class="button button-secondary" :href="links.resume" download
    ><AppIcon name="download" :size="17" />{{ label }}</a
  >
  <span v-else class="resume-placeholder"
    ><button class="button button-secondary" type="button" disabled title="PDF 简历尚未上传">
      <AppIcon name="download" :size="17" />{{ label }}</button
    ><span>PDF 待补充</span></span
  >
</template>
