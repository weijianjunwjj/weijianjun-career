<script setup lang="ts">
import SiteNav from './components/SiteNav.vue'
import HeroSection from './sections/HeroSection.vue'
import ProjectsSection from './sections/ProjectsSection.vue'
import CapabilitiesSection from './sections/CapabilitiesSection.vue'
import WhySection from './sections/WhySection.vue'
import WritingSection from './sections/WritingSection.vue'
import ExperienceSection from './sections/ExperienceSection.vue'
import ContactSection from './sections/ContactSection.vue'
</script>
<template>
  <a class="skip-link" href="#main">跳至主要内容</a>
  <div id="top"></div>
  <SiteNav />
  <main id="main">
    <HeroSection /><ProjectsSection /><CapabilitiesSection /><WhySection /><WritingSection /><ExperienceSection /><ContactSection />
  </main>
</template>
