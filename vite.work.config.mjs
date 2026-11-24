import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import routes from './src/work/routes.json' with { type: 'json' }

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

const ROUTE_TITLES = {
  '/projects/courier': '01 中邮通快递双端（逍遥邮） · 工程证据｜魏建军',
  '/projects/courier/mini': '01 中邮通微信小程序 · 真机与支付分证据｜魏建军',
  '/projects/courier/admin': '01 中邮通运营管理后台 · 订单与对账证据｜魏建军',
  '/projects/analytics': '02 友谊时光 EBI 与微前端治理 · 工程证据｜魏建军',
  '/projects/lowcode': '03 企业级低代码引擎交互沙盒 · 工程证据｜魏建军',
  '/projects/liveshop': '04 LiveShop 海外社交电商双端 · 工程证据｜魏建军',
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const commitSha = env.GITHUB_SHA || 'local'
  const builtAt = new Date().toISOString()
  const outDir = resolve(projectRoot, 'dist-work')

  return {
    root: resolve(projectRoot, 'work'),
    base: '/',
    cacheDir: resolve(projectRoot, 'node_modules/.vite-work'),
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
          const entryHtml = await readFile(resolve(outDir, 'index.html'), 'utf8')
          for (const routePath of Object.values(routes)) {
            if (routePath === '/') continue
            const targetDir = resolve(outDir, routePath.replace(/^\/+/, ''))
            await mkdir(targetDir, { recursive: true })
            const customTitle = ROUTE_TITLES[routePath]
            const routeHtml = customTitle
              ? entryHtml.replace(/<title>[^<]*<\/title>/, `<title>${customTitle}</title>`)
              : entryHtml
            await writeFile(resolve(targetDir, 'index.html'), routeHtml)
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
