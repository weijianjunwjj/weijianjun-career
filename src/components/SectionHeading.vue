<script setup lang="ts">
defineProps<{
  number: string
  eyebrow: string
  title: string
  description?: string
  headingId?: string
}>()
</script>
<template>
  <header class="section-heading">
    <div>
      <p class="eyebrow">
        <span>{{ number }}</span
        >{{ eyebrow }}
      </p>
      <h2 :id="headingId">{{ title }}</h2>
    </div>
    <p v-if="description" class="section-description">{{ description }}</p>
  </header>
</template>
