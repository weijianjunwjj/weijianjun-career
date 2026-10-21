import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { socialTags } from './scripts/site-meta.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  // GitHub Actions sets GITHUB_SHA to the commit being built; local builds report "local".
  const commitSha = env.GITHUB_SHA || 'local'
  const builtAt = new Date().toISOString()

  return {
    base: '/',
    define: {
      __COMMIT_SHA__: JSON.stringify(commitSha),
    },
    plugins: [
      vue(),
      {
        name: 'career-social-metadata',
        transformIndexHtml: () => socialTags(env),
      },
      {
        // Publishes /version.json so anyone can check which commit is live.
        name: 'career-release-info',
        apply: 'build',
        generateBundle() {
          this.emitFile({
            type: 'asset',
            fileName: 'version.json',
            source: `${JSON.stringify({ sha: commitSha, builtAt }, null, 2)}\n`,
          })
        },
      },
    ],
  }
})
