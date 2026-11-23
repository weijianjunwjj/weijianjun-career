import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import routes from './src/work/routes.json' with { type: 'json' }

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const commitSha = env.GITHUB_SHA || 'local'
  const builtAt = new Date().toISOString()
  const outDir = resolve(projectRoot, 'dist-work')

  return {
    root: resolve(projectRoot, 'work'),
    base: '/',
    publicDir: resolve(projectRoot, 'work/public'),
    build: {
      outDir,
      emptyOutDir: true,
      sourcemap: false,
    },
    define: {
      __COMMIT_SHA__: JSON.stringify(commitSha),
    },
    plugins: [
      vue(),
      {
        name: 'work-static-routes',
        apply: 'build',
        async closeBundle() {
          const entryHtml = resolve(outDir, 'index.html')
          for (const routePath of Object.values(routes)) {
            if (routePath === '/') continue
            const targetDir = resolve(outDir, routePath.replace(/^\/+/, ''))
            await mkdir(targetDir, { recursive: true })
            await copyFile(entryHtml, resolve(targetDir, 'index.html'))
          }
          await writeFile(resolve(outDir, '.nojekyll'), '')
          await writeFile(resolve(outDir, 'CNAME'), 'work.weijianjun.me\n')
          await writeFile(
            resolve(outDir, 'version.json'),
            `${JSON.stringify({ site: 'work.weijianjun.me', sha: commitSha, builtAt }, null, 2)}\n`,
          )
        },
      },
    ],
  }
})
