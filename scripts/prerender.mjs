import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { build } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ssrOut = resolve(root, 'node_modules/.cache/career-ssr')

export async function prerenderHome() {
  await build({
    root,
    configFile: resolve(root, 'vite.config.ts'),
    build: {
      ssr: resolve(root, 'src/entry-server.ts'),
      outDir: ssrOut,
      emptyOutDir: true,
      sourcemap: false,
      minify: false,
    },
    logLevel: 'error',
  })

  const files = await readdir(ssrOut)
  const entryName = files.find((name) => name.endsWith('.js') && name.includes('entry-server'))
    || files.find((name) => name.endsWith('.js'))
  if (!entryName) {
    throw new Error('SSR build did not emit an entry-server bundle')
  }

  const { render } = await import(pathToFileURL(resolve(ssrOut, entryName)).href)
  const appHtml = await render()
  if (typeof appHtml !== 'string' || !appHtml.includes('id="top"')) {
    throw new Error('prerender produced empty or incomplete home markup')
  }

  const indexPath = resolve(root, 'dist/index.html')
  const template = await readFile(indexPath, 'utf8')
  if (!template.includes('<div id="app"></div>')) {
    throw new Error('dist/index.html missing empty #app shell to hydrate')
  }

  const html = template.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`)
  await writeFile(indexPath, html)
}

await prerenderHome()
