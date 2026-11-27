import test from 'node:test'
import assert from 'node:assert/strict'
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
  isValidPop800JobNo,
  isValidPop800Ukey,
  isWelcomeShown,
  markWelcomeShown,
  parseOwnerHash,
  resolveMainProjectId,
  resolveWorkProjectId,
  sanitizeVisitorEvent,
  sanitizeVisitorPath,
  setOwnerExcluded,
} from '../src/shared/ownerExclude.ts'
import { POP800_SCRIPT_ATTR, POP800_SLOT_ID, RECEIPT_ID } from '../src/shared/visitorAdapter.ts'
import {
  getVisitorWidgetDebugState,
  notifyVisitorRouteChange,
  resetVisitorWidgetForTests,
  setupVisitorWidget,
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
    },
    getAttribute(name) {
      if (name === 'id') return el.id || null
      return Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : null
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
        if (sel.includes(POP800_SCRIPT_ATTR)) {
          return registry.scripts.find((el) => el.getAttribute(POP800_SCRIPT_ATTR) === '1') || null
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
    addEventListener(type, fn) {
      windowListeners.push([type, fn])
    },
    removeEventListener(type, fn) {
      const idx = windowListeners.findIndex((item) => item[0] === type && item[1] === fn)
      if (idx >= 0) windowListeners.splice(idx, 1)
    },
    POP800: init.POP800,
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

const POP800 = { jobNo: '123456', ukey: 'abcDEF99' }

function mountWidget(host, extra = {}) {
  const timers = extra.timers || createTimers()
  const result = setupVisitorWidget({
    site: extra.site || 'main',
    host,
    jobNo: extra.jobNo,
    ukey: extra.ukey,
    fallbackDelayMs: extra.fallbackDelayMs ?? 4000,
    setTimeoutFn: timers.setTimeout,
    clearTimeoutFn: timers.clearTimeout,
  })
  return { result, timers }
}

function findAction(host, action) {
  return host.registry.nodes.find((node) => node.getAttribute?.('data-action') === action) || null
}

function statusBarText(host) {
  const bar = host.document.getElementById('wjj-owner-status')
  if (!bar) return ''
  return bar.children.map((child) => child.innerHTML || child.textContent || '').join('\n')
}

function fieldText(host, name) {
  const node = host.registry.nodes.find((item) => item.getAttribute?.('data-field') === name)
  return node?.textContent || ''
}

function httpScriptSrcs(host) {
  return host.registry.scripts.map((el) => el.src).filter((src) => /^https?:\/\//i.test(src))
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

test('loopback hosts, preview query and POP800 id validation', () => {
  assert.equal(isLoopbackHost('localhost'), true)
  assert.equal(isLoopbackHost('127.0.0.1'), true)
  assert.equal(isLoopbackHost('::1'), true)
  assert.equal(isLoopbackHost('weijianjun.me'), false)
  assert.equal(isValidPop800JobNo('123456'), true)
  assert.equal(isValidPop800JobNo('abcDEF123'), false)
  assert.equal(isValidPop800JobNo(''), false)
  assert.equal(isValidPop800Ukey('abcDEF99'), true)
  assert.equal(isValidPop800Ukey('bad/id'), false)
  assert.equal(isValidPop800Ukey('id with space'), false)
  assert.equal(hasPreviewQuery('?visitor-preview=1'), true)
  assert.equal(hasPreviewQuery('?tawk-preview=1'), false)
  assert.equal(hasPreviewQuery('?foo=1'), false)
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

test('adapter decision: owner, loopback, pop800, preview, none', () => {
  assert.deepEqual(
    decideVisitorAdapter({
      ownerExcluded: true,
      hostname: 'weijianjun.me',
      search: '',
      jobNo: POP800.jobNo,
      ukey: POP800.ukey,
    }),
    { adapter: 'none', reason: 'owner' },
  )
  assert.deepEqual(
    decideVisitorAdapter({
      ownerExcluded: false,
      hostname: 'localhost',
      search: '',
      jobNo: POP800.jobNo,
      ukey: POP800.ukey,
    }),
    { adapter: 'none', reason: 'loopback' },
  )
  assert.equal(
    decideVisitorAdapter({
      ownerExcluded: false,
      hostname: 'localhost',
      search: '?visitor-preview=1',
      jobNo: POP800.jobNo,
      ukey: POP800.ukey,
    }).adapter,
    'pop800',
  )
  assert.equal(
    decideVisitorAdapter({
      ownerExcluded: false,
      hostname: 'localhost',
      search: '?visitor-preview=1',
      jobNo: '',
      ukey: '',
    }).adapter,
    'preview',
  )
  assert.deepEqual(
    decideVisitorAdapter({
      ownerExcluded: false,
      hostname: 'weijianjun.me',
      search: '',
      jobNo: 'bad/id',
      ukey: 'def',
    }),
    { adapter: 'none', reason: 'none' },
  )
  assert.equal(
    decideVisitorAdapter({
      ownerExcluded: false,
      hostname: 'weijianjun.me',
      search: '',
      jobNo: POP800.jobNo,
      ukey: POP800.ukey,
    }).adapter,
    'pop800',
  )
})

test('owner hash writes flags, strips url and never mounts a channel', () => {
  resetVisitorWidgetForTests()
  const host = createHost({ location: { hostname: 'weijianjun.me', hash: '#owner-exclude', protocol: 'https:' } })
  const { result } = mountWidget(host, POP800)
  assert.equal(result.mounted, false)
  assert.equal(result.adapter, 'none')
  assert.equal(result.reason, 'owner')
  assert.equal(host.location.hash, '')
  assert.equal(host.registry.scripts.length, 0)
  assert.equal(host.localStorage.getItem(OWNER_STORAGE_KEY), '1')
  assert.match(host.document.cookie, new RegExp(`${OWNER_COOKIE}=1`))
  assert.ok(host.document.getElementById('wjj-owner-status'))
})

test('unmarked production visitor with POP800 mounts adapter without remote script src', () => {
  resetVisitorWidgetForTests()
  const host = createHost()
  const { result } = mountWidget(host, POP800)
  assert.equal(result.mounted, true)
  assert.equal(result.adapter, 'pop800')
  assert.ok(host.document.getElementById(POP800_SLOT_ID))
  assert.equal(httpScriptSrcs(host).length, 0)
})

test('loopback default skips channel; preview query enables local preview', () => {
  resetVisitorWidgetForTests()
  const blocked = createHost({
    location: { hostname: '127.0.0.1', protocol: 'http:', port: '5173', hash: '', search: '' },
  })
  assert.equal(mountWidget(blocked, POP800).result.mounted, false)
  assert.equal(blocked.registry.scripts.length, 0)
  assert.equal(blocked.document.getElementById(POP800_SLOT_ID), null)

  resetVisitorWidgetForTests()
  const preview = createHost({
    location: {
      hostname: '127.0.0.1',
      protocol: 'http:',
      port: '5173',
      search: '?visitor-preview=1',
    },
  })
  const mounted = mountWidget(preview)
  assert.equal(mounted.result.adapter, 'preview')
  assert.equal(mounted.result.mounted, true)
  assert.equal(httpScriptSrcs(preview).length, 0)
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

test('single-visit welcome: first allowed, refresh/route/cross-site blocked, owner never, no empty bubble', () => {
  resetVisitorWidgetForTests()
  const storage = memoryStorage()
  const sessionStorage = memoryStorage()
  const host = createHost({ localStorage: storage, sessionStorage })
  const { timers } = mountWidget(host, POP800)
  timers.flush(4000)
  assert.ok(host.document.getElementById('wjj-welcome-bubble'))
  assert.match(host.document.cookie, new RegExp(`${WELCOME_COOKIE}=1`))

  resetVisitorWidgetForTests()
  const refreshed = createHost({
    cookie: host.document.cookie,
    localStorage: storage,
    sessionStorage,
  })
  const again = mountWidget(refreshed, POP800)
  again.timers.flush(4000)
  assert.equal(refreshed.document.getElementById('wjj-welcome-bubble'), null)

  resetVisitorWidgetForTests()
  const workHost = createHost({
    cookie: host.document.cookie,
    localStorage: memoryStorage(),
    sessionStorage,
    location: { hostname: 'work.weijianjun.me', protocol: 'https:', pathname: '/projects/courier' },
  })
  const workMount = mountWidget(workHost, { site: 'work', ...POP800 })
  workMount.timers.flush(4000)
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
  const ownerMount = mountWidget(ownerHost, POP800)
  assert.equal(ownerMount.result.mounted, false)
  ownerMount.timers.flush(4000)
  assert.equal(ownerHost.document.getElementById('wjj-welcome-bubble'), null)

  resetVisitorWidgetForTests()
  const empty = createHost()
  const emptyMount = mountWidget(empty)
  assert.equal(emptyMount.result.adapter, 'none')
  emptyMount.timers.flush(4000)
  assert.equal(empty.document.getElementById('wjj-welcome-bubble'), null)
})

test('visible page shows welcome once; hidden page does not; returning visible reschedules', () => {
  resetVisitorWidgetForTests()
  const visible = createHost({ visibilityState: 'visible' })
  const visibleMount = mountWidget(visible, POP800)
  visibleMount.timers.flush(4000)
  assert.ok(visible.document.getElementById('wjj-welcome-bubble'))

  resetVisitorWidgetForTests()
  const hidden = createHost({ visibilityState: 'hidden' })
  const hiddenMount = mountWidget(hidden, POP800)
  hiddenMount.timers.flush(4000)
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
  assert.equal(sanitizeVisitorEvent({ site: 'main', path: '/#courier', projectId: 'spy' }).project, undefined)
  assert.equal(resolveMainProjectId('#analytics'), 'analytics')
  assert.equal(resolveMainProjectId('#owner-exclude'), undefined)
  assert.equal(resolveWorkProjectId('/projects/lowcode/'), 'lowcode')
})

test('route notify de-dupes the same path and keeps zero-PII whitelist', () => {
  resetVisitorWidgetForTests()
  const host = createHost()
  mountWidget(host, { site: 'work', ...POP800 })
  notifyVisitorRouteChange({ site: 'work', path: '/projects/courier', title: 'x', projectId: 'courier' })
  notifyVisitorRouteChange({ site: 'work', path: '/projects/courier', title: 'y', projectId: 'courier' })
  assert.deepEqual(getVisitorWidgetDebugState().lastEvent, {
    site: 'work',
    path: '/projects/courier',
    project: 'courier',
  })
  notifyVisitorRouteChange({ site: 'work', path: '/projects/analytics', projectId: 'analytics', email: 'ada@x.com' })
  assert.deepEqual(getVisitorWidgetDebugState().lastEvent, {
    site: 'work',
    path: '/projects/analytics',
    project: 'analytics',
  })
  assert.ok(!JSON.stringify(getVisitorWidgetDebugState().lastEvent).includes('@'))
})

test('openChat carries anonymous project context into the local receipt', () => {
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
  timers.flush(4000)
  findAction(host, 'chat').click()
  assert.ok(host.document.getElementById(RECEIPT_ID))
  assert.equal(fieldText(host, 'site'), 'work')
  assert.equal(fieldText(host, 'path'), '/projects/lowcode')
  assert.equal(fieldText(host, 'project'), 'lowcode')
  assert.equal(fieldText(host, 'status'), '回聊通道待接入')
})

test('source, env, workflow and built html have zero tawk residue and no static remote scripts', async () => {
  const root = fileURLToPath(new URL('..', import.meta.url))
  const files = [
    ...(await collectFiles(join(root, 'src'))),
    join(root, '.env.example'),
    join(root, '.github', 'workflows', 'deploy-pages.yml'),
    join(root, 'dist', 'index.html'),
    join(root, 'dist-work', 'index.html'),
  ]
  const joined = []
  for (const file of files) {
    const text = await readFile(file, 'utf8')
    joined.push(text)
  }
  const blob = joined.join('\n')
  assert.doesNotMatch(blob, /tawk\.to/i)
  assert.doesNotMatch(blob, /embed\.tawk\.to/)
  assert.doesNotMatch(blob, /VITE_TAWK_/)
  assert.doesNotMatch(blob, /Tawk_API/)

  for (const rel of ['../index.html', '../work/index.html', '../dist/index.html', '../dist-work/index.html']) {
    const html = await readFile(new URL(rel, import.meta.url), 'utf8')
    assert.doesNotMatch(html, /src="https?:\/\//)
    assert.doesNotMatch(html, /embed\.tawk\.to/)
    assert.doesNotMatch(html, /tawk\.to/i)
  }
})

test('replaceState without writing location.hash still clears owner hash', () => {
  resetVisitorWidgetForTests()
  const host = createHost({ location: { hostname: 'weijianjun.me', hash: '#owner-exclude', protocol: 'https:' } })
  mountWidget(host)
  assert.equal(host.location.hash, '')
  assert.doesNotMatch(host.location.href, /#$/)
})

test('enabling exclude after mount cancels timer, hides bubble, stops adapter, and asks to refresh', () => {
  resetVisitorWidgetForTests()
  const host = createHost()
  const { result, timers } = mountWidget(host, POP800)
  assert.equal(result.mounted, true)
  notifyVisitorRouteChange({ site: 'main', path: '/#courier', projectId: 'courier' })
  assert.equal(getVisitorWidgetDebugState().hasFallbackTimer, true)
  timers.flush(4000)
  assert.ok(host.document.getElementById('wjj-welcome-bubble'))
  assert.ok(host.document.getElementById(POP800_SLOT_ID))

  host.location.hash = '#owner-exclude'
  host.emit('window', 'hashchange', { type: 'hashchange' })

  assert.equal(getVisitorWidgetDebugState().hasFallbackTimer, false)
  assert.equal(getVisitorWidgetDebugState().lastEvent, null)
  assert.equal(host.document.getElementById('wjj-welcome-bubble'), null)
  assert.equal(host.document.getElementById(POP800_SLOT_ID), null)
  assert.match(statusBarText(host), /请刷新一次页面以彻底断开连接/)
  assert.equal(host.location.hash, '')
})

test('toggle exclude after mount also stops live surface; unmounted exclude does not ask to refresh', () => {
  resetVisitorWidgetForTests()
  const injectedHost = createHost()
  const injectedMount = mountWidget(injectedHost, POP800)
  assert.equal(injectedMount.result.mounted, true)
  assert.equal(getVisitorWidgetDebugState().hasFallbackTimer, true)

  injectedHost.location.hash = '#owner-status'
  injectedHost.emit('window', 'hashchange', { type: 'hashchange' })
  findAction(injectedHost, 'toggle').click()
  assert.equal(getVisitorWidgetDebugState().hasFallbackTimer, false)
  assert.equal(getVisitorWidgetDebugState().lastEvent, null)
  assert.equal(injectedHost.document.getElementById(POP800_SLOT_ID), null)
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
