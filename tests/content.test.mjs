import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { links, navigation } from '../src/data/links.ts'
import { novaWing, projects } from '../src/data/projects.ts'
import { articles, openSource } from '../src/data/articles.ts'
import { skills } from '../src/data/skills.ts'
import { experience } from '../src/data/experience.ts'
import { socialTags } from '../scripts/site-meta.ts'

test('three project directions; NovaWing carries evidence and a complete flow', async () => {
  assert.equal(projects.length + 1, 3)
  assert.equal(novaWing.id, 'novawing')
  assert.equal(novaWing.flow.length, 6)
  assert.equal(new Set([novaWing.id, ...projects.map((p) => p.id)]).size, 3)
  await access(new URL(`../public${novaWing.image}`, import.meta.url))
})

test('all public resources use HTTPS; missing resume is honest', async () => {
  for (const href of [
    ...Object.values(links).filter(Boolean),
    ...articles.map((a) => a.href),
    ...openSource.map((a) => a.href),
  ]) {
    if (href === links.resume) continue
    assert.equal(new URL(href).protocol, 'https:')
  }
  if (links.resume) await access(new URL(`../public${links.resume}`, import.meta.url))
  else assert.equal(links.resume, null)
  assert.ok(navigation.every((link) => link.href.startsWith('#')))
})

test('content remains bounded and data-driven', () => {
  assert.equal(skills.length, 4)
  assert.ok(skills.every((skill) => skill.items.length > 0))
  assert.equal(experience.length, 3)
  assert.ok(
    experience.every((entry) => !Object.hasOwn(entry, 'company') && !Object.hasOwn(entry, 'date')),
  )
  assert.equal(articles[0].title, '页面级 Scope：复杂页面的状态边界')
})

test('sharing metadata uses trusted build origin and defers canonical', () => {
  assert.deepEqual(socialTags({}), [])
  const tags = socialTags({ VERCEL_PROJECT_PRODUCTION_URL: 'career-test.vercel.app' })
  assert.equal(
    tags.find((t) => t.attrs.property === 'og:image').attrs.content,
    'https://career-test.vercel.app/og.png',
  )
  assert.equal(
    tags.some((t) => t.tag === 'link'),
    false,
  )
  const custom = socialTags({ VITE_SITE_URL: 'https://career.example' })
  assert.equal(custom.find((t) => t.tag === 'link').attrs.href, 'https://career.example/')
  for (const url of [
    'http://career.example',
    'https://user:pass@career.example',
    'https://career.example/path',
    'https://career.example/?token=value',
  ]) {
    assert.throws(() => socialTags({ VITE_SITE_URL: url }))
  }
})

test('production artifact contains metadata, no starter, and no remote runtime assets', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
  assert.match(html, /魏建军 · 高级前端工程师 \/ AI Engineering/)
  assert.match(html, /og:description/)
  assert.match(html, /twitter:card/)
  assert.doesNotMatch(html, /Vite \+ Vue|src="https?:\/\//)
  await access(new URL('../dist/og.png', import.meta.url))
  await access(new URL('../dist/favicon.svg', import.meta.url))
})
