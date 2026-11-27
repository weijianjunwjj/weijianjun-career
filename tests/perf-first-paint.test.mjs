import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { profile } from '../src/data/profile.ts'
import { LAZY_ROOT_MARGIN, observeLazyLoad } from '../src/utils/lazySrc.ts'
import { gatewayProjects, heroStageItems, novaWing } from '../src/data/projects.ts'

test('lazy observer uses 100px rootMargin and does not fire before intersect', () => {
  assert.equal(LAZY_ROOT_MARGIN, '100px 0px')
  let visible = false
  let savedCb
  let savedOpts
  class FakeIO {
    constructor(cb, opts) {
      savedCb = cb
      savedOpts = opts
    }
    observe() {}
    disconnect() {}
    unobserve() {}
    takeRecords() {
      return []
    }
  }
  const stop = observeLazyLoad({ id: 'el' }, () => {
    visible = true
  }, FakeIO)
  assert.equal(savedOpts.rootMargin, '100px 0px')
  assert.equal(visible, false)
  savedCb([{ isIntersecting: false }])
  assert.equal(visible, false)
  savedCb([{ isIntersecting: true }])
  assert.equal(visible, true)
  stop()
})

test('lazy observer degrades immediately without IntersectionObserver', () => {
  let visible = false
  const stop = observeLazyLoad({ id: 'el' }, () => {
    visible = true
  }, undefined)
  assert.equal(visible, true)
  stop()
})

test('gateway and nova cards use thumbs while lightbox keeps HD sources', () => {
  const [courier, ...rest] = gatewayProjects
  assert.match(courier.primaryImage, /\.webp$/)
  assert.match(courier.primaryThumb, /\/evidence\/courier\/admin-orders\.webp$/)
  assert.equal(courier.primaryThumb, courier.primaryImage)
  for (const project of rest) {
    assert.match(project.primaryImage, /\.webp$/)
    assert.ok(project.primaryThumb)
    assert.notEqual(project.primaryThumb, project.primaryImage)
  }
  assert.match(heroStageItems[0].image, /admin-orders\.webp$/)
  assert.match(heroStageItems[0].secondaryImage, /mini-booking\.webp$/)
  assert.equal(novaWing.demo.src.includes('demo-preview.mp4'), true)
  assert.equal(novaWing.demo.fullSrc.includes('demo.mp4'), true)
  assert.equal(typeof novaWing.demo.bilibiliUrl, 'string')
})

test('built index.html is prerendered with hero copy and image preload', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
  assert.match(html, /<div id="app">[\s\S]+id="top"/)
  assert.ok(html.includes(profile.headlineTop))
  assert.ok(html.includes(profile.headlineBottom))
  assert.match(
    html,
    /<link[^>]+rel="preload"[^>]+as="image"[^>]+href="\/evidence\/courier\/admin-orders\.webp"/,
  )
  assert.match(
    html,
    /<link[^>]+rel="preload"[^>]+as="image"[^>]+href="\/evidence\/courier\/mini-booking\.webp"/,
  )
  assert.match(html, /fetchpriority="high"/)
  assert.doesNotMatch(html, /lowcode-workbench\.jpg|sdk-monitor\.jpg|liveshop-orders\.jpg/)
})

test('main entry JS is sentry-free while Sentry lives in a delayed async chunk', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
  const entryMatch = html.match(/<script type="module"[^>]+src="(\/assets\/[^"]+\.js)"/)
  assert.ok(entryMatch, 'missing module entry script')
  const entryPath = new URL(`../dist${entryMatch[1]}`, import.meta.url)
  const entryCode = await readFile(entryPath, 'utf8')
  assert.doesNotMatch(entryCode, /@sentry\/vue/)
  assert.doesNotMatch(entryCode, /ingest\.us\.sentry\.io/)

  const assetsDir = new URL('../dist/assets/', import.meta.url)
  const names = await readdir(assetsDir)
  const sentryChunks = []
  for (const name of names.filter((n) => n.endsWith('.js'))) {
    const code = await readFile(new URL(name, assetsDir), 'utf8')
    if (code.includes('ingest.us.sentry.io') || code.includes('@sentry/vue')) {
      sentryChunks.push(name)
    }
  }
  assert.ok(sentryChunks.length >= 1, 'Sentry should be in a delayed async chunk')
  assert.ok(!sentryChunks.includes(entryMatch[1].replace('/assets/', '')))

  const raw = await readFile(entryPath)
  const gz = gzipSync(raw, { level: 9 }).length
  assert.ok(gz >= 50 * 1024, `main entry gzip ${gz} bytes is below the static-section floor`)
  assert.ok(gz <= 58 * 1024, `main entry gzip ${gz} bytes exceeds 58KB target`)
})

test('built index.html ships a single stylesheet with below-fold section CSS', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
  const sheets = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map((m) => m[0])
  assert.equal(sheets.length, 1, `expected 1 stylesheet, got ${sheets.length}`)
  const href = sheets[0].match(/href="([^"]+\.css)"/)?.[1]
  assert.ok(href, 'missing stylesheet href')
  const css = await readFile(new URL(`../dist${href}`, import.meta.url), 'utf8')
  assert.match(css, /\.contact-section/)
  assert.match(css, /\.credentials-grid/)
  assert.match(css, /\.domains-grid/)
  assert.match(css, /\.nova-workbench/)
})

test('Sentry stays off the critical path until window load completes', async () => {
  const main = await readFile(new URL('../src/main.ts', import.meta.url), 'utf8')
  assert.match(main, /document\.readyState === 'complete'/)
  assert.match(main, /addEventListener\('load'/)
  assert.match(main, /timeout:\s*3000/)
  assert.match(main, /setTimeout\(load,\s*2000\)/)
  assert.match(main, /#sentry-test/)
})

test('below-fold lazy images omit real src in prerendered HTML', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
  const appHtml = html.match(/<div id="app">([\s\S]*)<\/div>\s*<noscript>/)?.[1] ?? html
  assert.doesNotMatch(appHtml, /src="\/evidence\/portfolio\/lowcode-workbench/)
  assert.doesNotMatch(appHtml, /src="\/evidence\/portfolio\/sdk-monitor/)
  assert.doesNotMatch(appHtml, /src="\/evidence\/portfolio\/liveshop-orders/)
  assert.doesNotMatch(appHtml, /src="\/evidence\/liveshop\/app-home/)
  assert.match(appHtml, /src="\/evidence\/courier\/admin-orders\.webp"/)
  assert.match(appHtml, /src="\/evidence\/courier\/mini-booking\.webp"/)
})

test('nova preview video exists, original demo stays large, wechat qr is untouched', async () => {
  const preview = await stat(new URL('../public/projects/nova-wing/demo-preview.mp4', import.meta.url))
  assert.ok(preview.size > 1 * 1024 * 1024)
  assert.ok(preview.size < 10 * 1024 * 1024)
  const demo = await stat(new URL('../public/projects/nova-wing/demo.mp4', import.meta.url))
  assert.ok(demo.size > 70 * 1024 * 1024)
})

test('prerendered html does not put wechat qr on the first-paint critical path', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
  const workHtml = await readFile(new URL('../dist-work/index.html', import.meta.url), 'utf8')
  assert.doesNotMatch(html, /wechat-qr\.(webp|jpg)/)
  assert.doesNotMatch(workHtml, /wechat-qr\.(webp|jpg)/)
})
