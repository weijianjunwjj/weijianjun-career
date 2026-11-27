import {
  WELCOME_FALLBACK_MS,
  decideTawkLoad,
  isOwnerExcluded,
  isWelcomeShown,
  markWelcomeShown,
  otherSiteOwnerUrl,
  parseOwnerHash,
  resolveMainProjectId,
  sanitizeVisitorEvent,
  setOwnerExcluded,
  stripHashFromUrl,
  type PersistIo,
  type ProjectId,
  type StorageLike,
} from './ownerExclude.ts'

export {
  decideTawkLoad,
  isLoopbackHost,
  isOwnerExcluded,
  isValidTawkId,
  isWelcomeShown,
  markWelcomeShown,
  parseOwnerHash,
  resolveMainProjectId,
  resolveWorkProjectId,
  sanitizeVisitorEvent,
  setOwnerExcluded,
} from './ownerExclude.ts'

const OWNER_BAR_ID = 'wjj-owner-status'
const BUBBLE_ID = 'wjj-welcome-bubble'
const STYLE_ID = 'wjj-visitor-widget-style'
const SCRIPT_ATTR = 'data-wjj-tawk'

const WIDGET_CSS = `
#wjj-owner-status,
#wjj-welcome-bubble {
  font-family: var(--font-sans, 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif);
  color: var(--ink-primary, #f0f5ff);
  -webkit-font-smoothing: antialiased;
}
#wjj-owner-status {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100000;
  width: min(560px, calc(100vw - 24px));
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid rgba(148, 179, 255, 0.24);
  background: rgba(8, 14, 29, 0.92);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 24px 56px -28px rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(16px);
}
#wjj-owner-status p { margin: 0 0 8px; font-size: 13px; line-height: 1.5; color: #a3b5d4; }
#wjj-owner-status strong { color: #f0f5ff; }
#wjj-owner-status .wjj-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
#wjj-owner-status button,
#wjj-welcome-bubble button {
  cursor: pointer;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
}
#wjj-owner-status button {
  padding: 6px 12px;
  border: 1px solid rgba(56, 232, 255, 0.4);
  background: rgba(56, 232, 255, 0.14);
  color: #e6fbff;
}
#wjj-owner-status a {
  color: #38e8ff;
  font-size: 13px;
  font-weight: 600;
}
#wjj-welcome-bubble {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 40;
  width: min(320px, calc(100vw - 32px));
  padding: 14px 14px 12px;
  border-radius: 16px;
  border: 1px solid rgba(148, 179, 255, 0.18);
  background: rgba(11, 19, 38, 0.88);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 18px 40px -24px rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(16px);
}
#wjj-welcome-bubble p { margin: 0 20px 12px 0; font-size: 14px; line-height: 1.55; color: #d5e2f5; }
#wjj-welcome-bubble .wjj-row { display: flex; gap: 8px; }
#wjj-welcome-bubble [data-action="chat"] {
  padding: 8px 14px;
  border: 1px solid rgba(165, 243, 252, 0.45);
  background: linear-gradient(135deg, #52eeff 0%, #38bdf8 48%, #5b82ff 100%);
  color: #030712;
}
#wjj-welcome-bubble [data-action="close"] {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: #6f84a8;
}
@media (prefers-reduced-motion: reduce) {
  #wjj-owner-status, #wjj-welcome-bubble { backdrop-filter: none; }
}
`

export type TawkApi = {
  onLoad?: () => void
  onStatusChange?: (status: string) => void
  onChatMaximized?: () => void
  onChatStarted?: () => void
  onChatMessageSystem?: (...args: unknown[]) => void
  onChatMessageAgent?: (...args: unknown[]) => void
  addEvent?: (name: string, meta?: Record<string, string>, cb?: () => void) => void
  maximize?: () => void
  getStatus?: () => string
}

export type VisitorHost = {
  location: {
    hostname: string
    hash: string
    search: string
    pathname: string
    href: string
    protocol: string
    port: string
  }
  history: {
    state?: unknown
    replaceState: (data: unknown, unused: string, url?: string) => void
  }
  document: {
    cookie: string
    visibilityState: string
    body?: { appendChild: (node: unknown) => unknown; removeChild: (node: unknown) => unknown }
    documentElement?: { appendChild: (node: unknown) => unknown }
    createElement: (tag: string) => WidgetEl
    getElementById: (id: string) => WidgetEl | null
    querySelector: (sel: string) => WidgetEl | null
    addEventListener: (type: string, listener: EventListener) => void
    removeEventListener: (type: string, listener: EventListener) => void
  }
  localStorage?: StorageLike | null
  sessionStorage?: StorageLike | null
  addEventListener: (type: string, listener: EventListener) => void
  removeEventListener: (type: string, listener: EventListener) => void
  Tawk_API?: TawkApi
  Tawk_LoadStart?: Date
}

type WidgetEl = {
  id?: string
  src?: string
  async?: boolean
  charset?: string
  textContent?: string
  innerHTML?: string
  style?: Record<string, string>
  href?: string
  rel?: string
  target?: string
  type?: string
  setAttribute: (name: string, value: string) => void
  getAttribute?: (name: string) => string | null
  appendChild: (node: unknown) => unknown
  addEventListener: (type: string, listener: EventListener) => void
  querySelector?: (sel: string) => WidgetEl | null
}

export type VisitorWidgetOptions = {
  site: 'main' | 'work'
  host?: VisitorHost
  propertyId?: string
  widgetId?: string
  fallbackDelayMs?: number
  setTimeoutFn?: typeof setTimeout
  clearTimeoutFn?: typeof clearTimeout
  mainSiteUrl?: string
  workSiteUrl?: string
}

type SanitizedEvent = { site: 'main' | 'work'; path: string; project?: ProjectId }

type TimerHandle = ReturnType<typeof setTimeout>

let started = false
let injected = false
let siteKind: 'main' | 'work' = 'main'
let hostRef: VisitorHost | null = null
let lastPathKey = ''
let pendingEvent: SanitizedEvent | null = null
let fallbackTimer: TimerHandle | null = null
let lastStatus = ''
let fallbackDelay = WELCOME_FALLBACK_MS
let setTimeoutFn: typeof setTimeout = setTimeout
let clearTimeoutFn: typeof clearTimeout = clearTimeout
let mainSiteUrl = 'https://weijianjun.me/'
let workSiteUrl = 'https://work.weijianjun.me/'
const attached: Array<{
  target: { addEventListener: Function; removeEventListener: Function }
  type: string
  fn: EventListener
}> = []

function envId(name: 'VITE_TAWK_PROPERTY_ID' | 'VITE_TAWK_WIDGET_ID'): string {
  try {
    const value = import.meta.env?.[name]
    return typeof value === 'string' ? value : ''
  } catch {
    return ''
  }
}

function ioFromHost(host: VisitorHost): PersistIo {
  return {
    hostname: host.location.hostname,
    protocol: host.location.protocol,
    getCookie: () => host.document.cookie || '',
    setCookie: (value) => {
      host.document.cookie = value
    },
    localStorage: host.localStorage,
    sessionStorage: host.sessionStorage,
  }
}

function defaultHost(): VisitorHost {
  return globalThis as unknown as VisitorHost
}

function listen(
  target: { addEventListener: Function; removeEventListener: Function },
  type: string,
  fn: EventListener,
) {
  target.addEventListener(type, fn)
  attached.push({ target, type, fn })
}

function ensureStyle(host: VisitorHost) {
  const doc = host.document
  if (doc.getElementById(STYLE_ID)) return
  const style = doc.createElement('style')
  style.id = STYLE_ID
  style.textContent = WIDGET_CSS
  const parent = doc.body || doc.documentElement
  parent?.appendChild(style)
}

function removeEl(host: VisitorHost, id: string) {
  const node = host.document.getElementById(id)
  if (!node) return
  try {
    host.document.body?.removeChild(node)
  } catch {
    try {
      ;(node as unknown as { remove?: () => void }).remove?.()
    } catch {
      // 测试 mock 可能没有父节点
    }
  }
}

function handleOwnerHash(host: VisitorHost): boolean {
  const action = parseOwnerHash(host.location.hash)
  if (!action) return false
  const io = ioFromHost(host)
  if (action === 'exclude') setOwnerExcluded(io, true)
  if (action === 'include') setOwnerExcluded(io, false)
  const next = stripHashFromUrl(host.location.pathname, host.location.search)
  host.history.replaceState(host.history.state ?? null, '', next)
  host.location.hash = ''
  showOwnerStatusBar(host)
  return true
}

function showOwnerStatusBar(host: VisitorHost) {
  ensureStyle(host)
  removeEl(host, OWNER_BAR_ID)
  const io = ioFromHost(host)
  const excluded = isOwnerExcluded(io)
  const bar = host.document.createElement('div')
  bar.id = OWNER_BAR_ID
  bar.setAttribute('role', 'status')

  const status = host.document.createElement('p')
  status.innerHTML = excluded
    ? '<strong>站长排除已开启</strong> · tawk.to 不会加载，也不会产生访问记录。'
    : '<strong>站长排除未开启</strong> · 当前浏览器会按访客计入 tawk.to。'
  bar.appendChild(status)

  const hint = host.document.createElement('p')
  hint.textContent =
    '新设备、无痕窗口或清站数据后需再次打开任意页的 #owner-exclude。根域 Cookie 覆盖主/子站；localStorage 按源隔离，可用「同步标记另一站」补写。'
  bar.appendChild(hint)

  const row = host.document.createElement('div')
  row.setAttribute('class', 'wjj-row')

  const toggle = host.document.createElement('button')
  toggle.type = 'button'
  toggle.setAttribute('data-action', 'toggle')
  toggle.textContent = excluded ? '解除排除' : '开启排除'
  toggle.addEventListener('click', () => {
    setOwnerExcluded(ioFromHost(host), !isOwnerExcluded(ioFromHost(host)))
    showOwnerStatusBar(host)
  })
  row.appendChild(toggle)

  const sync = host.document.createElement('a')
  sync.href = otherSiteOwnerUrl({
    hostname: host.location.hostname,
    port: host.location.port,
    protocol: host.location.protocol,
    excluded: isOwnerExcluded(ioFromHost(host)),
    mainSiteUrl,
    workSiteUrl,
  })
  sync.rel = 'noreferrer'
  sync.textContent = '同步标记另一站'
  row.appendChild(sync)

  const close = host.document.createElement('button')
  close.type = 'button'
  close.setAttribute('data-action', 'dismiss')
  close.textContent = '关闭'
  close.addEventListener('click', () => removeEl(host, OWNER_BAR_ID))
  row.appendChild(close)

  bar.appendChild(row)
  host.document.body?.appendChild(bar)
}

function cancelFallbackTimer() {
  if (fallbackTimer != null) {
    clearTimeoutFn(fallbackTimer)
    fallbackTimer = null
  }
}

function shouldOfferFallback(host: VisitorHost): boolean {
  const io = ioFromHost(host)
  if (isOwnerExcluded(io) || isWelcomeShown(io)) return false
  if (host.document.visibilityState !== 'visible') return false
  const status = lastStatus.toLowerCase()
  return status === 'offline' || status === 'away'
}

function scheduleFallback(host: VisitorHost) {
  cancelFallbackTimer()
  if (!shouldOfferFallback(host)) return
  fallbackTimer = setTimeoutFn(() => {
    fallbackTimer = null
    if (!shouldOfferFallback(host)) return
    showWelcomeBubble(host)
  }, fallbackDelay) as TimerHandle
}

function showWelcomeBubble(host: VisitorHost) {
  const io = ioFromHost(host)
  if (isOwnerExcluded(io) || isWelcomeShown(io)) return
  if (host.document.getElementById(BUBBLE_ID)) return
  ensureStyle(host)
  markWelcomeShown(io)

  const bubble = host.document.createElement('div')
  bubble.id = BUBBLE_ID
  bubble.setAttribute('role', 'dialog')
  bubble.setAttribute('aria-label', '访客留言')

  const close = host.document.createElement('button')
  close.type = 'button'
  close.setAttribute('data-action', 'close')
  close.setAttribute('aria-label', '关闭')
  close.textContent = '×'
  close.addEventListener('click', () => hideWelcomeBubble(host))
  bubble.appendChild(close)

  const copy = host.document.createElement('p')
  copy.textContent = '你好，正在看哪个项目？有想了解的细节可以直接聊或留言。'
  bubble.appendChild(copy)

  const row = host.document.createElement('div')
  row.setAttribute('class', 'wjj-row')
  const chat = host.document.createElement('button')
  chat.type = 'button'
  chat.setAttribute('data-action', 'chat')
  chat.textContent = '聊聊 / 留言'
  chat.addEventListener('click', () => {
    hideWelcomeBubble(host)
    try {
      host.Tawk_API?.maximize?.()
    } catch {
      // 离线留言框由 tawk 自身打开；失败时静默
    }
  })
  row.appendChild(chat)
  bubble.appendChild(row)
  host.document.body?.appendChild(bubble)
}

function hideWelcomeBubble(host: VisitorHost) {
  removeEl(host, BUBBLE_ID)
}

function acknowledgeNativeWelcome(host: VisitorHost) {
  markWelcomeShown(ioFromHost(host))
  cancelFallbackTimer()
  hideWelcomeBubble(host)
}

function bindTawk(host: VisitorHost) {
  const api: TawkApi = host.Tawk_API || {}
  host.Tawk_API = api
  host.Tawk_LoadStart = new Date()

  api.onLoad = () => {
    if (typeof api.getStatus === 'function') {
      lastStatus = api.getStatus() || lastStatus
      if (lastStatus.toLowerCase() === 'offline' || lastStatus.toLowerCase() === 'away') {
        scheduleFallback(host)
      }
    }
    flushPendingEvent()
  }
  api.onStatusChange = (status: string) => {
    lastStatus = status || ''
    const normalized = lastStatus.toLowerCase()
    if (normalized === 'offline' || normalized === 'away') scheduleFallback(host)
    else cancelFallbackTimer()
  }
  api.onChatMaximized = () => acknowledgeNativeWelcome(host)
  api.onChatStarted = () => acknowledgeNativeWelcome(host)
  api.onChatMessageSystem = () => acknowledgeNativeWelcome(host)
  api.onChatMessageAgent = () => acknowledgeNativeWelcome(host)
}

function injectTawkScript(host: VisitorHost, propertyId: string, widgetId: string): boolean {
  const doc = host.document
  if (doc.querySelector(`script[${SCRIPT_ATTR}="1"]`)) return false
  const el = doc.createElement('script')
  el.async = true
  el.charset = 'UTF-8'
  el.src = `https://embed.tawk.to/${propertyId}/${widgetId}`
  el.setAttribute('crossorigin', '*')
  el.setAttribute(SCRIPT_ATTR, '1')
  const parent = doc.body || doc.documentElement
  parent?.appendChild(el)
  return true
}

function emitMainRoute(host: VisitorHost) {
  const projectId = resolveMainProjectId(host.location.hash)
  notifyVisitorRouteChange({
    site: 'main',
    path: projectId ? `/#${projectId}` : host.location.pathname || '/',
    title: '',
    projectId,
  })
}

function flushPendingEvent() {
  if (!pendingEvent || !hostRef?.Tawk_API?.addEvent) return
  const payload = pendingEvent
  const meta: Record<string, string> = { site: payload.site, path: payload.path }
  if (payload.project) meta.project = payload.project
  try {
    hostRef.Tawk_API.addEvent('project_view', meta)
    pendingEvent = null
  } catch {
    // 保留 pending，待下次 onLoad 再发
  }
}

export function notifyVisitorRouteChange(input: {
  site: 'main' | 'work'
  path: string
  title?: string
  projectId?: string
}): void {
  if (hostRef && isOwnerExcluded(ioFromHost(hostRef))) return
  const event = sanitizeVisitorEvent(input)
  const key = `${event.site}:${event.path}`
  if (key === lastPathKey) return
  lastPathKey = key
  pendingEvent = event
  flushPendingEvent()
}

export function setupVisitorWidget(options: VisitorWidgetOptions): {
  injected: boolean
  reason?: string
} {
  if (started && !options.host) {
    return { injected, reason: injected ? undefined : 'already-initialized' }
  }
  if (started && options.host) resetVisitorWidgetForTests()

  started = true
  siteKind = options.site
  hostRef = options.host ?? defaultHost()
  fallbackDelay = options.fallbackDelayMs ?? WELCOME_FALLBACK_MS
  setTimeoutFn = options.setTimeoutFn ?? setTimeout
  clearTimeoutFn = options.clearTimeoutFn ?? clearTimeout
  if (options.mainSiteUrl) mainSiteUrl = options.mainSiteUrl
  if (options.workSiteUrl) workSiteUrl = options.workSiteUrl

  const host = hostRef
  handleOwnerHash(host)

  listen(host, 'hashchange', () => {
    if (handleOwnerHash(host)) return
    if (siteKind === 'main') emitMainRoute(host)
  })
  listen(host.document, 'keydown', (event) => {
    const key = (event as KeyboardEvent).key
    if (key !== 'Escape') return
    removeEl(host, OWNER_BAR_ID)
    if (host.document.getElementById(BUBBLE_ID)) {
      hideWelcomeBubble(host)
    }
  })

  const io = ioFromHost(host)
  const propertyId = options.propertyId ?? envId('VITE_TAWK_PROPERTY_ID')
  const widgetId = options.widgetId ?? envId('VITE_TAWK_WIDGET_ID')
  const decision = decideTawkLoad({
    ownerExcluded: isOwnerExcluded(io),
    hostname: host.location.hostname,
    search: host.location.search,
    propertyId,
    widgetId,
  })

  if (!decision.load) {
    injected = false
    if (siteKind === 'main') emitMainRoute(host)
    return { injected: false, reason: decision.reason }
  }

  listen(host.document, 'visibilitychange', () => {
    if (host.document.visibilityState !== 'visible') cancelFallbackTimer()
    else scheduleFallback(host)
  })

  bindTawk(host)
  injected = injectTawkScript(host, propertyId, widgetId)
  if (siteKind === 'main') emitMainRoute(host)
  return { injected: true }
}

export function resetVisitorWidgetForTests(): void {
  cancelFallbackTimer()
  for (const item of attached.splice(0)) {
    try {
      item.target.removeEventListener(item.type, item.fn)
    } catch {
      // mock 可能无 removeEventListener 实现
    }
  }
  started = false
  injected = false
  hostRef = null
  lastPathKey = ''
  pendingEvent = null
  lastStatus = ''
  fallbackDelay = WELCOME_FALLBACK_MS
  setTimeoutFn = setTimeout
  clearTimeoutFn = clearTimeout
}

export function getVisitorWidgetDebugState(): {
  injected: boolean
  lastPathKey: string
  pendingEvent: SanitizedEvent | null
  lastStatus: string
  hasFallbackTimer: boolean
} {
  return {
    injected,
    lastPathKey,
    pendingEvent,
    lastStatus,
    hasFallbackTimer: fallbackTimer != null,
  }
}
