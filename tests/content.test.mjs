import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile, readdir, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import {
  MAIN_SITE_URL,
  POSITIONING,
  RESUME_FILENAME,
  RESUME_LEGACY_FILENAME,
  RESUME_SHA256,
  WORK_SITE_URL,
} from '../src/data/siteConfig.ts'
import { links, navigation } from '../src/data/links.ts'
import { aiCompanions, gatewayProjects, heroStageItems, novaWing } from '../src/data/projects.ts'
import { articles, openSource } from '../src/data/articles.ts'
import { evolutionStages, stackDomains } from '../src/data/skills.ts'
import { education, experience } from '../src/data/experience.ts'
import { profile } from '../src/data/profile.ts'
import { socialTags } from '../scripts/site-meta.ts'
import { analyticsCase, courierCase, liveshopCase } from '../src/work/workData.ts'
import workRoutes from '../src/work/routes.json' with { type: 'json' }

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex')

test('unified career positioning, factual history and zero internal leakage', () => {
  assert.equal(POSITIONING, '高级前端工程师｜AI 应用工程化')
  assert.equal(profile.positioning, POSITIONING)
  assert.equal(profile.email, '2661043132@qq.com')
  assert.equal(profile.phone, '18352517082')
  assert.equal(experience.length, 3)
  assert.deepEqual(
    experience.map((e) => e.company),
    [
      '友谊时光科技股份有限公司',
      '南京递吾件融网络科技有限公司',
      '文思海辉智科科技有限公司无锡分公司',
    ],
  )
  assert.deepEqual(
    experience.map((e) => e.period),
    ['2025.08 — 2026.05', '2023.08 — 2025.05', '2019.03 — 2023.07'],
  )
  assert.equal(education.length, 2)
  assert.equal(education[0].school, '南京邮电大学')
  assert.equal(education[0].period, '2024 — 2026')
  assert.equal(evolutionStages.length, 4)
  assert.equal(stackDomains.length, 6)
  assert.equal(articles[0].title, '页面级 Scope：复杂页面的状态边界')
  assert.equal(openSource.length, 4)
  assert.equal(gatewayProjects.length, 3)
  assert.deepEqual(
    gatewayProjects.map((p) => p.id),
    ['courier', 'analytics', 'liveshop'],
  )
  assert.equal(heroStageItems.length, 4)
  assert.equal(novaWing.flow.length, 6)
  assert.equal(novaWing.evidence.length, 3)
  assert.equal(aiCompanions.length, 2)
  assert.equal(liveshopCase.appEvidence.length, 5)
  assert.equal(liveshopCase.crossEndFlow.length, 4)
  assert.ok(liveshopCase.ownership.collabItems.some((item) => item.includes('网易云信 IM')))
  assert.ok(liveshopCase.appEvidence.every((shot) => shot.provenance.includes('Mock')))

  assert.doesNotMatch(
    JSON.stringify({
      profile,
      gatewayProjects,
      heroStageItems,
      novaWing,
      aiCompanions,
      evolutionStages,
      stackDomains,
      experience,
      education,
      articles,
      openSource,
      courierCase,
      analyticsCase,
      liveshopCase,
    }),
    /fly[- ]?weave/i,
  )
})

test('all external links use HTTPS and bidirectional site URLs are configured', () => {
  assert.equal(MAIN_SITE_URL, 'https://weijianjun.me/')
  assert.equal(WORK_SITE_URL, 'https://work.weijianjun.me/')
  assert.equal(navigation.length, 4)
  assert.ok(navigation.every((item) => item.href.startsWith('#')))

  const externalUrls = [
    ...Object.values(links).filter((href) => href !== links.resume),
    ...articles.map((a) => a.href),
    ...openSource.map((a) => a.href),
    ...aiCompanions.map((c) => c.href).filter(Boolean),
  ]
  for (const href of externalUrls) {
    assert.equal(new URL(href).protocol, 'https:', `Expected HTTPS URL: ${href}`)
  }
})

test('resume PDF uses exact unified filename and identical SHA-256 across both sites', async () => {
  assert.equal(RESUME_FILENAME, '魏建军-资深7年前端-18352517082.pdf')
  const paths = [
    `../public/resume/${RESUME_FILENAME}`,
    `../public/resume/${RESUME_LEGACY_FILENAME}`,
    `../work/public/resume/${RESUME_FILENAME}`,
    `../work/public/resume/${RESUME_LEGACY_FILENAME}`,
    `../dist/resume/${RESUME_FILENAME}`,
    `../dist/resume/${RESUME_LEGACY_FILENAME}`,
    `../dist-work/resume/${RESUME_FILENAME}`,
    `../dist-work/resume/${RESUME_LEGACY_FILENAME}`,
  ]
  for (const rel of paths) {
    const data = await readFile(new URL(rel, import.meta.url))
    assert.equal(data.subarray(0, 5).toString(), '%PDF-', `${rel} must be a valid PDF`)
    assert.equal(sha256(data), RESUME_SHA256, `${rel} SHA-256 mismatch`)
  }
})

test('social metadata uses confirmed production origin and rejects unsafe URLs', () => {
  const tags = socialTags({})
  assert.equal(tags.find((t) => t.tag === 'title').children, profile.meta.title)
  assert.equal(
    tags.find((t) => t.attrs?.property === 'og:image').attrs.content,
    'https://weijianjun.me/og.png',
  )
  assert.equal(tags.find((t) => t.tag === 'link').attrs.href, 'https://weijianjun.me/')
  for (const bad of [
    'http://career.example',
    'https://user:pass@career.example',
    'https://career.example/?token=value',
  ]) {
    assert.throws(() => socialTags({ VITE_SITE_URL: bad }))
  }
})

test('main site production dist contains metadata, evidence assets, version.json and zero source maps', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
  assert.ok(html.includes(profile.meta.title))
  assert.ok(html.includes('https://work.weijianjun.me/'))
  assert.ok(html.includes(RESUME_FILENAME))
  assert.match(html, /#040711/)
  assert.doesNotMatch(html, /Vite \+ Vue|src="https?:\/\//)

  for (const asset of [
    '/og.png',
    '/favicon.svg',
    '/projects/nova-wing/demo.mp4',
    '/projects/nova-wing/demo-poster.webp',
    '/projects/nova-wing/review.webp',
    '/projects/nova-wing/human-review.webp',
    '/projects/nova-wing/recovery.webp',
    '/evidence/courier/admin-orders.webp',
    '/evidence/courier/mini-booking.webp',
    '/evidence/portfolio/sdk-monitor.jpg',
    '/evidence/portfolio/ebi-user-query.jpg',
    '/evidence/portfolio/liveshop-orders.jpg',
  ]) {
    await access(new URL(`../dist${asset}`, import.meta.url))
  }

  const demoStat = await stat(new URL('../dist/projects/nova-wing/demo.mp4', import.meta.url))
  assert.ok(demoStat.size > 70 * 1024 * 1024)

  const version = JSON.parse(await readFile(new URL('../dist/version.json', import.meta.url), 'utf8'))
  assert.match(version.sha, /^([0-9a-f]{40}|local)$/)

  const assetsDir = new URL('../dist/assets/', import.meta.url)
  const names = await readdir(assetsDir)
  assert.deepEqual(
    names.filter((n) => n.endsWith('.map')),
    [],
  )
  for (const js of names.filter((n) => n.endsWith('.js'))) {
    const code = await readFile(new URL(js, assetsDir), 'utf8')
    assert.doesNotMatch(code, /sourceMappingURL=/)
  }
})

test('work subsite dist-work emits all static routes, CNAME, real videos, QR and evidence screenshots', async () => {
  const html = await readFile(new URL('../dist-work/index.html', import.meta.url), 'utf8')
  assert.ok(html.includes(POSITIONING))
  assert.ok(html.includes('https://weijianjun.me/'))
  assert.ok(html.includes(RESUME_FILENAME))
  assert.doesNotMatch(html, /src="https?:\/\//)

  const cname = (await readFile(new URL('../dist-work/CNAME', import.meta.url), 'utf8')).trim()
  assert.equal(cname, 'work.weijianjun.me')
  await access(new URL('../dist-work/.nojekyll', import.meta.url))
  await access(new URL('../dist-work/version.json', import.meta.url))

  for (const route of Object.values(workRoutes)) {
    const entry = route === '/' ? '../dist-work/index.html' : `../dist-work${route}/index.html`
    await access(new URL(entry, import.meta.url))
  }

  for (const media of [
    '/evidence/courier/mini-demo.mp4',
    '/evidence/courier/admin-demo.mp4',
    '/evidence/courier/mini-qr.png',
    '/evidence/courier/mini-booking.webp',
    '/evidence/courier/mini-pay-score.webp',
    '/evidence/courier/mini-success.webp',
    '/evidence/courier/mini-detail.webp',
    '/evidence/courier/mini-settlement.webp',
    '/evidence/courier/admin-orders.webp',
    '/evidence/courier/admin-compare.webp',
    '/evidence/courier/admin-billing.webp',
    '/evidence/courier/admin-roles.webp',
    '/evidence/portfolio/sdk-monitor.jpg',
    '/evidence/portfolio/ebi-user-query.jpg',
    '/evidence/portfolio/crm-activities.jpg',
    '/evidence/portfolio/liveshop-orders.jpg',
    '/evidence/liveshop/app-login.webp',
    '/evidence/liveshop/app-shop.webp',
    '/evidence/liveshop/app-detail.webp',
    '/evidence/liveshop/app-order.webp',
    '/evidence/liveshop/app-community.webp',
  ]) {
    const info = await stat(new URL(`../dist-work${media}`, import.meta.url))
    assert.ok(info.size > 1000, `${media} should be non-empty`)
  }
})

test('accessible interaction hooks, reduced motion and zero autoplay are enforced', async () => {
  const app = await readFile(new URL('../src/App.vue', import.meta.url), 'utf8')
  assert.match(app, /<main id="main">/)
  const workApp = await readFile(new URL('../src/work/WorkApp.vue', import.meta.url), 'utf8')
  assert.match(workApp, /<main id="work-main">/)
  const nav = await readFile(new URL('../src/components/SiteNav.vue', import.meta.url), 'utf8')
  assert.match(nav, /aria-expanded/)
  assert.ok(nav.includes('@keydown.esc'))
  const tokens = await readFile(new URL('../src/shared/tokens.css', import.meta.url), 'utf8')
  assert.match(tokens, /prefers-reduced-motion/)
  assert.match(tokens, /focus-visible/)
  const lightbox = await readFile(new URL('../src/components/MediaLightbox.vue', import.meta.url), 'utf8')
  assert.match(lightbox, /showModal/)
  assert.match(lightbox, /returnFocus\?\.focus/)
  assert.doesNotMatch(lightbox, /\bautoplay\b/)
})
