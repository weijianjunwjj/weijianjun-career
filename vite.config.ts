import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { socialTags } from './scripts/site-meta.ts'

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    {
      name: 'career-social-metadata',
      transformIndexHtml: () => socialTags(loadEnv(mode, '.', '')),
    },
  ],
}))
