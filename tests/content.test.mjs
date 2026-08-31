import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile, readdir, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { links, navigation } from '../src/data/links.ts'
import { novaWing, projects, selectedWork } from '../src/data/projects.ts'
import { articles, openSource } from '../src/data/articles.ts'
import { skills } from '../src/data/skills.ts'
import { experience, education } from '../src/data/experience.ts'
import { profile } from '../src/data/profile.ts'
import { socialTags } from '../scripts/site-meta.ts'

test('three factual cases; NovaWing first with evidence and a complete flow', async () => {
  assert.equal(projects.length + 1, 3)
  assert.equal(selectedWork[0].href, '#novawing')
  assert.equal(novaWing.flow.length, 6)
  assert.equal(novaWing.evidence.length, 3)
  assert.equal(new Set([novaWing.id, ...projects.map((p) => p.id)]).size, 3)
  assert.deepEqual(
    projects.map((p) => p.id),
    ['analytics', 'offerflow'],
  )
  assert.equal(projects[1].period, undefined)
  for (const evidence of novaWing.evidence) {
    await access(new URL(`../public${evidence.image}`, import.meta.url))
    await access(
      new URL(`../public${evidence.image.replace('.webp', '-660.webp')}`, import.meta.url),
    )
    assert.ok(evidence.alt.length > 10)
  }
  assert.doesNotMatch(
    JSON.stringify({ profile, projects, novaWing, skills, experience, articles, openSource }),
    /fly[- ]?weave/i,
  )
})
test('all external resources use HTTPS; resume is a real public asset', async () => {
  for (const href of [
    ...Object.values(links),
    ...articles.map((a) => a.href),
    ...openSource.map((a) => a.href),
    ...projects.map((p) => p.href).filter(Boolean),
  ]) {
    if (href === links.resume) continue
    assert.equal(new URL(href).protocol, 'https:')
  }
  assert.equal(links.resume, '/resume/wei-jianjun-resume.pdf')
  assert.ok(navigation.every((link) => link.href.startsWith('#')))
  assert.equal(navigation.length, 4)
  const originalDir = new URL('../assets/resume/', import.meta.url)
  const pdfs = (await readdir(originalDir)).filter((name) => name.endsWith('.pdf'))
  assert.equal(pdfs.length, 1)
  const original = await readFile(new URL(pdfs[0], originalDir))
  const published = await readFile(new URL(`../public${links.resume}`, import.meta.url))
  assert.equal(published.subarray(0, 5).toString(), '%PDF-')
  const hash = (data) => createHash('sha256').update(data).digest('hex')
  assert.equal(hash(original), hash(published), 'the original resume must not be rewritten')
})
test('experience, education, email and timelines match supplied resume', () => {
  assert.equal(profile.email, '2661043132@qq.com')
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
  assert.equal(skills.length, 4)
  assert.equal(skills[3].period, novaWing.period)
  assert.equal(articles[0].title, '页面级 Scope：复杂页面的状态边界')
  assert.match(projects[0].outcome, /部分构建场景/)
})
test('sharing metadata uses confirmed production origin and consistent identity', () => {
  const tags = socialTags({})
  assert.equal(tags.find((t) => t.tag === 'title').children, profile.meta.title)
  assert.equal(
    tags.find((t) => t.attrs?.property === 'og:image').attrs.content,
    'https://weijianjun-career.vercel.app/og.png',
  )
  assert.equal(
    tags.find((t) => t.tag === 'link').attrs.href,
    'https://weijianjun-career.vercel.app/',
  )
  assert.equal(
    socialTags({ VITE_SITE_URL: 'https://career.example' }).find((t) => t.tag === 'link').attrs
      .href,
    'https://career.example/',
  )
  assert.equal(
    socialTags({ VERCEL_URL: 'untrusted-preview.example' }).find((t) => t.tag === 'link').attrs
      .href,
    'https://weijianjun-career.vercel.app/',
  )
  for (const url of [
    'http://career.example',
    'https://user:pass@career.example',
    'https://career.example/path',
    'https://career.example/?token=value',
  ])
    assert.throws(() => socialTags({ VITE_SITE_URL: url }))
})
test('production artifact contains current metadata, no starter or remote runtime assets', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
  assert.ok(html.includes(profile.meta.title))
  assert.ok(html.includes(profile.meta.description))
  assert.match(html, /og:description/)
  assert.match(html, /twitter:card/)
  assert.match(html, /#f4f7fb/)
  assert.doesNotMatch(html, /Vite \+ Vue|src="https?:\/\//)
  for (const path of [
    '/og.png',
    '/favicon.svg',
    links.resume,
    novaWing.demo.src,
    novaWing.demo.poster,
  ])
    await access(new URL(`../dist${path}`, import.meta.url))
})
test('demo preloads the complete source recording without autoplay', async () => {
  const component = await readFile(
    new URL('../src/components/MediaDialog.vue', import.meta.url),
    'utf8',
  )
  assert.match(component, /preload="auto"/)
  assert.doesNotMatch(component, /autoplay/)
  const feature = await readFile(
    new URL('../src/sections/NovaWingSection.vue', import.meta.url),
    'utf8',
  )
  assert.match(feature, /class="demo-preload" preload="auto"/)
  const published = await readFile(new URL(`../public${novaWing.demo.src}`, import.meta.url))
  const original = await readFile(
    new URL('../assets/screenrecording/nova-wing-development-guardian-demo.mp4', import.meta.url),
  )
  assert.equal(
    createHash('sha256').update(published).digest('hex'),
    createHash('sha256').update(original).digest('hex'),
  )
  assert.ok(published.byteLength > 70 * 1024 * 1024)
  assert.ok(
    (await stat(new URL(`../public${novaWing.demo.poster}`, import.meta.url))).size < 100 * 1024,
  )
})
test('navigation anchors and accessible interaction hooks are present', async () => {
  const app = await readFile(new URL('../src/App.vue', import.meta.url), 'utf8')
  assert.match(app, /<main id="main">/)
  const nav = await readFile(new URL('../src/components/SiteNav.vue', import.meta.url), 'utf8')
  assert.match(nav, /aria-expanded/)
  assert.ok(nav.includes('@keydown.esc'))
  const css = await readFile(new URL('../src/style.css', import.meta.url), 'utf8')
  assert.match(css, /prefers-reduced-motion/)
  assert.match(css, /focus-visible/)
  const dialog = await readFile(
    new URL('../src/components/MediaDialog.vue', import.meta.url),
    'utf8',
  )
  assert.match(dialog, /showModal/)
  assert.match(dialog, /returnFocus\?\.focus/)
})
