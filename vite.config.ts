import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { socialTags } from './scripts/site-meta.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const isGitHubPages = env.GITHUB_PAGES === 'true'

  return {
    base: isGitHubPages ? '/weijianjun-career/' : '/',
    plugins: [
      vue(),
      {
        name: 'career-social-metadata',
        transformIndexHtml: () => socialTags(env),
      },
    ],
  }
})
