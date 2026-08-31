<script setup lang="ts">
withDefaults(
  defineProps<{
    name?: 'arrow' | 'external' | 'download' | 'github' | 'play' | 'code' | 'layers' | 'check'
    size?: number
  }>(),
  { name: 'arrow', size: 20 },
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-if="name === 'arrow'" d="M4 12h16m-6-6 6 6-6 6" />
    <path v-else-if="name === 'external'" d="M7 17 17 7M7 7h10v10" />
    <path v-else-if="name === 'download'" d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" />
    <path v-else-if="name === 'play'" d="m9 5 11 7-11 7z" />
    <path v-else-if="name === 'code'" d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18" />
    <path v-else-if="name === 'layers'" d="m12 3 10 6-10 6L2 9zm-10 12 10 6 10-6M2 12l10 6 10-6" />
    <path v-else-if="name === 'check'" d="m5 12 4 4L19 6" />
    <path
      v-else
      d="M9 19c-4 1-4-2-6-2m12 5v-4a3 3 0 0 0-.8-2.3c2.8-.3 5.8-1.4 5.8-6.2a4.8 4.8 0 0 0-1.3-3.3 4.4 4.4 0 0 0-.1-3.3s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.3 5.4 2.6 5.4 2.6a4.4 4.4 0 0 0-.1 3.3A4.8 4.8 0 0 0 4 9.2c0 4.8 3 5.9 5.8 6.2A3 3 0 0 0 9 18v4"
    />
  </svg>
</template>
