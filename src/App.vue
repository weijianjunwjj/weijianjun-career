<script setup lang="ts">
import SiteNav from './components/SiteNav.vue'
import SiteFooter from './components/SiteFooter.vue'
import HeroSection from './sections/HeroSection.vue'
import WorkIndex from './sections/WorkIndex.vue'
import NovaWingSection from './sections/NovaWingSection.vue'
import ProjectsSection from './sections/ProjectsSection.vue'
import CapabilitiesSection from './sections/CapabilitiesSection.vue'
import ExperienceSection from './sections/ExperienceSection.vue'
import WritingSection from './sections/WritingSection.vue'
import ContactSection from './sections/ContactSection.vue'
</script>
<template>
  <a class="skip-link" href="#main">跳转到主要内容</a>
  <div id="top"></div>
  <SiteNav />
  <main id="main">
    <HeroSection /><WorkIndex /><NovaWingSection /><ProjectsSection /><CapabilitiesSection /><ExperienceSection /><WritingSection /><ContactSection />
  </main>
  <SiteFooter />
</template>
