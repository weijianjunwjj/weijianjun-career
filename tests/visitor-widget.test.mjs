import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  OWNER_COOKIE,
  OWNER_STORAGE_KEY,
  WELCOME_COOKIE,
  WELCOME_STORAGE_KEY,
  buildFlagCookie,
  decideVisitorAdapter,
  hasPreviewQuery,
  isLoopbackHost,
  isOwnerExcluded,
  isValidBaiduHmId,
  isWelcomeShown,
  markWelcomeShown,
  parseOwnerHash,
  resolveBaiduHmId,
  resolveMainProjectId,
  resolveWorkProjectId,
  sanitizeVisitorEvent,
  sanitizeVisitorPath,
  setOwnerExcluded,
  shouldInjectBaiduScript,
  WELCOME_FALLBACK_MS,
} from '../src/shared/ownerExclude.ts'
import { BAIDU_SCRIPT_ATTR, CONTACT_CARD_ID, CONTACT_LAUNCHER_ID } from '../src/shared/visitorAdapter.ts'
import {
  buildMailtoHref,
  getVisitorWidgetDebugState,
  notifyVisitorRouteChange,
  resetVisitorWidgetForTests,
  setupVisitorWidget,
  welcomeCopy,
} from '../src/shared/visitorWidget.ts'

function memoryStorage() {
  const map = new Map()
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => {
      map.set(key, String(value))
    },
    removeItem: (key) => {
      map.delete(key)
    },
  }
}

function applySetCookie(existing, line) {
  const pair = line.split(';')[0]
  const idx = pair.indexOf('=')
  const name = pair.slice(0, idx).trim()
  const value = pair.slice(idx + 1).trim()
  const lower = line.toLowerCase()
  const map = new Map()
  for (const part of existing.split(';').map((item) => item.trim()).filter(Boolean)) {
    const eq = part.indexOf('=')
    map.set(part.slice(0, eq).trim(), part.slice(eq + 1).trim())
  }
  if (lower.includes('max-age=0') || value === '') map.delete(name)
  else map.set(name, value)
  return [...map.entries()].map(([key, val]) => `${key}=${val}`).join('; ')
}

function createEl(tag, registry) {
  const attrs = {}
  const listeners = {}
  const children = []
  const el = {
    tagName: String(tag).toUpperCase(),
    children,
    style: {},
    innerHTML: '',
    textContent: '',
    href: '',
    rel: '',
    src: '',
    async: false,
    charset: '',
    type: '',
    hidden: false,
    onerror: null,
    get id() {
      return attrs.id || ''
    },
    set id(value) {
      attrs.id = String(value || '')
      if (attrs.id) registry.byId.set(attrs.id, el)
    },
    setAttribute(name, value) {
      attrs[name] = String(value)
      if (name === 'id') el.id = String(value)
      if (name === 'src') el.src = String(value)
      if (name === 'href') el.href = String(value)
    },
    getAttribute(name) {
      if (name === 'id') return el.id || null
      if (name === 'src' && el.src) return el.src
      if (name === 'href' && el.href) return el.href
      return Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : null
    },
    removeAttribute(name) {
      delete attrs[name]
    },
    appendChild(child) {
      children.push(child)
      if (child?.id) registry.byId.set(child.id, child)
      registry.nodes.push(child)
      return child
    },
    addEventListener(type, fn) {
      listeners[type] = listeners[type] || []
      listeners[type].push(fn)
    },
    click() {
      for (const fn of listeners.click || []) fn({ type: 'click' })
    },
    dispatch(type, event) {
      const payload = event || { type }
      for (const fn of listeners[type] || []) fn(payload)
    },
    triggerError() {
      el.onerror?.({ type: 'error' })
      for (const fn of listeners.error || []) fn({ type: 'error' })
    },
    querySelector(sel) {
      const action = /data-action="([^"]+)"/.exec(sel)?.[1]
      if (!action) return null
      return children.find((child) => child.getAttribute?.('data-action') === action) || null
    },
  }
  registry.nodes.push(el)
  return el
}

function createHost(init = {}) {
  let cookie = init.cookie || ''
  const registry = { byId: new Map(), nodes: [], scripts: [] }
  const windowListeners = []
  const documentListeners = []
  const preloadedSrcs = []
  class MockImage {
    constructor() {
      this._src = ''
    }
    set src(value) {
      this._src = String(value)
      preloadedSrcs.push(this._src)
    }
    get src() {
      return this._src
    }
  }
  const location = {
    hostname: 'weijianjun.me',
    hash: '',
    search: '',
    pathname: '/',
    href: 'https://weijianjun.me/',
    protocol: 'https:',
    port: '',
    ...init.location,
  }
  const copied = { value: '' }
  const host = {
    location,
    history: {
      state: null,
      replaceState(_data, _title, url) {
        if (typeof url !== 'string') return
        const parsed = new URL(url, `${location.protocol}//${location.hostname}${location.pathname}`)
        location.pathname = parsed.pathname
        location.search = parsed.search
        location.hash = parsed.hash || ''
        location.href = parsed.toString()
      },
    },
    document: {
      visibilityState: init.visibilityState || 'visible',
      readyState: init.readyState || 'loading',
      get cookie() {
        return cookie
      },
      set cookie(value) {
        cookie = applySetCookie(cookie, value)
      },
      createElement(tag) {
        const el = createEl(tag, registry)
        if (String(tag).toLowerCase() === 'script') registry.scripts.push(el)
        return el
      },
      getElementById(id) {
        return registry.byId.get(id) || null
      },
      querySelector(sel) {
        if (sel.includes(BAIDU_SCRIPT_ATTR)) {
          return registry.scripts.find((el) => el.getAttribute(BAIDU_SCRIPT_ATTR) === '1') || null
        }
        return null
      },
      body: {
        appendChild(el) {
          if (el?.id) registry.byId.set(el.id, el)
          registry.nodes.push(el)
          return el
        },
        removeChild(el) {
          if (el?.id) registry.byId.delete(el.id)
        },
      },
      addEventListener(type, fn) {
        documentListeners.push([type, fn])
      },
      removeEventListener(type, fn) {
        const idx = documentListeners.findIndex((item) => item[0] === type && item[1] === fn)
        if (idx >= 0) documentListeners.splice(idx, 1)
      },
    },
    localStorage: init.localStorage || memoryStorage(),
    sessionStorage: init.sessionStorage || memoryStorage(),
    navigator: {
      clipboard: {
        writeText(value) {
          copied.value = String(value)
          return Promise.resolve()
        },
      },
    },
    copied,
    preloadedSrcs,
    Image: Object.prototype.hasOwnProperty.call(init, 'Image') ? init.Image : MockImage,
    requestIdleCallback: init.requestIdleCallback,
    cancelIdleCallback: init.cancelIdleCallback,
    addEventListener(type, fn) {
      windowListeners.push([type, fn])
    },
    removeEventListener(type, fn) {
      const idx = windowListeners.findIndex((item) => item[0] === type && item[1] === fn)
      if (idx >= 0) windowListeners.splice(idx, 1)
    },
    registry,
    emit(target, type, event) {
      const list = target === 'window' ? windowListeners : documentListeners
      for (const [name, fn] of list) {
        if (name === type) fn(event)
      }
    },
  }
  return host
}

function createTimers() {
  let seq = 0
  const items = []
  return {
    setTimeout(fn, ms) {
      const handle = ++seq
      items.push({ handle, fn, ms, cleared: false })
      return handle
    },
    clearTimeout(handle) {
      const found = items.find((item) => item.handle === handle)
      if (found) found.cleared = true
    },
    flush(ms) {
      for (const item of items) {
        if (!item.cleared && item.ms <= ms) {
          item.cleared = true
          item.fn()
        }
      }
    },
  }
}

const BAIDU_MAIN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const BAIDU_WORK = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
const BAIDU = { baiduHmIdMain: BAIDU_MAIN, baiduHmIdWork: BAIDU_WORK }

function mountWidget(host, extra = {}) {
  const timers = extra.timers || createTimers()
  const result = setupVisitorWidget({
    site: extra.site || 'main',
    host,
    baiduHmIdMain: extra.baiduHmIdMain,
    baiduHmIdWork: extra.baiduHmIdWork,
    fallbackDelayMs: extra.fallbackDelayMs ?? WELCOME_FALLBACK_MS,
    setTimeoutFn: timers.setTimeout,
    clearTimeoutFn: timers.clearTimeout,
  })
  return { result, timers }
}

function collectLive(node, out) {
  if (!node) return
  out.push(node)
  for (const child of node.children || []) collectLive(child, out)
}

function liveNodes(host) {
  const live = []
  for (const node of host.registry.byId.values()) collectLive(node, live)
  return live
}

function findAction(host, action) {
  return liveNodes(host).find((node) => node.getAttribute?.('data-action') === action) || null
}

function findField(host, name) {
  return liveNodes(host).find((item) => item.getAttribute?.('data-field') === name) || null
}

function statusBarText(host) {
  const bar = host.document.getElementById('wjj-owner-status')
  if (!bar) return ''
  return bar.children.map((child) => child.innerHTML || child.textContent || '').join('\n')
}

function httpScriptSrcs(host) {
  return host.registry.scripts.map((el) => el.src).filter((src) => /^https?:\/\//i.test(src))
}

function hmtPushes(host) {
  return Array.isArray(host._hmt) ? host._hmt.filter((item) => Array.isArray(item) && item[0] === '_trackPageview') : []
}

async function collectFiles(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await collectFiles(path)))
    else out.push(path)
  }
  return out
}

test('loopback hosts, preview query and Baidu id validation', () => {
  assert.equal(isLoopbackHost('localhost'), true)
  assert.equal(isLoopbackHost('127.0.0.1'), true)
  assert.equal(isLoopbackHost('::1'), true)
  assert.equal(isLoopbackHost('weijianjun.me'), false)
  assert.equal(isValidBaiduHmId(BAIDU_MAIN), true)
  assert.equal(isValidBaiduHmId('ABCDEF0123456789abcdef0123456789'), true)
  assert.equal(isValidBaiduHmId('123456'), false)
  assert.equal(isValidBaiduHmId('gggggggggggggggggggggggggggggggg'), false)
  assert.equal(isValidBaiduHmId(''), false)
  assert.equal(hasPreviewQuery('?visitor-preview=1'), true)
  assert.equal(hasPreviewQuery('?tawk-preview=1'), false)
  assert.equal(hasPreviewQuery('?foo=1'), false)
})

test('baidu id selection prefers work id and falls back to main', () => {
  assert.equal(resolveBaiduHmId({ site: 'main', mainId: BAIDU_MAIN, workId: BAIDU_WORK }), BAIDU_MAIN)
  assert.equal(resolveBaiduHmId({ site: 'work', mainId: BAIDU_MAIN, workId: BAIDU_WORK }), BAIDU_WORK)
  assert.equal(resolveBaiduHmId({ site: 'work', mainId: BAIDU_MAIN, workId: '' }), BAIDU_MAIN)
  assert.equal(resolveBaiduHmId({ site: 'work', mainId: '', workId: '' }), '')
  assert.equal(resolveBaiduHmId({ site: 'main', mainId: 'bad', workId: BAIDU_WORK }), '')
  assert.equal(
    shouldInjectBaiduScript({ ownerExcluded: false, hostname: 'weijianjun.me', hmId: BAIDU_MAIN }),
    true,
  )
  assert.equal(
    shouldInjectBaiduScript({ ownerExcluded: true, hostname: 'weijianjun.me', hmId: BAIDU_MAIN }),
    false,
  )
  assert.equal(
    shouldInjectBaiduScript({ ownerExcluded: false, hostname: 'localhost', hmId: BAIDU_MAIN }),
    false,
  )
})

test('owner exclude dual persistence on production domain', () => {
  let cookie = ''
  const localStorage = memoryStorage()
  const io = {
    hostname: 'weijianjun.me',
    protocol: 'https:',
    getCookie: () => cookie,
    setCookie: (value) => {
      cookie = applySetCookie(cookie, value)
    },
    localStorage,
  }

  assert.equal(isOwnerExcluded(io), false)
  setOwnerExcluded(io, true)
  assert.match(cookie, /wjj_owner_exclude=1/)
  assert.match(
    buildFlagCookie(OWNER_COOKIE, { hostname: 'work.weijianjun.me', protocol: 'https:', persistent: true }),
    /Domain=\.weijianjun\.me/,
  )
  assert.match(
    buildFlagCookie(OWNER_COOKIE, { hostname: 'work.weijianjun.me', protocol: 'https:', persistent: true }),
    /Max-Age=31536000/,
  )
  assert.equal(localStorage.getItem(OWNER_STORAGE_KEY), '1')
  assert.equal(isOwnerExcluded(io), true)

  setOwnerExcluded(io, false)
  assert.equal(isOwnerExcluded(io), false)
  assert.equal(localStorage.getItem(OWNER_STORAGE_KEY), null)
})

test('local non-target domain falls back to host-only cookie', () => {
  const line = buildFlagCookie(OWNER_COOKIE, {
    hostname: '127.0.0.1',
    protocol: 'http:',
    persistent: true,
  })
  assert.doesNotMatch(line, /Domain=/)
  assert.doesNotMatch(line, /Secure/)
})

test('owner hash parsing and unmarked visitors pass through', () => {
  assert.equal(parseOwnerHash('#owner-exclude'), 'exclude')
  assert.equal(parseOwnerHash('#owner-include'), 'include')
  assert.equal(parseOwnerHash('#owner-status'), 'status')
  assert.equal(parseOwnerHash('#courier'), null)
  const io = {
    hostname: 'weijianjun.me',
    getCookie: () => '',
    setCookie() {},
    localStorage: memoryStorage(),
  }
  assert.equal(isOwnerExcluded(io), false)
})

test('adapter decision: owner, loopback, baidu, preview, none', () => {
  assert.deepEqual(
    decideVisitorAdapter({
      ownerExcluded: true,
      hostname: 'weijianjun.me',
      search: '',
    }),
    { adapter: 'none', reason: 'owner' },
  )
  assert.deepEqual(
    decideVisitorAdapter({
      ownerExcluded: false,
      hostname: 'localhost',
      search: '',
    }),
    { adapter: 'none', reason: 'loopback' },
  )
  assert.equal(
    decideVisitorAdapter({
      ownerExcluded: false,
      hostname: 'localhost',
      search: '?visitor-preview=1',
    }).adapter,
    'preview',
  )
  assert.equal(
    decideVisitorAdapter({
      ownerExcluded: false,
      hostname: 'weijianjun.me',
      search: '',
    }).adapter,
    'baidu',
  )
  assert.equal(
    decideVisitorAdapter({
      ownerExcluded: false,
      hostname: 'work.weijianjun.me',
      search: '',
    }).adapter,
    'baidu',
  )
  assert.deepEqual(
    decideVisitorAdapter({
      ownerExcluded: false,
      hostname: 'example.com',
      search: '',
    }),
    { adapter: 'none', reason: 'none' },
  )
})

test('owner hash writes flags, strips url and never mounts a channel', () => {
  resetVisitorWidgetForTests()
  const host = createHost({ location: { hostname: 'weijianjun.me', hash: '#owner-exclude', protocol: 'https:' } })
  const { result } = mountWidget(host, BAIDU)
  assert.equal(result.mounted, false)
  assert.equal(result.adapter, 'none')
  assert.equal(result.reason, 'owner')
  assert.equal(host.location.hash, '')
  assert.equal(host.registry.scripts.length, 0)
  assert.equal(host._hmt, undefined)
  assert.equal(host.localStorage.getItem(OWNER_STORAGE_KEY), '1')
  assert.match(host.document.cookie, new RegExp(`${OWNER_COOKIE}=1`))
  assert.ok(host.document.getElementById('wjj-owner-status'))
  assert.equal(host.document.getElementById(CONTACT_LAUNCHER_ID), null)
})

test('unmarked production visitor injects baidu script once with valid id', () => {
  resetVisitorWidgetForTests()
  const host = createHost()
  const { result } = mountWidget(host, BAIDU)
  assert.equal(result.mounted, true)
  assert.equal(result.adapter, 'baidu')
  assert.equal(httpScriptSrcs(host).length, 1)
  assert.equal(httpScriptSrcs(host)[0], `https://hm.baidu.com/hm.js?${BAIDU_MAIN}`)
  assert.equal(host.registry.scripts[0].getAttribute(BAIDU_SCRIPT_ATTR), '1')
  assert.ok(Array.isArray(host._hmt))
})

test('production visitor without baidu id still mounts contact channel with zero remote scripts', () => {
  resetVisitorWidgetForTests()
  const host = createHost()
  const { result, timers } = mountWidget(host)
  assert.equal(result.adapter, 'baidu')
  assert.equal(result.mounted, true)
  assert.equal(httpScriptSrcs(host).length, 0)
  assert.equal(host._hmt, undefined)
  assert.ok(host.document.getElementById(CONTACT_LAUNCHER_ID))
  timers.flush(2500)
  assert.ok(host.document.getElementById('wjj-welcome-bubble'))
})

test('launcher is immediately visible at bottom-right; welcome pops at 2500ms; owner hides all surfaces', () => {
  assert.equal(WELCOME_FALLBACK_MS, 2500)
  resetVisitorWidgetForTests()
  const host = createHost()
  const { timers } = mountWidget(host, BAIDU)
  const launcher = host.document.getElementById(CONTACT_LAUNCHER_ID)
  assert.ok(launcher)
  assert.equal(launcher.getAttribute('aria-label'), '聊聊 / 联系魏建军')
  assert.equal(host.document.getElementById('wjj-welcome-bubble'), null)
  timers.flush(2499)
  assert.equal(host.document.getElementById('wjj-welcome-bubble'), null)
  assert.ok(host.document.getElementById(CONTACT_LAUNCHER_ID))
  timers.flush(2500)
  assert.ok(host.document.getElementById('wjj-welcome-bubble'))
  assert.ok(host.document.getElementById(CONTACT_LAUNCHER_ID))
  const style = host.document.getElementById('wjj-visitor-widget-style')
  assert.ok(style)
  assert.match(style.textContent, /#wjj-contact-launcher \{[\s\S]*right:\s*24px/)
  assert.match(style.textContent, /#wjj-contact-launcher \{[\s\S]*bottom:\s*24px/)
  assert.match(style.textContent, /#wjj-contact-launcher \{[\s\S]*z-index:\s*60/)
  assert.match(style.textContent, /#wjj-welcome-bubble \{[\s\S]*right:\s*24px/)
  assert.match(style.textContent, /#wjj-welcome-bubble \{[\s\S]*bottom:\s*82px/)
  assert.match(style.textContent, /#wjj-contact-card \{[\s\S]*right:\s*24px/)
  assert.match(style.textContent, /#wjj-contact-card \{[\s\S]*bottom:\s*24px/)
  assert.match(style.textContent, /@media \(max-width: 640px\)/)
  findAction(host, 'chat').click()
  assert.ok(host.document.getElementById(CONTACT_CARD_ID))
  assert.equal(host.document.getElementById(CONTACT_LAUNCHER_ID), null)
  assert.equal(host.document.getElementById('wjj-welcome-bubble'), null)

  resetVisitorWidgetForTests()
  const ownerHost = createHost({
    location: { hostname: 'weijianjun.me', hash: '#owner-exclude', protocol: 'https:' },
  })
  const ownerMount = mountWidget(ownerHost, BAIDU)
  ownerMount.timers.flush(2500)
  assert.equal(ownerHost.document.getElementById('wjj-welcome-bubble'), null)
  assert.equal(ownerHost.document.getElementById(CONTACT_CARD_ID), null)
  assert.equal(ownerHost.document.getElementById(CONTACT_LAUNCHER_ID), null)
})

test('loopback default skips channel; preview query enables local contact card without hm.js', () => {
  resetVisitorWidgetForTests()
  const blocked = createHost({
    location: { hostname: '127.0.0.1', protocol: 'http:', port: '5173', hash: '', search: '' },
  })
  assert.equal(mountWidget(blocked, BAIDU).result.mounted, false)
  assert.equal(blocked.registry.scripts.length, 0)
  assert.equal(blocked._hmt, undefined)
  assert.equal(blocked.document.getElementById(CONTACT_LAUNCHER_ID), null)

  resetVisitorWidgetForTests()
  const preview = createHost({
    location: {
      hostname: '127.0.0.1',
      protocol: 'http:',
      port: '5173',
      search: '?visitor-preview=1',
    },
  })
  const mounted = mountWidget(preview, BAIDU)
  assert.equal(mounted.result.adapter, 'preview')
  assert.equal(mounted.result.mounted, true)
  assert.equal(httpScriptSrcs(preview).length, 0)
  assert.equal(preview._hmt, undefined)
  assert.ok(preview.document.getElementById(CONTACT_LAUNCHER_ID))
})

test('welcome shown cookie is session-only and shared on production domain', () => {
  const session = buildFlagCookie(WELCOME_COOKIE, {
    hostname: 'work.weijianjun.me',
    protocol: 'https:',
    persistent: false,
  })
  assert.match(session, /Domain=\.weijianjun\.me/)
  assert.doesNotMatch(session, /Max-Age/)
  assert.doesNotMatch(session, /Expires/i)

  let cookie = ''
  const sessionStorage = memoryStorage()
  const io = {
    hostname: 'weijianjun.me',
    protocol: 'https:',
    getCookie: () => cookie,
    setCookie: (value) => {
      cookie = applySetCookie(cookie, value)
    },
    sessionStorage,
  }
  assert.equal(isWelcomeShown(io), false)
  markWelcomeShown(io)
  assert.equal(isWelcomeShown(io), true)
  assert.equal(sessionStorage.getItem(WELCOME_STORAGE_KEY), '1')
})

test('welcome copy adapts to project and mailto encodes the Chinese title', () => {
  assert.equal(
    welcomeCopy('lowcode'),
    '正在看「企业级低代码引擎」？有想交流的技术细节或岗位机会，欢迎直接联系我。',
  )
  assert.equal(
    welcomeCopy(),
    '你好，正在看哪个项目？有想交流的技术细节或岗位机会，欢迎直接联系我。',
  )
  const href = buildMailtoHref('lowcode')
  assert.ok(href.startsWith('mailto:2661043132@qq.com?'))
  assert.ok(href.includes(encodeURIComponent('交流《企业级低代码引擎》项目 / 岗位沟通')))
  assert.doesNotMatch(href, /target=/)
})

test('single-visit welcome: first allowed, refresh/route/cross-site blocked, owner never, no empty bubble', () => {
  resetVisitorWidgetForTests()
  const storage = memoryStorage()
  const sessionStorage = memoryStorage()
  const host = createHost({ localStorage: storage, sessionStorage })
  const { timers } = mountWidget(host, BAIDU)
  assert.ok(host.document.getElementById(CONTACT_LAUNCHER_ID))
  timers.flush(2500)
  assert.ok(host.document.getElementById('wjj-welcome-bubble'))
  assert.ok(host.document.getElementById(CONTACT_LAUNCHER_ID))
  assert.match(host.document.cookie, new RegExp(`${WELCOME_COOKIE}=1`))

  resetVisitorWidgetForTests()
  const refreshed = createHost({
    cookie: host.document.cookie,
    localStorage: storage,
    sessionStorage,
  })
  const again = mountWidget(refreshed, BAIDU)
  again.timers.flush(2500)
  assert.equal(refreshed.document.getElementById('wjj-welcome-bubble'), null)
  assert.ok(refreshed.document.getElementById(CONTACT_LAUNCHER_ID))

  resetVisitorWidgetForTests()
  const workHost = createHost({
    cookie: host.document.cookie,
    localStorage: memoryStorage(),
    sessionStorage,
    location: { hostname: 'work.weijianjun.me', protocol: 'https:', pathname: '/projects/courier' },
  })
  const workMount = mountWidget(workHost, { site: 'work', ...BAIDU })
  workMount.timers.flush(2500)
  assert.equal(workHost.document.getElementById('wjj-welcome-bubble'), null)

  resetVisitorWidgetForTests()
  const ownerHost = createHost()
  setOwnerExcluded(
    {
      hostname: ownerHost.location.hostname,
      protocol: ownerHost.location.protocol,
      getCookie: () => ownerHost.document.cookie,
      setCookie: (value) => {
        ownerHost.document.cookie = value
      },
      localStorage: ownerHost.localStorage,
    },
    true,
  )
  const ownerMount = mountWidget(ownerHost, BAIDU)
  assert.equal(ownerMount.result.mounted, false)
  ownerMount.timers.flush(2500)
  assert.equal(ownerHost.document.getElementById('wjj-welcome-bubble'), null)
  assert.equal(ownerHost.document.getElementById(CONTACT_CARD_ID), null)
  assert.equal(ownerHost.document.getElementById(CONTACT_LAUNCHER_ID), null)
  assert.equal(ownerHost.registry.scripts.length, 0)
  assert.equal(ownerHost._hmt, undefined)

  resetVisitorWidgetForTests()
  const empty = createHost({ location: { hostname: 'example.com', protocol: 'https:' } })
  const emptyMount = mountWidget(empty)
  assert.equal(emptyMount.result.adapter, 'none')
  emptyMount.timers.flush(2500)
  assert.equal(empty.document.getElementById('wjj-welcome-bubble'), null)
})

test('visible page shows welcome once; hidden page does not; returning visible reschedules', () => {
  resetVisitorWidgetForTests()
  const visible = createHost({ visibilityState: 'visible' })
  const visibleMount = mountWidget(visible, BAIDU)
  visibleMount.timers.flush(2500)
  assert.ok(visible.document.getElementById('wjj-welcome-bubble'))

  resetVisitorWidgetForTests()
  const hidden = createHost({ visibilityState: 'hidden' })
  const hiddenMount = mountWidget(hidden, BAIDU)
  hiddenMount.timers.flush(2500)
  assert.equal(hidden.document.getElementById('wjj-welcome-bubble'), null)
  assert.equal(getVisitorWidgetDebugState().hasFallbackTimer, false)

  hidden.document.visibilityState = 'visible'
  hidden.emit('document', 'visibilitychange', { type: 'visibilitychange' })
  assert.equal(getVisitorWidgetDebugState().hasFallbackTimer, true)
  hidden.document.visibilityState = 'hidden'
  hidden.emit('document', 'visibilitychange', { type: 'visibilitychange' })
  assert.equal(getVisitorWidgetDebugState().hasFallbackTimer, false)
})

test('anonymous event whitelist drops PII and unknown fields', () => {
  const clean = sanitizeVisitorEvent({
    site: 'work',
    path: '/projects/courier/mini?email=ada@example.com#secret',
    projectId: 'courier',
    title: '魏建军私人电话 18352517082',
    email: 'ada@example.com',
    message: 'hello',
  })
  assert.deepEqual(clean, { site: 'work', path: '/projects/courier/mini', project: 'courier' })
  assert.equal(Object.keys(clean).join(','), 'site,path,project')
  assert.equal(sanitizeVisitorPath('/inbox/ada@example.com'), '/')
  assert.equal(sanitizeVisitorPath('/projects/lowcode/'), '/projects/lowcode')
  assert.equal(sanitizeVisitorEvent({ site: 'main', path: '/#courier', projectId: 'spy' }).project, undefined)
  assert.equal(resolveMainProjectId('#analytics'), 'analytics')
  assert.equal(resolveMainProjectId('#owner-exclude'), undefined)
  assert.equal(resolveWorkProjectId('/projects/lowcode/'), 'lowcode')
})

test('SPA trackPageview skips the landing duplicate and de-dupes the same path', () => {
  resetVisitorWidgetForTests()
  const host = createHost({
    location: { hostname: 'work.weijianjun.me', protocol: 'https:', pathname: '/projects/lowcode/' },
  })
  mountWidget(host, { site: 'work', ...BAIDU })
  assert.equal(httpScriptSrcs(host)[0], `https://hm.baidu.com/hm.js?${BAIDU_WORK}`)
  notifyVisitorRouteChange({ site: 'work', path: '/projects/lowcode', title: 'x', projectId: 'lowcode' })
  assert.equal(hmtPushes(host).length, 0)
  notifyVisitorRouteChange({ site: 'work', path: '/projects/lowcode', title: 'y', projectId: 'lowcode' })
  assert.equal(hmtPushes(host).length, 0)
  notifyVisitorRouteChange({ site: 'work', path: '/projects/analytics', projectId: 'analytics', email: 'ada@x.com' })
  assert.deepEqual(hmtPushes(host), [['_trackPageview', '/projects/analytics']])
  notifyVisitorRouteChange({ site: 'work', path: '/projects/analytics', projectId: 'analytics' })
  assert.equal(hmtPushes(host).length, 1)
  assert.ok(!JSON.stringify(getVisitorWidgetDebugState().lastEvent).includes('@'))
})

test('wechat qr css uses contain not cover, and img keeps 888:1131 ratio', () => {
  resetVisitorWidgetForTests()
  const host = createHost({
    location: {
      hostname: '127.0.0.1',
      protocol: 'http:',
      port: '4173',
      search: '?visitor-preview=1',
    },
  })
  const { timers } = mountWidget(host)
  timers.flush(2500)
  findAction(host, 'chat').click()
  const style = host.document.getElementById('wjj-visitor-widget-style')
  assert.ok(style)
  assert.match(style.textContent, /img\[data-field="wechat-qr"\][\s\S]*object-fit:\s*contain/)
  assert.doesNotMatch(style.textContent, /object-fit:\s*cover/)
  assert.match(style.textContent, /width:\s*184px/)
  assert.match(style.textContent, /height:\s*auto/)
  const qr = findField(host, 'wechat-qr')
  assert.equal(qr.getAttribute('width'), '184')
  assert.equal(qr.getAttribute('height'), '234')
})

test('openChat opens contact card with mailto, copy, and wechat onerror fallback', async () => {
  resetVisitorWidgetForTests()
  const host = createHost({
    location: {
      hostname: '127.0.0.1',
      protocol: 'http:',
      port: '4174',
      pathname: '/projects/lowcode/',
      search: '?visitor-preview=1',
    },
  })
  const { timers } = mountWidget(host, { site: 'work' })
  notifyVisitorRouteChange({ site: 'work', path: '/projects/lowcode', projectId: 'lowcode' })
  timers.flush(2500)
  assert.ok(host.document.getElementById('wjj-welcome-bubble'))
  assert.match(findField(host, 'welcome-copy').textContent, /企业级低代码引擎/)
  findAction(host, 'chat').click()
  assert.equal(host.document.getElementById('wjj-welcome-bubble'), null)
  assert.ok(host.document.getElementById(CONTACT_CARD_ID))
  const mail = findAction(host, 'mailto')
  assert.ok(mail.href.startsWith('mailto:2661043132@qq.com?'))
  assert.ok(mail.href.includes(encodeURIComponent('交流《企业级低代码引擎》项目 / 岗位沟通')))
  assert.equal(mail.target, undefined)
  assert.equal(mail.getAttribute('target'), null)

  findAction(host, 'copy-email').click()
  await Promise.resolve()
  assert.equal(host.copied.value, '2661043132@qq.com')
  assert.equal(findAction(host, 'copy-email').textContent, '已复制')

  const qr = findField(host, 'wechat-qr')
  assert.equal(qr.src, '/contact/wechat-qr.webp')
  assert.doesNotMatch(qr.src, /mini-qr/)
  qr.triggerError()
  assert.equal(qr.src, '/contact/wechat-qr.jpg')
  assert.equal(qr.hidden, false)
  qr.triggerError()
  assert.equal(qr.hidden, true)
  const placeholder = findField(host, 'wechat-placeholder')
  assert.equal(placeholder.hidden, false)
  assert.match(placeholder.textContent, /18352517082/)
  findAction(host, 'copy-wechat').click()
  await Promise.resolve()
  assert.equal(host.copied.value, '18352517082')
  assert.equal(findAction(host, 'copy-wechat').textContent, '已复制')

  findAction(host, 'close').click()
  assert.equal(host.document.getElementById(CONTACT_CARD_ID), null)
  assert.ok(host.document.getElementById(CONTACT_LAUNCHER_ID))
  findAction(host, 'launcher').click()
  assert.ok(host.document.getElementById(CONTACT_CARD_ID))
})

test('wechat qr jpg exists on both sites and both dist trees with identical SHA-256', async () => {
  const files = [
    '../public/contact/wechat-qr.jpg',
    '../work/public/contact/wechat-qr.jpg',
    '../dist/contact/wechat-qr.jpg',
    '../dist-work/contact/wechat-qr.jpg',
  ]
  const hashes = []
  for (const rel of files) {
    const data = await readFile(new URL(rel, import.meta.url))
    assert.equal(data.length, 178898, `${rel} jpg size must stay 178898`)
    assert.equal(data[0], 0xff, `${rel} must be a JPEG`)
    assert.equal(data[1], 0xd8, `${rel} must be a JPEG`)
    hashes.push(createHash('sha256').update(data).digest('hex').toUpperCase())
  }
  assert.equal(new Set(hashes).size, 1)
  assert.equal(hashes[0], '7FD614ABE07A34F905F561F3FDD6E4969EC6B98B3BAD00F636934C13CA94B53C')
})

test('wechat qr webp exists on both sites and both dist trees, identical and lighter than jpg', async () => {
  const files = [
    '../public/contact/wechat-qr.webp',
    '../work/public/contact/wechat-qr.webp',
    '../dist/contact/wechat-qr.webp',
    '../dist-work/contact/wechat-qr.webp',
  ]
  const hashes = []
  const sizes = []
  for (const rel of files) {
    const data = await readFile(new URL(rel, import.meta.url))
    assert.ok(data.length < 40 * 1024, `${rel} must stay under 40KB, got ${data.length}`)
    assert.ok(data.length < 178898 / 2, `${rel} must be substantially smaller than jpg`)
    assert.equal(data[0], 0x52, `${rel} must be a WebP`)
    assert.equal(String.fromCharCode(...data.slice(0, 4)), 'RIFF')
    hashes.push(createHash('sha256').update(data).digest('hex').toUpperCase())
    sizes.push(data.length)
  }
  assert.equal(new Set(hashes).size, 1)
  assert.equal(new Set(sizes).size, 1)
})

test('non-owner visitor preloads wechat webp once after load idle, and hover does not double-fetch', () => {
  resetVisitorWidgetForTests()
  const host = createHost({
    readyState: 'complete',
    location: {
      hostname: '127.0.0.1',
      protocol: 'http:',
      port: '4173',
      search: '?visitor-preview=1',
    },
  })
  const { timers } = mountWidget(host)
  assert.deepEqual(host.preloadedSrcs, [])
  assert.equal(getVisitorWidgetDebugState().qrPreloaded, false)
  timers.flush(1199)
  assert.deepEqual(host.preloadedSrcs, [])
  timers.flush(1200)
  assert.deepEqual(host.preloadedSrcs, ['/contact/wechat-qr.webp'])
  assert.equal(getVisitorWidgetDebugState().qrPreloaded, true)
  findAction(host, 'launcher').dispatch('pointerenter')
  findAction(host, 'launcher').dispatch('focus')
  findAction(host, 'launcher').dispatch('touchstart')
  assert.deepEqual(host.preloadedSrcs, ['/contact/wechat-qr.webp'])
})

test('hover/focus/touch on launcher or welcome bubble preloads immediately if idle has not run', () => {
  resetVisitorWidgetForTests()
  const host = createHost({
    readyState: 'loading',
    location: {
      hostname: '127.0.0.1',
      protocol: 'http:',
      port: '4173',
      search: '?visitor-preview=1',
    },
  })
  const { timers } = mountWidget(host)
  assert.deepEqual(host.preloadedSrcs, [])
  findAction(host, 'launcher').dispatch('pointerenter')
  assert.deepEqual(host.preloadedSrcs, ['/contact/wechat-qr.webp'])
  timers.flush(2500)
  const bubble = host.document.getElementById('wjj-welcome-bubble')
  assert.ok(bubble)
  bubble.dispatch('focus')
  bubble.dispatch('touchstart')
  host.emit('window', 'load', { type: 'load' })
  timers.flush(1200)
  assert.deepEqual(host.preloadedSrcs, ['/contact/wechat-qr.webp'])
})

test('requestIdleCallback path preloads once with timeout 2500', () => {
  resetVisitorWidgetForTests()
  let idleFn
  let idleOpts
  const host = createHost({
    readyState: 'complete',
    location: {
      hostname: '127.0.0.1',
      protocol: 'http:',
      port: '4173',
      search: '?visitor-preview=1',
    },
    requestIdleCallback(fn, opts) {
      idleFn = fn
      idleOpts = opts
      return 7
    },
  })
  mountWidget(host)
  assert.equal(idleOpts.timeout, 2500)
  assert.deepEqual(host.preloadedSrcs, [])
  idleFn()
  assert.deepEqual(host.preloadedSrcs, ['/contact/wechat-qr.webp'])
  idleFn()
  assert.equal(host.preloadedSrcs.length, 1)
})

test('owner exclude never preloads qr and injects no contact UI', () => {
  resetVisitorWidgetForTests()
  const host = createHost({
    readyState: 'complete',
    location: { hostname: 'weijianjun.me', hash: '#owner-exclude', protocol: 'https:' },
  })
  const { timers, result } = mountWidget(host, BAIDU)
  timers.flush(2500)
  host.emit('window', 'load', { type: 'load' })
  timers.flush(1200)
  assert.equal(result.mounted, false)
  assert.deepEqual(host.preloadedSrcs, [])
  assert.equal(getVisitorWidgetDebugState().qrPreloaded, false)
  assert.equal(host.document.getElementById(CONTACT_LAUNCHER_ID), null)
  assert.equal(host.document.getElementById('wjj-welcome-bubble'), null)
  assert.equal(host.document.getElementById(CONTACT_CARD_ID), null)
})

test('source, env, workflow and built html have zero tawk/pop800 residue and no static remote scripts', async () => {
  const root = fileURLToPath(new URL('..', import.meta.url))
  const files = [
    ...(await collectFiles(join(root, 'src'))),
    join(root, '.env.example'),
    join(root, '.github', 'workflows', 'deploy-pages.yml'),
    join(root, 'dist', 'index.html'),
    join(root, 'dist-work', 'index.html'),
  ]
  for (const dir of [join(root, 'dist', 'assets'), join(root, 'dist-work', 'assets')]) {
    try {
      files.push(...(await collectFiles(dir)).filter((file) => /\.(js|css|html|map)$/i.test(file)))
    } catch {
      // 构建前可能尚无产物；pnpm test 在 build:all 之后跑
    }
  }
  const banned = [/tawk\.to/i, /embed\.tawk\.to/, /VITE_TAWK_/, /Tawk_API/, /pop800/i, /VITE_POP800_/]
  for (const file of files) {
    if (!/\.(ts|vue|js|mjs|css|html|yml|example|map)$/i.test(file)) continue
    const text = await readFile(file, 'utf8')
    for (const pattern of banned) {
      assert.doesNotMatch(text, pattern, `${file} still matches ${pattern}`)
    }
  }

  for (const rel of ['../index.html', '../work/index.html', '../dist/index.html', '../dist-work/index.html']) {
    const html = await readFile(new URL(rel, import.meta.url), 'utf8')
    assert.doesNotMatch(html, /src="https?:\/\//)
    assert.doesNotMatch(html, /embed\.tawk\.to/)
    assert.doesNotMatch(html, /tawk\.to/i)
    assert.doesNotMatch(html, /pop800/i)
  }
})

test('replaceState without writing location.hash still clears owner hash', () => {
  resetVisitorWidgetForTests()
  const host = createHost({ location: { hostname: 'weijianjun.me', hash: '#owner-exclude', protocol: 'https:' } })
  mountWidget(host)
  assert.equal(host.location.hash, '')
  assert.doesNotMatch(host.location.href, /#$/)
})

test('enabling exclude after mount cancels timer, hides surfaces, stops tracking, and asks to refresh', () => {
  resetVisitorWidgetForTests()
  const host = createHost()
  const { result, timers } = mountWidget(host, BAIDU)
  assert.equal(result.mounted, true)
  notifyVisitorRouteChange({ site: 'main', path: '/#courier', projectId: 'courier' })
  assert.equal(getVisitorWidgetDebugState().hasFallbackTimer, true)
  timers.flush(2500)
  assert.ok(host.document.getElementById('wjj-welcome-bubble'))
  findAction(host, 'chat').click()
  assert.ok(host.document.getElementById(CONTACT_CARD_ID))
  assert.ok(httpScriptSrcs(host).length >= 1)

  host.location.hash = '#owner-exclude'
  host.emit('window', 'hashchange', { type: 'hashchange' })

  assert.equal(getVisitorWidgetDebugState().hasFallbackTimer, false)
  assert.equal(getVisitorWidgetDebugState().lastEvent, null)
  assert.equal(host.document.getElementById('wjj-welcome-bubble'), null)
  assert.equal(host.document.getElementById(CONTACT_CARD_ID), null)
  assert.equal(host.document.getElementById(CONTACT_LAUNCHER_ID), null)
  const trackedBefore = hmtPushes(host).length
  notifyVisitorRouteChange({ site: 'main', path: '/#analytics', projectId: 'analytics' })
  assert.equal(hmtPushes(host).length, trackedBefore)
  assert.match(statusBarText(host), /请刷新一次页面以彻底断开连接/)
  assert.equal(host.location.hash, '')
})

test('toggle exclude after mount also stops live surface; unmounted exclude does not ask to refresh', () => {
  resetVisitorWidgetForTests()
  const injectedHost = createHost()
  const injectedMount = mountWidget(injectedHost, BAIDU)
  assert.equal(injectedMount.result.mounted, true)
  assert.equal(getVisitorWidgetDebugState().hasFallbackTimer, true)

  injectedHost.location.hash = '#owner-status'
  injectedHost.emit('window', 'hashchange', { type: 'hashchange' })
  findAction(injectedHost, 'toggle').click()
  assert.equal(getVisitorWidgetDebugState().hasFallbackTimer, false)
  assert.equal(getVisitorWidgetDebugState().lastEvent, null)
  assert.equal(injectedHost.document.getElementById(CONTACT_LAUNCHER_ID), null)
  assert.match(statusBarText(injectedHost), /请刷新一次页面以彻底断开连接/)

  resetVisitorWidgetForTests()
  const skipped = createHost({
    location: { hostname: '127.0.0.1', protocol: 'http:', port: '5173', hash: '', search: '' },
  })
  const skippedMount = mountWidget(skipped)
  assert.equal(skippedMount.result.mounted, false)
  skipped.location.hash = '#owner-status'
  skipped.emit('window', 'hashchange', { type: 'hashchange' })
  findAction(skipped, 'toggle').click()
  assert.match(statusBarText(skipped), /站长排除已开启/)
  assert.doesNotMatch(statusBarText(skipped), /请刷新/)
})

test('clearing owner exclude on production domain also drops host-only cookie', () => {
  const writes = []
  const localStorage = memoryStorage()
  const io = {
    hostname: 'weijianjun.me',
    protocol: 'https:',
    getCookie: () => '',
    setCookie: (value) => {
      writes.push(value)
    },
    localStorage,
  }

  setOwnerExcluded(io, false)
  assert.equal(writes.length, 2)
  assert.match(writes[0], /Max-Age=0/)
  assert.match(writes[0], /Domain=\.weijianjun\.me/)
  assert.match(writes[1], /Max-Age=0/)
  assert.doesNotMatch(writes[1], /Domain=/)
  assert.equal(localStorage.getItem(OWNER_STORAGE_KEY), null)
})
