<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import SiteNav from './components/SiteNav.vue'
import SiteFooter from './components/SiteFooter.vue'
import HeroSection from './sections/HeroSection.vue'
import ProjectGatewaySection from './sections/ProjectGatewaySection.vue'
import EvolutionSection from './sections/EvolutionSection.vue'
import AiEngineeringSection from './sections/AiEngineeringSection.vue'
import CredentialsSection from './sections/CredentialsSection.vue'
import ContactSection from './sections/ContactSection.vue'
import type { LightboxItem } from './components/MediaLightbox.vue'

const MediaLightbox = defineAsyncComponent(() => import('./components/MediaLightbox.vue'))

const lightboxOpen = ref(false)
const lightboxLoaded = ref(false)
const lightboxItems = ref<LightboxItem[]>([])
const lightboxStart = ref(0)
const lightboxTrigger = ref<HTMLElement | null>(null)

function handleOpenMedia(payload: {
  items: LightboxItem[]
  startIndex: number
  trigger: HTMLElement | null
}) {
  lightboxLoaded.value = true
  lightboxItems.value = payload.items
  lightboxStart.value = payload.startIndex
  lightboxTrigger.value = payload.trigger
  lightboxOpen.value = true
}

function handleCloseMedia() {
  lightboxOpen.value = false
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
  if (!targets.length) return
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    typeof IntersectionObserver === 'undefined'
  ) {
    targets.forEach((el) => el.setAttribute('data-reveal', 'visible'))
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-reveal', 'visible')
          observer?.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.05 },
  )
  targets.forEach((el) => observer?.observe(el))
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="space-shell">
    <a href="#main" class="skip-link">跳至主要内容</a>
    <SiteNav />
    <main id="main">
      <HeroSection @open-media="handleOpenMedia" />
      <ProjectGatewaySection @open-media="handleOpenMedia" />
      <EvolutionSection />
      <AiEngineeringSection @open-media="handleOpenMedia" />
      <CredentialsSection />
      <ContactSection />
    </main>
    <SiteFooter />
    <MediaLightbox
      v-if="lightboxLoaded"
      :open="lightboxOpen"
      :items="lightboxItems"
      :start-index="lightboxStart"
      :return-focus="lightboxTrigger"
      @close="handleCloseMedia"
    />
  </div>
</template>
