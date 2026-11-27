/** 可插拔回聊 Adapter。零供应商锁死；本阶段不硬编码真实账号。 */

import type { ProjectId, VisitorAdapterId } from './ownerExclude.ts'

export type ProjectCtx = {
  site: 'main' | 'work'
  path: string
  project?: ProjectId
}

export type VisitorHostLike = {
  document: {
    body?: { appendChild: (node: unknown) => unknown; removeChild: (node: unknown) => unknown }
    documentElement?: { appendChild: (node: unknown) => unknown }
    createElement: (tag: string) => AdapterEl
    getElementById: (id: string) => AdapterEl | null
    querySelector: (sel: string) => AdapterEl | null
  }
  POP800?: { openChat?: (ctx?: ProjectCtx) => void }
}

export type AdapterEl = {
  id?: string
  src?: string
  async?: boolean
  hidden?: boolean
  type?: string
  href?: string
  rel?: string
  textContent?: string
  innerHTML?: string
  style?: Record<string, string>
  setAttribute: (name: string, value: string) => void
  getAttribute?: (name: string) => string | null
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
export const POP800_SLOT_ID = 'wjj-pop800-slot'
export const POP800_SCRIPT_ATTR = 'data-wjj-pop800'

export type ReceiptHelpers = {
  ensureStyle: () => void
  removeEl: (id: string) => void
  showReceipt: (ctx: ProjectCtx, status: string) => void
}

function removeNode(host: VisitorHostLike, id: string) {
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
      helpers.showReceipt(projectCtx, '回聊通道待接入')
    },
    notifyRouteChange() {},
    stop() {
      mounted = false
      helpers.removeEl(RECEIPT_ID)
    },
  }
}

export function createPop800Adapter(
  host: VisitorHostLike,
  creds: { jobNo: string; ukey: string },
  helpers: ReceiptHelpers,
  options: { allowThirdPartyScript: boolean },
): VisitorChatAdapter {
  let mounted = false
  const routeLog: ProjectCtx[] = []

  function ensureSlot() {
    if (host.document.getElementById(POP800_SLOT_ID)) return
    const slot = host.document.createElement('div')
    slot.id = POP800_SLOT_ID
    slot.setAttribute('data-job-no', creds.jobNo)
    slot.setAttribute('hidden', 'true')
    slot.setAttribute('aria-hidden', 'true')
    const parent = host.document.body || host.document.documentElement
    parent?.appendChild(slot)
  }

  function ensureScriptPlaceholder() {
    if (host.document.querySelector(`script[${POP800_SCRIPT_ATTR}="1"]`)) return
    const el = host.document.createElement('script')
    el.async = true
    el.setAttribute(POP800_SCRIPT_ATTR, '1')
    el.setAttribute('data-job-no', creds.jobNo)
    el.setAttribute('data-ukey', creds.ukey)
    // 阶段 B 再写入国内 800.js 的 src。本阶段即使有 ID 也不发外链请求。
    if (options.allowThirdPartyScript) {
      el.setAttribute('data-pop800-ready', '1')
    }
    const parent = host.document.body || host.document.documentElement
    parent?.appendChild(el)
  }

  return {
    id: 'pop800',
    mount() {
      mounted = true
      helpers.ensureStyle()
      ensureSlot()
      if (options.allowThirdPartyScript) ensureScriptPlaceholder()
    },
    openChat(projectCtx) {
      if (!mounted) return
      try {
        if (typeof host.POP800?.openChat === 'function') {
          host.POP800.openChat(projectCtx)
          return
        }
      } catch {
        // 运行时未就绪时回退本地回执
      }
      helpers.showReceipt(projectCtx, '回聊通道待接入')
    },
    notifyRouteChange(projectCtx) {
      const key = `${projectCtx.site}:${projectCtx.path}`
      const prev = routeLog[routeLog.length - 1]
      if (prev && `${prev.site}:${prev.path}` === key) return
      routeLog.push(projectCtx)
    },
    stop() {
      mounted = false
      removeNode(host, POP800_SLOT_ID)
      helpers.removeEl(RECEIPT_ID)
    },
  }
}

