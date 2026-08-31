<script setup lang="ts">
import { profile } from '../data/profile'
import AppIcon from '../components/AppIcon.vue'
</script>
<template>
  <section id="why" class="why-section" aria-labelledby="why-title">
    <div class="container why-inner">
      <div class="why-copy">
        <p class="eyebrow">{{ profile.why.eyebrow }}</p>
        <h2 id="why-title">{{ profile.why.title }}</h2>
        <p class="why-lead">{{ profile.why.lead }}</p>
        <p class="why-description">{{ profile.why.text }}</p>
      </div>
      <div class="ownership-flow">
        <ol>
          <li v-for="(step, index) in profile.why.steps" :key="step">
            <span>{{ String(index + 1).padStart(2, '0') }}</span
            >{{ step }}
          </li>
        </ol>
        <p>
          <AppIcon name="check" :size="20" />{{ profile.why.outcome }}<span>OWN THE OUTCOME</span>
        </p>
      </div>
    </div>
  </section>
</template>
