import { profile } from '../data/profile.ts'
import { publicAsset } from '../utils/publicAsset.ts'
import {
  WELCOME_FALLBACK_MS,
  decideVisitorAdapter,
  isOwnerExcluded,
  isWelcomeShown,
  markWelcomeShown,
  otherSiteOwnerUrl,
  parseOwnerHash,
  resolveBaiduHmId,
  resolveMainProjectId,
  resolveWorkProjectId,
  sanitizeVisitorEvent,
  setOwnerExcluded,
  shouldInjectBaiduScript,
  stripHashFromUrl,
  type PersistIo,
  type ProjectId,
  type StorageLike,
  type VisitorAdapterId,
} from './ownerExclude.ts'
import {
  CONTACT_CARD_ID,
  CONTACT_LAUNCHER_ID,
  RECEIPT_ID,
  createBaiduAdapter,
  createNoneAdapter,
  createPreviewAdapter,
  type ProjectCtx,
  type VisitorChatAdapter,
  type VisitorHostLike,
} from './visitorAdapter.ts'

export {
  decideVisitorAdapter,
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
  setOwnerExcluded,
  shouldInjectBaiduScript,
} from './ownerExclude.ts'

export { createNoneAdapter, createBaiduAdapter, createPreviewAdapter } from './visitorAdapter.ts'
export type { ProjectCtx, VisitorChatAdapter } from './visitorAdapter.ts'

const OWNER_BAR_ID = 'wjj-owner-status'
const BUBBLE_ID = 'wjj-welcome-bubble'
const STYLE_ID = 'wjj-visitor-widget-style'
const COPY_RESET_MS = 2000

export const PROJECT_LABELS: Record<ProjectId, string> = {
  courier: '中邮通快递双端',
  analytics: '友谊时光 EBI 与微前端',
  lowcode: '企业级低代码引擎',
  liveshop: 'LiveShop 跨端电商',
  'ai-engineering': 'NovaWing AI 工程化',
}

const WIDGET_CSS = `
@keyframes wjj-pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(56, 232, 255, 0.62); }
  70% { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(56, 232, 255, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(56, 232, 255, 0); }
}
@keyframes wjj-rise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
#wjj-owner-status,
#wjj-welcome-bubble,
#wjj-visitor-receipt,
#wjj-contact-card,
#wjj-contact-launcher {
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
#wjj-welcome-bubble button,
#wjj-visitor-receipt button,
#wjj-contact-card button {
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
#wjj-visitor-receipt {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 40;
  width: min(360px, calc(100vw - 32px));
  padding: 14px 14px 12px;
  border-radius: 16px;
  border: 1px solid rgba(148, 179, 255, 0.18);
  background: rgba(11, 19, 38, 0.88);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 18px 40px -24px rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(16px);
}
#wjj-welcome-bubble,
#wjj-contact-card {
  position: fixed;
  right: 24px;
  left: auto;
  z-index: 60;
  width: min(360px, calc(100vw - 32px));
  padding: 14px 14px 12px;
  border-radius: 16px;
  backdrop-filter: blur(16px);
}
#wjj-welcome-bubble {
  right: 24px;
  bottom: 82px;
  z-index: 60;
  border: 1.5px solid rgba(56, 232, 255, 0.65);
  background: rgba(9, 17, 36, 0.96);
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.9), 0 0 28px -6px rgba(56, 232, 255, 0.35);
  animation: wjj-rise 0.32s ease-out;
}
#wjj-contact-card {
  right: 24px;
  bottom: 24px;
  z-index: 60;
  border: 1.5px solid rgba(56, 232, 255, 0.55);
  background: rgba(9, 17, 36, 0.96);
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.9), 0 0 24px -6px rgba(56, 232, 255, 0.32);
}
#wjj-welcome-bubble p { margin: 0 20px 12px 0; font-size: 14px; line-height: 1.55; color: #eef5ff; }
#wjj-visitor-receipt p,
#wjj-contact-card p { margin: 0 20px 12px 0; font-size: 14px; line-height: 1.55; color: #d5e2f5; }
#wjj-visitor-receipt dl { margin: 0 20px 12px 0; }
#wjj-visitor-receipt dt { font-size: 11px; letter-spacing: 0.04em; color: #6f84a8; }
#wjj-visitor-receipt dd { margin: 0 0 8px; font-size: 13px; color: #f0f5ff; }
#wjj-welcome-bubble .wjj-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 28px 10px 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #e6fbff;
}
#wjj-welcome-bubble .wjj-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
#wjj-contact-card .wjj-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
#wjj-welcome-bubble [data-action="chat"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(165, 243, 252, 0.55);
  background: linear-gradient(135deg, #38e8ff 0%, #3b82f6 58%, #7c5cff 100%);
  color: #030712;
  text-decoration: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
}
#wjj-contact-card [data-action="mailto"] {
  padding: 8px 14px;
  border: 1px solid rgba(165, 243, 252, 0.45);
  background: linear-gradient(135deg, #52eeff 0%, #38bdf8 48%, #5b82ff 100%);
  color: #030712;
  text-decoration: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
}
#wjj-contact-card [data-action="copy-email"],
#wjj-contact-card [data-action="copy-wechat"] {
  padding: 7px 12px;
  border: 1px solid rgba(56, 232, 255, 0.28);
  background: rgba(16, 27, 51, 0.7);
  color: #e6fbff;
}
#wjj-welcome-bubble [data-action="close"],
#wjj-visitor-receipt [data-action="close"],
#wjj-contact-card [data-action="close"] {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: #6f84a8;
}
#wjj-contact-card .wjj-block { margin: 0 0 12px; }
#wjj-contact-card .wjj-label {
  display: block;
  margin: 0 0 6px;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: #6f84a8;
}
#wjj-contact-card img[data-field="wechat-qr"] {
  display: block;
  width: 184px;
  height: auto;
  max-height: 240px;
  object-fit: contain;
  padding: 6px;
  margin-bottom: 8px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(56, 232, 255, 0.28);
}
#wjj-contact-card [data-field="wechat-placeholder"] {
  margin: 0 0 8px;
  padding: 12px;
  border-radius: 12px;
  border: 1px dashed rgba(148, 179, 255, 0.28);
  color: #a3b5d4;
  font-size: 13px;
  line-height: 1.5;
}
#wjj-contact-launcher {
  position: fixed;
  right: 24px;
  bottom: 24px;
  left: auto;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #38e8ff 0%, #3b82f6 58%, #7c5cff 100%);
  color: #030712;
  box-shadow: 0 10px 30px -6px rgba(56, 232, 255, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.28) inset;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
#wjj-contact-launcher:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 36px -6px rgba(56, 232, 255, 0.72), 0 0 0 1px rgba(255, 255, 255, 0.4) inset;
}
.wjj-pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4dffc2;
  box-shadow: 0 0 0 0 rgba(56, 232, 255, 0.65);
  animation: wjj-pulse 1.7s ease-out infinite;
  flex-shrink: 0;
}
@media (max-width: 640px) {
  #wjj-contact-card,
  #wjj-contact-launcher {
    right: 16px;
    bottom: 16px;
  }
  #wjj-welcome-bubble {
    right: 16px;
    bottom: 74px;
  }
}
@media (max-width: 390px) {
  #wjj-welcome-bubble,
  #wjj-contact-card { width: calc(100vw - 32px); }
}
@media (prefers-reduced-motion: reduce) {
  #wjj-owner-status, #wjj-welcome-bubble, #wjj-visitor-receipt,
  #wjj-contact-card, #wjj-contact-launcher { backdrop-filter: none; }
  .wjj-pulse,
  #wjj-welcome-bubble { animation: none; }
  #wjj-contact-launcher { transition: none; }
}
`

export type VisitorHost = VisitorHostLike & {
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
  document: VisitorHostLike['document'] & {
    cookie: string
    visibilityState: string
    addEventListener: (type: string, listener: EventListener) => void
    removeEventListener: (type: string, listener: EventListener) => void
  }
  localStorage?: StorageLike | null
  sessionStorage?: StorageLike | null
  navigator?: { clipboard?: { writeText: (value: string) => Promise<void> } }
  addEventListener: (type: string, listener: EventListener) => void
  removeEventListener: (type: string, listener: EventListener) => void
}

export type VisitorWidgetOptions = {
  site: 'main' | 'work'
  host?: VisitorHost
  baiduHmIdMain?: string
  baiduHmIdWork?: string
  fallbackDelayMs?: number
  setTimeoutFn?: typeof setTimeout
  clearTimeoutFn?: typeof clearTimeout
  mainSiteUrl?: string
  workSiteUrl?: string
}

type SanitizedEvent = { site: 'main' | 'work'; path: string; project?: ProjectId }

type TimerHandle = ReturnType<typeof setTimeout>

let started = false
let mounted = false
let baiduScriptInjected = false
let adapterId: VisitorAdapterId = 'none'
let adapter: VisitorChatAdapter = createNoneAdapter()
let siteKind: 'main' | 'work' = 'main'
let hostRef: VisitorHost | null = null
let lastPathKey = ''
let lastEvent: SanitizedEvent | null = null
let fallbackTimer: TimerHandle | null = null
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

function envValue(name: 'VITE_BAIDU_HM_ID_MAIN' | 'VITE_BAIDU_HM_ID_WORK'): string {
  try {
    const value =
      name === 'VITE_BAIDU_HM_ID_MAIN'
        ? import.meta.env.VITE_BAIDU_HM_ID_MAIN
        : import.meta.env.VITE_BAIDU_HM_ID_WORK
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

export function projectLabel(project?: ProjectId): string {
  return project ? PROJECT_LABELS[project] : ''
}

export function welcomeCopy(project?: ProjectId): string {
  const label = projectLabel(project)
  if (label) return `正在看「${label}」？有想交流的技术细节或岗位机会，欢迎直接联系我。`
  return '你好，正在看哪个项目？有想交流的技术细节或岗位机会，欢迎直接联系我。'
}

export function buildMailtoHref(project?: ProjectId): string {
  const email = profile.email
  const label = projectLabel(project)
  const subject = label ? `交流《${label}》项目 / 岗位沟通` : '交流项目 / 岗位沟通'
  const body = label
    ? `你好，魏建军。我正在看「${label}」，想交流技术细节或岗位机会。`
    : '你好，魏建军。我想交流技术细节或岗位机会。'
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function copyText(host: VisitorHost, button: { textContent?: string }, value: string, idleLabel: string) {
  const markCopied = () => {
    button.textContent = '已复制'
    setTimeoutFn(() => {
      if (button.textContent === '已复制') button.textContent = idleLabel
    }, COPY_RESET_MS)
  }
  const clip = host.navigator?.clipboard
  if (clip && typeof clip.writeText === 'function') {
    Promise.resolve(clip.writeText(value)).then(markCopied).catch(() => {})
    return
  }
  markCopied()
}

function showContactCard(host: VisitorHost, ctx?: ProjectCtx) {
  const io = ioFromHost(host)
  if (isOwnerExcluded(io) || !hasInteractiveChannel()) return
  ensureStyle(host)
  hideWelcomeBubble(host, { persistLauncher: false })
  removeEl(host, CONTACT_CARD_ID)
  removeEl(host, CONTACT_LAUNCHER_ID)
  removeEl(host, RECEIPT_ID)
  const project = (ctx || currentCtx(host)).project
  const card = host.document.createElement('div')
  card.id = CONTACT_CARD_ID
  card.setAttribute('role', 'dialog')
  card.setAttribute('aria-modal', 'true')
  card.setAttribute('aria-label', '直联魏建军')

  const close = host.document.createElement('button')
  close.type = 'button'
  close.setAttribute('data-action', 'close')
  close.setAttribute('aria-label', '关闭')
  close.textContent = '×'
  close.addEventListener('click', () => hideContactCard(host))
  card.appendChild(close)

  const title = host.document.createElement('p')
  title.textContent = '邮箱 / 微信直联'
  card.appendChild(title)

  const mailBlock = host.document.createElement('div')
  mailBlock.setAttribute('class', 'wjj-block')
  const mailLabel = host.document.createElement('span')
  mailLabel.setAttribute('class', 'wjj-label')
  mailLabel.textContent = '邮箱'
  mailBlock.appendChild(mailLabel)
  const mailRow = host.document.createElement('div')
  mailRow.setAttribute('class', 'wjj-row')
  const mail = host.document.createElement('a')
  mail.href = buildMailtoHref(project)
  mail.setAttribute('data-action', 'mailto')
  mail.textContent = '一键发邮件（打开 Mail）'
  mailRow.appendChild(mail)
  const copyEmail = host.document.createElement('button')
  copyEmail.type = 'button'
  copyEmail.setAttribute('data-action', 'copy-email')
  copyEmail.textContent = '复制邮箱'
  copyEmail.addEventListener('click', () => copyText(host, copyEmail, profile.email, '复制邮箱'))
  mailRow.appendChild(copyEmail)
  mailBlock.appendChild(mailRow)
  card.appendChild(mailBlock)

  const wechatBlock = host.document.createElement('div')
  wechatBlock.setAttribute('class', 'wjj-block')
  const wechatLabel = host.document.createElement('span')
  wechatLabel.setAttribute('class', 'wjj-label')
  wechatLabel.textContent = '个人微信'
  wechatBlock.appendChild(wechatLabel)

  const qr = host.document.createElement('img')
  qr.setAttribute('data-field', 'wechat-qr')
  qr.setAttribute('alt', '魏建军个人微信二维码')
  qr.setAttribute('width', '184')
  qr.setAttribute('height', '234')
  qr.src = publicAsset('contact/wechat-qr.jpg')

  const placeholder = host.document.createElement('p')
  placeholder.setAttribute('data-field', 'wechat-placeholder')
  placeholder.hidden = true
  placeholder.textContent = `微信二维码尚未放入。可复制微信号 / 电话：${profile.phone}`

  const degradeQr = () => {
    qr.hidden = true
    placeholder.hidden = false
  }
  qr.onerror = degradeQr
  qr.addEventListener('error', degradeQr)
  wechatBlock.appendChild(qr)
  wechatBlock.appendChild(placeholder)

  const copyWechat = host.document.createElement('button')
  copyWechat.type = 'button'
  copyWechat.setAttribute('data-action', 'copy-wechat')
  copyWechat.textContent = '复制微信号'
  copyWechat.addEventListener('click', () => copyText(host, copyWechat, profile.phone, '复制微信号'))
  wechatBlock.appendChild(copyWechat)
  card.appendChild(wechatBlock)

  host.document.body?.appendChild(card)
}

function hideContactCard(host: VisitorHost, options: { persistLauncher?: boolean } = {}) {
  removeEl(host, CONTACT_CARD_ID)
  if (options.persistLauncher !== false) showContactLauncher(host)
}

function showContactLauncher(host: VisitorHost) {
  const io = ioFromHost(host)
  if (isOwnerExcluded(io) || !hasInteractiveChannel()) return
  if (host.document.getElementById(CONTACT_CARD_ID)) return
  if (host.document.getElementById(CONTACT_LAUNCHER_ID)) return
  ensureStyle(host)
  const launcher = host.document.createElement('button')
  launcher.id = CONTACT_LAUNCHER_ID
  launcher.type = 'button'
  launcher.setAttribute('data-action', 'launcher')
  launcher.setAttribute('aria-label', '聊聊 / 联系魏建军')
  const pulse = host.document.createElement('span')
  pulse.setAttribute('class', 'wjj-pulse')
  pulse.setAttribute('aria-hidden', 'true')
  const label = host.document.createElement('span')
  label.textContent = '聊聊 / 联系魏建军'
  launcher.appendChild(pulse)
  launcher.appendChild(label)
  launcher.addEventListener('click', () => showContactCard(host, currentCtx(host)))
  host.document.body?.appendChild(launcher)
}

function hideContactLauncher(host: VisitorHost) {
  removeEl(host, CONTACT_LAUNCHER_ID)
}

function stopLiveVisitorSurface(host: VisitorHost) {
  cancelFallbackTimer()
  hideWelcomeBubble(host, { persistLauncher: false })
  hideContactCard(host, { persistLauncher: false })
  hideContactLauncher(host)
  lastEvent = null
  adapter.stop()
}

function applyOwnerExclusion(host: VisitorHost, excluded: boolean) {
  setOwnerExcluded(ioFromHost(host), excluded)
  if (excluded) stopLiveVisitorSurface(host)
}

function handleOwnerHash(host: VisitorHost): boolean {
  const action = parseOwnerHash(host.location.hash)
  if (!action) return false
  if (action === 'exclude') applyOwnerExclusion(host, true)
  if (action === 'include') applyOwnerExclusion(host, false)
  const next = stripHashFromUrl(host.location.pathname, host.location.search)
  // 真实浏览器 replaceState 会同步清空 location.hash；不要再写 location.hash = ''，
  // 否则会新增一条带尾部 # 的历史记录并触发多余 hashchange。
  host.history.replaceState(host.history.state ?? null, '', next)
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
  if (excluded && baiduScriptInjected) {
    status.innerHTML =
      '<strong>站长排除已开启</strong> · 访客统计与联系入口不会加载，也不会产生访问记录。当前页此前已注入百度统计，请刷新一次页面以彻底断开连接。'
  } else if (excluded) {
    status.innerHTML = '<strong>站长排除已开启</strong> · 访客统计与联系入口不会加载，也不会产生访问记录。'
  } else {
    status.innerHTML = '<strong>站长排除未开启</strong> · 当前浏览器会按访客处理（生产域提供欢迎与直联入口）。'
  }
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
    applyOwnerExclusion(host, !isOwnerExcluded(ioFromHost(host)))
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

function hasInteractiveChannel(): boolean {
  return adapterId === 'baidu' || adapterId === 'preview'
}

function shouldOfferWelcome(host: VisitorHost): boolean {
  const io = ioFromHost(host)
  if (isOwnerExcluded(io) || isWelcomeShown(io)) return false
  if (host.document.visibilityState !== 'visible') return false
  if (!hasInteractiveChannel()) return false
  return true
}

function scheduleWelcome(host: VisitorHost) {
  cancelFallbackTimer()
  if (!shouldOfferWelcome(host)) return
  fallbackTimer = setTimeoutFn(() => {
    fallbackTimer = null
    if (!shouldOfferWelcome(host)) return
    showWelcomeBubble(host)
  }, fallbackDelay) as TimerHandle
}

function currentCtx(host: VisitorHost): ProjectCtx {
  if (lastEvent) return lastEvent
  if (siteKind === 'main') {
    const project = resolveMainProjectId(host.location.hash)
    return sanitizeVisitorEvent({
      site: 'main',
      path: project ? `/#${project}` : host.location.pathname || '/',
      projectId: project,
    })
  }
  const path = host.location.pathname || '/'
  return sanitizeVisitorEvent({
    site: 'work',
    path,
    projectId: resolveWorkProjectId(path),
  })
}

function showWelcomeBubble(host: VisitorHost) {
  const io = ioFromHost(host)
  if (isOwnerExcluded(io) || isWelcomeShown(io)) return
  if (!hasInteractiveChannel()) return
  if (host.document.getElementById(BUBBLE_ID)) return
  ensureStyle(host)
  markWelcomeShown(io)

  const bubble = host.document.createElement('div')
  bubble.id = BUBBLE_ID
  bubble.setAttribute('role', 'dialog')
  bubble.setAttribute('aria-label', '访客欢迎')

  const close = host.document.createElement('button')
  close.type = 'button'
  close.setAttribute('data-action', 'close')
  close.setAttribute('aria-label', '关闭')
  close.textContent = '×'
  close.addEventListener('click', () => hideWelcomeBubble(host))
  bubble.appendChild(close)

  const head = host.document.createElement('div')
  head.setAttribute('class', 'wjj-head')
  const headPulse = host.document.createElement('span')
  headPulse.setAttribute('class', 'wjj-pulse')
  headPulse.setAttribute('aria-hidden', 'true')
  const headText = host.document.createElement('span')
  headText.textContent = '魏建军 · 欢迎交流'
  head.appendChild(headPulse)
  head.appendChild(headText)
  bubble.appendChild(head)

  const copy = host.document.createElement('p')
  copy.setAttribute('data-field', 'welcome-copy')
  copy.textContent = welcomeCopy(currentCtx(host).project)
  bubble.appendChild(copy)

  const row = host.document.createElement('div')
  row.setAttribute('class', 'wjj-row')
  const chat = host.document.createElement('button')
  chat.type = 'button'
  chat.setAttribute('data-action', 'chat')
  chat.textContent = '一键发邮件 / 加微信'
  chat.addEventListener('click', () => {
    hideWelcomeBubble(host, { persistLauncher: false })
    adapter.openChat(currentCtx(host))
  })
  row.appendChild(chat)
  bubble.appendChild(row)
  host.document.body?.appendChild(bubble)
}

function hideWelcomeBubble(host: VisitorHost, options: { persistLauncher?: boolean } = {}) {
  removeEl(host, BUBBLE_ID)
  if (options.persistLauncher !== false) showContactLauncher(host)
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

function buildAdapter(
  host: VisitorHost,
  id: VisitorAdapterId,
  hmId: string,
  injectScript: boolean,
): VisitorChatAdapter {
  const helpers = {
    ensureStyle: () => ensureStyle(host),
    removeEl: (elId: string) => removeEl(host, elId),
    showContactCard: (ctx: ProjectCtx) => showContactCard(host, ctx),
  }
  if (id === 'preview') return createPreviewAdapter(helpers)
  if (id === 'baidu') return createBaiduAdapter(host, { hmId, injectScript, helpers })
  return createNoneAdapter()
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
  lastEvent = event
  adapter.notifyRouteChange(event)
}

export function setupVisitorWidget(options: VisitorWidgetOptions): {
  adapter: VisitorAdapterId
  mounted: boolean
  reason?: string
} {
  if (started && !options.host) {
    return { adapter: adapterId, mounted, reason: mounted ? undefined : 'already-initialized' }
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
    if (host.document.getElementById(BUBBLE_ID)) hideWelcomeBubble(host)
    if (host.document.getElementById(CONTACT_CARD_ID)) hideContactCard(host)
    if (host.document.getElementById(RECEIPT_ID)) removeEl(host, RECEIPT_ID)
  })

  const io = ioFromHost(host)
  const hmId = resolveBaiduHmId({
    site: siteKind,
    mainId: options.baiduHmIdMain ?? envValue('VITE_BAIDU_HM_ID_MAIN'),
    workId: options.baiduHmIdWork ?? envValue('VITE_BAIDU_HM_ID_WORK'),
  })
  const decision = decideVisitorAdapter({
    ownerExcluded: isOwnerExcluded(io),
    hostname: host.location.hostname,
    search: host.location.search,
  })

  adapterId = decision.adapter
  const injectScript = shouldInjectBaiduScript({
    ownerExcluded: isOwnerExcluded(io),
    hostname: host.location.hostname,
    hmId,
  })
  baiduScriptInjected = injectScript
  adapter = buildAdapter(host, adapterId, hmId, injectScript)

  if (decision.adapter === 'none') {
    mounted = false
    if (siteKind === 'main') emitMainRoute(host)
    return { adapter: 'none', mounted: false, reason: decision.reason }
  }

  listen(host.document, 'visibilitychange', () => {
    if (host.document.visibilityState !== 'visible') cancelFallbackTimer()
    else scheduleWelcome(host)
  })

  const initialCtx = currentCtx(host)
  adapter.mount(initialCtx)
  mounted = true
  if (siteKind === 'main') emitMainRoute(host)
  scheduleWelcome(host)
  showContactLauncher(host)
  return { adapter: adapterId, mounted: true }
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
  adapter.stop()
  started = false
  mounted = false
  baiduScriptInjected = false
  adapterId = 'none'
  adapter = createNoneAdapter()
  hostRef = null
  lastPathKey = ''
  lastEvent = null
  fallbackDelay = WELCOME_FALLBACK_MS
  setTimeoutFn = setTimeout
  clearTimeoutFn = clearTimeout
}

export function getVisitorWidgetDebugState(): {
  adapter: VisitorAdapterId
  mounted: boolean
  lastPathKey: string
  lastEvent: SanitizedEvent | null
  hasFallbackTimer: boolean
  baiduScriptInjected: boolean
} {
  return {
    adapter: adapterId,
    mounted,
    lastPathKey,
    lastEvent,
    hasFallbackTimer: fallbackTimer != null,
    baiduScriptInjected,
  }
}
