import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { socialTags } from './scripts/site-meta.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  // GitHub Actions sets GITHUB_SHA to the commit being built; local builds report "local".
  const commitSha = env.GITHUB_SHA || 'local'
  const builtAt = new Date().toISOString()
  // Only the deploy job has this secret. Without it no source maps are produced at all,
  // so a map can never be published by accident.
  const sentryAuthToken = env.SENTRY_AUTH_TOKEN

  return {
    base: '/',
    build: {
      // "hidden": maps are generated for upload, but bundles don't reference them.
      sourcemap: sentryAuthToken ? 'hidden' : false,
    },
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
      // Uploads source maps to Sentry under this release, then deletes them from dist.
      // Must stay the last plugin.
      sentryAuthToken
        ? sentryVitePlugin({
            org: 'weijianjun',
            project: 'weijianjun-career',
            authToken: sentryAuthToken,
            release: { name: commitSha },
            sourcemaps: { filesToDeleteAfterUpload: ['./dist/**/*.map'] },
            telemetry: false,
          })
        : null,
    ],
  }
})
