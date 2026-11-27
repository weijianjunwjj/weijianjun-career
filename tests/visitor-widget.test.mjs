import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  OWNER_COOKIE,
  OWNER_STORAGE_KEY,
  WELCOME_COOKIE,
  WELCOME_STORAGE_KEY,
  buildFlagCookie,
  decideTawkLoad,
  hasPreviewQuery,
  isLoopbackHost,
  isOwnerExcluded,
  isValidTawkId,
  isWelcomeShown,
  markWelcomeShown,
  parseOwnerHash,
  resolveMainProjectId,
  resolveWorkProjectId,
  sanitizeVisitorEvent,
  sanitizeVisitorPath,
  setOwnerExcluded,
} from '../src/shared/ownerExclude.ts'
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
        location.hash = parsed.hash
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
        if (sel.includes('data-wjj-tawk')) {
          return registry.scripts.find((el) => el.getAttribute('data-wjj-tawk') === '1') || null
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
    Tawk_API: init.Tawk_API,
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

const VALID_IDS = { propertyId: 'abcDEF123', widgetId: 'widget_01' }

function mountWidget(host, extra = {}) {
  const timers = extra.timers || createTimers()
  const result = setupVisitorWidget({
    site: extra.site || 'main',
    host,
    propertyId: extra.propertyId ?? VALID_IDS.propertyId,
    widgetId: extra.widgetId ?? VALID_IDS.widgetId,
    fallbackDelayMs: extra.fallbackDelayMs ?? 4000,
    setTimeoutFn: timers.setTimeout,
    clearTimeoutFn: timers.clearTimeout,
  })
  return { result, timers }
}

test('loopback hosts and tawk id validation', () => {
  assert.equal(isLoopbackHost('localhost'), true)
  assert.equal(isLoopbackHost('127.0.0.1'), true)
  assert.equal(isLoopbackHost('::1'), true)
  assert.equal(isLoopbackHost('weijianjun.me'), false)
  assert.equal(isValidTawkId('abcDEF123'), true)
  assert.equal(isValidTawkId('widget_01'), true)
  assert.equal(isValidTawkId(''), false)
  assert.equal(isValidTawkId('foo/bar'), false)
  assert.equal(isValidTawkId('id with space'), false)
  assert.equal(hasPreviewQuery('?tawk-preview=1'), true)
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

test('tawk load is blocked for owner, loopback and invalid ids', () => {
  assert.deepEqual(
    decideTawkLoad({
      ownerExcluded: true,
      hostname: 'weijianjun.me',
      search: '',
      propertyId: 'abc',
      widgetId: 'def',
    }),
    { load: false, reason: 'owner' },
  )
  assert.deepEqual(
    decideTawkLoad({
      ownerExcluded: false,
      hostname: 'localhost',
      search: '',
      propertyId: 'abc',
      widgetId: 'def',
    }),
    { load: false, reason: 'loopback' },
  )
  assert.equal(
    decideTawkLoad({
      ownerExcluded: false,
      hostname: 'localhost',
      search: '?tawk-preview=1',
      propertyId: 'abc',
      widgetId: 'def',
    }).load,
    true,
  )
  assert.deepEqual(
    decideTawkLoad({
      ownerExcluded: false,
      hostname: 'weijianjun.me',
      search: '',
      propertyId: 'bad/id',
      widgetId: 'def',
    }),
    { load: false, reason: 'invalid-id' },
  )
})

test('owner hash writes flags, strips url and never injects script', () => {
  resetVisitorWidgetForTests()
  const host = createHost({ location: { hostname: 'weijianjun.me', hash: '#owner-exclude', protocol: 'https:' } })
  const { result } = mountWidget(host)
  assert.equal(result.injected, false)
  assert.equal(result.reason, 'owner')
  assert.equal(host.location.hash, '')
  assert.equal(host.registry.scripts.length, 0)
  assert.equal(host.localStorage.getItem(OWNER_STORAGE_KEY), '1')
  assert.match(host.document.cookie, new RegExp(`${OWNER_COOKIE}=1`))
  assert.ok(host.document.getElementById('wjj-owner-status'))
})

test('unmarked production visitor injects tawk script once', () => {
  resetVisitorWidgetForTests()
  const host = createHost()
  const { result } = mountWidget(host)
  assert.equal(result.injected, true)
  assert.equal(host.registry.scripts.length, 1)
  assert.equal(host.registry.scripts[0].src, 'https://embed.tawk.to/abcDEF123/widget_01')
})

test('loopback default skips script; preview query allows it', () => {
  resetVisitorWidgetForTests()
  const blocked = createHost({
    location: { hostname: '127.0.0.1', protocol: 'http:', port: '5173', hash: '', search: '' },
  })
  assert.equal(mountWidget(blocked).result.injected, false)
  assert.equal(blocked.registry.scripts.length, 0)

  resetVisitorWidgetForTests()
  const preview = createHost({
    location: {
      hostname: '127.0.0.1',
      protocol: 'http:',
      port: '5173',
      search: '?tawk-preview=1',
    },
  })
  assert.equal(mountWidget(preview).result.injected, true)
  assert.equal(preview.registry.scripts.length, 1)
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

test('single-visit welcome: first allowed, refresh/route/cross-site blocked, owner never', () => {
  resetVisitorWidgetForTests()
  const storage = memoryStorage()
  const sessionStorage = memoryStorage()
  const host = createHost({ localStorage: storage, sessionStorage })
  const { timers } = mountWidget(host)
  host.Tawk_API.onStatusChange('offline')
  timers.flush(4000)
  assert.ok(host.document.getElementById('wjj-welcome-bubble'))
  assert.match(host.document.cookie, new RegExp(`${WELCOME_COOKIE}=1`))

  resetVisitorWidgetForTests()
  const refreshed = createHost({
    cookie: host.document.cookie,
    localStorage: storage,
    sessionStorage,
  })
  const again = mountWidget(refreshed)
  refreshed.Tawk_API.onStatusChange('offline')
  again.timers.flush(4000)
  assert.equal(refreshed.document.getElementById('wjj-welcome-bubble'), null)

  resetVisitorWidgetForTests()
  const workHost = createHost({
    cookie: host.document.cookie,
    localStorage: memoryStorage(),
    sessionStorage,
    location: { hostname: 'work.weijianjun.me', protocol: 'https:', pathname: '/projects/courier' },
  })
  const workMount = mountWidget(workHost, { site: 'work' })
  workHost.Tawk_API.onStatusChange('offline')
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
  const ownerMount = mountWidget(ownerHost)
  assert.equal(ownerMount.result.injected, false)
  assert.equal(ownerHost.Tawk_API, undefined)
})

test('native tawk message wins over fallback bubble', () => {
  resetVisitorWidgetForTests()
  const host = createHost()
  const { timers } = mountWidget(host)
  host.Tawk_API.onStatusChange('offline')
  host.Tawk_API.onChatMessageAgent()
  timers.flush(4000)
  assert.equal(host.document.getElementById('wjj-welcome-bubble'), null)
  assert.match(host.document.cookie, new RegExp(`${WELCOME_COOKIE}=1`))
})

test('offline visible page shows fallback once; hidden page does not', () => {
  resetVisitorWidgetForTests()
  const visible = createHost({ visibilityState: 'visible' })
  const visibleMount = mountWidget(visible)
  visible.Tawk_API.onStatusChange('offline')
  visibleMount.timers.flush(4000)
  assert.ok(visible.document.getElementById('wjj-welcome-bubble'))

  resetVisitorWidgetForTests()
  const hidden = createHost({ visibilityState: 'hidden' })
  const hiddenMount = mountWidget(hidden)
  hidden.Tawk_API.onStatusChange('offline')
  hiddenMount.timers.flush(4000)
  assert.equal(hidden.document.getElementById('wjj-welcome-bubble'), null)
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

test('route notify de-dupes the same path and flushes after tawk onLoad', () => {
  resetVisitorWidgetForTests()
  const events = []
  const host = createHost()
  mountWidget(host, { site: 'work' })
  notifyVisitorRouteChange({ site: 'work', path: '/projects/courier', title: 'x', projectId: 'courier' })
  notifyVisitorRouteChange({ site: 'work', path: '/projects/courier', title: 'y', projectId: 'courier' })
  assert.equal(getVisitorWidgetDebugState().pendingEvent.path, '/projects/courier')
  host.Tawk_API.addEvent = (name, meta) => {
    events.push({ name, meta })
  }
  host.Tawk_API.onLoad()
  notifyVisitorRouteChange({ site: 'work', path: '/projects/courier', projectId: 'courier' })
  notifyVisitorRouteChange({ site: 'work', path: '/projects/analytics', projectId: 'analytics' })
  assert.deepEqual(events, [
    { name: 'project_view', meta: { site: 'work', path: '/projects/courier', project: 'courier' } },
    { name: 'project_view', meta: { site: 'work', path: '/projects/analytics', project: 'analytics' } },
  ])
  assert.ok(events.every((item) => !JSON.stringify(item).includes('@')))
})

test('static html never hardcodes remote tawk scripts', async () => {
  const files = ['../index.html', '../work/index.html']
  for (const rel of files) {
    const html = await readFile(new URL(rel, import.meta.url), 'utf8')
    assert.doesNotMatch(html, /src="https?:\/\//)
    assert.doesNotMatch(html, /embed\.tawk\.to/)
  }
})
