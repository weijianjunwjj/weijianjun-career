/** 可插拔访客 Adapter：百度统计 + 自研联系卡。零海外聊天脚本。 */

import type { ProjectId, VisitorAdapterId } from './ownerExclude.ts'

export type ProjectCtx = {
  site: 'main' | 'work'
  path: string
  project?: ProjectId
}

export type VisitorHostLike = {
  _hmt?: unknown[]
  document: {
    body?: { appendChild: (node: unknown) => unknown; removeChild: (node: unknown) => unknown }
    documentElement?: { appendChild: (node: unknown) => unknown }
    createElement: (tag: string) => AdapterEl
    getElementById: (id: string) => AdapterEl | null
    querySelector: (sel: string) => AdapterEl | null
  }
}

export type AdapterEl = {
  id?: string
  src?: string
  async?: boolean
  hidden?: boolean
  type?: string
  href?: string
  rel?: string
  alt?: string
  target?: string
  textContent?: string
  innerHTML?: string
  onerror?: ((event?: unknown) => void) | null
  style?: Record<string, string>
  setAttribute: (name: string, value: string) => void
  getAttribute?: (name: string) => string | null
  removeAttribute?: (name: string) => void
  appendChild: (node: unknown) => unknown
  addEventListener: (type: string, listener: EventListener) => void
}

export type VisitorChatAdapter = {
  id: VisitorAdapterId
  mount(ctx: ProjectCtx): void
  openChat(projectCtx: ProjectCtx): void
  notifyRouteChange(projectCtx: ProjectCtx): void
  stop(): void
}

export const RECEIPT_ID = 'wjj-visitor-receipt'
export const CONTACT_CARD_ID = 'wjj-contact-card'
export const CONTACT_LAUNCHER_ID = 'wjj-contact-launcher'
export const BAIDU_SCRIPT_ATTR = 'data-wjj-baidu'
export const BAIDU_HM_SRC_PREFIX = 'https://hm.baidu.com/hm.js?'

export type ReceiptHelpers = {
  ensureStyle: () => void
  removeEl: (id: string) => void
  showReceipt?: (ctx: ProjectCtx, status: string) => void
  showContactCard?: (ctx: ProjectCtx) => void
}

function removeNode(host: VisitorHostLike, node: AdapterEl | null) {
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

export function createNoneAdapter(): VisitorChatAdapter {
  return {
    id: 'none',
    mount() {},
    openChat() {},
    notifyRouteChange() {},
    stop() {},
  }
}

export function createPreviewAdapter(helpers: ReceiptHelpers): VisitorChatAdapter {
  let mounted = false

  return {
    id: 'preview',
    mount() {
      mounted = true
      helpers.ensureStyle()
    },
    openChat(projectCtx) {
      if (!mounted) return
      helpers.showContactCard?.(projectCtx)
    },
    notifyRouteChange() {},
    stop() {
      mounted = false
      helpers.removeEl(RECEIPT_ID)
      helpers.removeEl(CONTACT_CARD_ID)
      helpers.removeEl(CONTACT_LAUNCHER_ID)
    },
  }
}

export function createBaiduAdapter(
  host: VisitorHostLike,
  options: {
    hmId: string
    injectScript: boolean
    helpers: ReceiptHelpers
  },
): VisitorChatAdapter {
  let mounted = false
  let trackingEnabled = false
  let landingKey = ''
  let lastTrackedKey = ''
  let skippedLanding = false

  function ensureHmtQueue() {
    if (!Array.isArray(host._hmt)) host._hmt = []
  }

  function ensureScript() {
    if (!options.injectScript || !options.hmId) return
    const existing = host.document.querySelector(`script[${BAIDU_SCRIPT_ATTR}="1"]`)
    if (existing) return
    ensureHmtQueue()
    const el = host.document.createElement('script')
    el.async = true
    el.src = `${BAIDU_HM_SRC_PREFIX}${options.hmId}`
    el.setAttribute(BAIDU_SCRIPT_ATTR, '1')
    const parent = host.document.body || host.document.documentElement
    parent?.appendChild(el)
  }

  return {
    id: 'baidu',
    mount(ctx) {
      mounted = true
      landingKey = `${ctx.site}:${ctx.path}`
      lastTrackedKey = landingKey
      skippedLanding = false
      options.helpers.ensureStyle()
      if (options.injectScript) {
        trackingEnabled = true
        ensureScript()
      }
    },
    openChat(projectCtx) {
      if (!mounted) return
      options.helpers.showContactCard?.(projectCtx)
    },
    notifyRouteChange(projectCtx) {
      if (!mounted || !trackingEnabled || !options.injectScript) return
      const key = `${projectCtx.site}:${projectCtx.path}`
      if (!skippedLanding && key === landingKey) {
        skippedLanding = true
        return
      }
      skippedLanding = true
      if (key === lastTrackedKey) return
      lastTrackedKey = key
      ensureHmtQueue()
      host._hmt?.push(['_trackPageview', projectCtx.path])
    },
    stop() {
      mounted = false
      trackingEnabled = false
      options.helpers.removeEl(RECEIPT_ID)
      options.helpers.removeEl(CONTACT_CARD_ID)
      options.helpers.removeEl(CONTACT_LAUNCHER_ID)
      const script = host.document.querySelector(`script[${BAIDU_SCRIPT_ATTR}="1"]`)
      removeNode(host, script)
    },
  }
}
