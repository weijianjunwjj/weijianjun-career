<script setup lang="ts">
import { defineAsyncComponent, hydrateOnVisible, onBeforeUnmount, onMounted, ref } from 'vue'
import SiteNav from './components/SiteNav.vue'
import SiteFooter from './components/SiteFooter.vue'
import HeroSection from './sections/HeroSection.vue'
import type { LightboxItem } from './components/MediaLightbox.vue'

function belowFold(loader: () => Promise<unknown>) {
  return defineAsyncComponent({
    loader: loader as () => Promise<{ default: unknown }>,
    hydrate: hydrateOnVisible({ rootMargin: '200px 0px' }),
  })
}

const ProjectGatewaySection = belowFold(() => import('./sections/ProjectGatewaySection.vue'))
const EvolutionSection = belowFold(() => import('./sections/EvolutionSection.vue'))
const AiEngineeringSection = belowFold(() => import('./sections/AiEngineeringSection.vue'))
const CredentialsSection = belowFold(() => import('./sections/CredentialsSection.vue'))
const ContactSection = belowFold(() => import('./sections/ContactSection.vue'))

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
