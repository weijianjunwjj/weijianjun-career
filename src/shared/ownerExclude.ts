/** 站长排除、欢迎防重与匿名上下文的纯逻辑。依赖全部可注入，便于 node --test。 */

export const OWNER_COOKIE = 'wjj_owner_exclude'
export const OWNER_STORAGE_KEY = 'wjj.owner_exclude'
export const WELCOME_COOKIE = 'wjj_welcome_shown'
export const WELCOME_STORAGE_KEY = 'wjj.welcome_shown'
export const FLAG_VALUE = '1'
export const OWNER_COOKIE_MAX_AGE = 31536000
export const ROOT_COOKIE_DOMAIN = '.weijianjun.me'
export const BAIDU_HM_ID_PATTERN = /^[a-f0-9]{32}$/i
export const WELCOME_FALLBACK_MS = 4000
export const PREVIEW_QUERY = 'visitor-preview'

export const PROJECT_WHITELIST = [
  'courier',
  'analytics',
  'lowcode',
  'liveshop',
  'ai-engineering',
] as const

export type ProjectId = (typeof PROJECT_WHITELIST)[number]
export type OwnerHashAction = 'exclude' | 'include' | 'status'
export type VisitorAdapterId = 'none' | 'baidu' | 'preview'
export type VisitorSkipReason = 'owner' | 'loopback' | 'none'
export type VisitorAdapterDecision =
  | { adapter: 'baidu' | 'preview' }
  | { adapter: 'none'; reason: VisitorSkipReason }

export type StorageLike = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export type PersistIo = {
  hostname: string
  protocol?: string
  getCookie: () => string
  setCookie: (value: string) => void
  localStorage?: StorageLike | null
  sessionStorage?: StorageLike | null
}

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])
const PROJECT_SET = new Set<string>(PROJECT_WHITELIST)
const SAFE_PATH_RE = /^[a-zA-Z0-9/_-]+$/

export function isLoopbackHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.+$/, '')
  return LOOPBACK_HOSTS.has(host) || host === '0:0:0:0:0:0:0:1'
}

export function isWeijianjunHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.+$/, '')
  return host === 'weijianjun.me' || host.endsWith('.weijianjun.me')
}

export function isValidBaiduHmId(value: unknown): value is string {
  return typeof value === 'string' && BAIDU_HM_ID_PATTERN.test(value)
}

export function resolveBaiduHmId(input: {
  site: 'main' | 'work'
  mainId: unknown
  workId: unknown
}): string {
  if (input.site === 'work') {
    if (isValidBaiduHmId(input.workId)) return input.workId
    if (isValidBaiduHmId(input.mainId)) return input.mainId
    return ''
  }
  return isValidBaiduHmId(input.mainId) ? input.mainId : ''
}

export function shouldInjectBaiduScript(input: {
  ownerExcluded: boolean
  hostname: string
  hmId: unknown
}): boolean {
  if (input.ownerExcluded) return false
  if (!isValidBaiduHmId(input.hmId)) return false
  if (isLoopbackHost(input.hostname)) return false
  return isWeijianjunHost(input.hostname)
}

export function hasPreviewQuery(search: string): boolean {
  const raw = search.startsWith('?') ? search.slice(1) : search
  return new URLSearchParams(raw).get(PREVIEW_QUERY) === '1'
}

export function parseOwnerHash(hash: string): OwnerHashAction | null {
  const raw = (hash.startsWith('#') ? hash : `#${hash}`).split('?')[0].toLowerCase()
  if (raw === '#owner-exclude') return 'exclude'
  if (raw === '#owner-include') return 'include'
  if (raw === '#owner-status') return 'status'
  return null
}

export function readCookieFlag(cookieHeader: string, name: string): boolean {
  if (!cookieHeader) return false
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=')
    if (idx < 0) continue
    const key = part.slice(0, idx).trim()
    const value = part.slice(idx + 1).trim()
    if (key === name && value === FLAG_VALUE) return true
  }
  return false
}

export function readStorageFlag(storage: StorageLike | null | undefined, key: string): boolean {
  if (!storage) return false
  try {
    return storage.getItem(key) === FLAG_VALUE
  } catch {
    return false
  }
}

function writeStorageFlag(storage: StorageLike | null | undefined, key: string, on: boolean) {
  if (!storage) return
  try {
    if (on) storage.setItem(key, FLAG_VALUE)
    else storage.removeItem(key)
  } catch {
    // 无痕模式或配额不足时静默跳过
  }
}

export function usesRootDomainCookie(hostname: string): boolean {
  return isWeijianjunHost(hostname)
}

export function buildFlagCookie(
  name: string,
  options: {
    hostname: string
    protocol?: string
    persistent: boolean
    clear?: boolean
    hostOnly?: boolean
  },
): string {
  const root = usesRootDomainCookie(options.hostname)
  const secure = options.protocol === 'https:' || root
  const parts = [`${name}=${options.clear ? '' : FLAG_VALUE}`, 'Path=/', 'SameSite=Lax']
  if (options.clear) {
    parts.push('Max-Age=0')
  } else if (options.persistent) {
    parts.push(`Max-Age=${OWNER_COOKIE_MAX_AGE}`)
  }
  if (root && !options.hostOnly) parts.push(`Domain=${ROOT_COOKIE_DOMAIN}`)
  if (secure) parts.push('Secure')
  return parts.join('; ')
}

export function isOwnerExcluded(io: PersistIo): boolean {
  return (
    readCookieFlag(io.getCookie(), OWNER_COOKIE) ||
    readStorageFlag(io.localStorage, OWNER_STORAGE_KEY)
  )
}

export function setOwnerExcluded(io: PersistIo, excluded: boolean): void {
  io.setCookie(
    buildFlagCookie(OWNER_COOKIE, {
      hostname: io.hostname,
      protocol: io.protocol,
      persistent: true,
      clear: !excluded,
    }),
  )
  if (!excluded && usesRootDomainCookie(io.hostname)) {
    io.setCookie(
      buildFlagCookie(OWNER_COOKIE, {
        hostname: io.hostname,
        protocol: io.protocol,
        persistent: true,
        clear: true,
        hostOnly: true,
      }),
    )
  }
  writeStorageFlag(io.localStorage, OWNER_STORAGE_KEY, excluded)
}

export function isWelcomeShown(io: PersistIo): boolean {
  return (
    readCookieFlag(io.getCookie(), WELCOME_COOKIE) ||
    readStorageFlag(io.sessionStorage, WELCOME_STORAGE_KEY)
  )
}

export function markWelcomeShown(io: PersistIo): void {
  io.setCookie(
    buildFlagCookie(WELCOME_COOKIE, {
      hostname: io.hostname,
      protocol: io.protocol,
      persistent: false,
    }),
  )
  writeStorageFlag(io.sessionStorage, WELCOME_STORAGE_KEY, true)
}

export function decideVisitorAdapter(input: {
  ownerExcluded: boolean
  hostname: string
  search: string
}): VisitorAdapterDecision {
  if (input.ownerExcluded) return { adapter: 'none', reason: 'owner' }
  if (isLoopbackHost(input.hostname) && !hasPreviewQuery(input.search)) {
    return { adapter: 'none', reason: 'loopback' }
  }
  if (!isLoopbackHost(input.hostname) && isWeijianjunHost(input.hostname)) {
    return { adapter: 'baidu' }
  }
  if (hasPreviewQuery(input.search)) return { adapter: 'preview' }
  return { adapter: 'none', reason: 'none' }
}

export function stripHashFromUrl(pathname: string, search = ''): string {
  return `${pathname || '/'}${search || ''}`
}

export function sanitizeProjectId(value: unknown): ProjectId | undefined {
  return typeof value === 'string' && PROJECT_SET.has(value) ? (value as ProjectId) : undefined
}

export function sanitizeVisitorPath(raw: unknown): string {
  if (typeof raw !== 'string' || !raw.trim()) return '/'
  let path = raw.trim()
  const queryIdx = path.indexOf('?')
  if (queryIdx >= 0) path = path.slice(0, queryIdx)

  const hashIdx = path.indexOf('#')
  if (hashIdx >= 0) {
    const base = path.slice(0, hashIdx) || '/'
    const hash = path.slice(hashIdx)
    if (parseOwnerHash(hash)) return base
    const project = sanitizeProjectId(hash.slice(1).split('&')[0])
    if (project) return `${base === '' ? '/' : base}#${project}`
    return base || '/'
  }

  if (path.includes('@') || !SAFE_PATH_RE.test(path) || path.length > 160) return '/'
  const withSlash = path.startsWith('/') ? path : `/${path}`
  return withSlash.replace(/\/+$/, '') || '/'
}

export function sanitizeVisitorEvent(input: {
  site?: unknown
  path?: unknown
  project?: unknown
  projectId?: unknown
  title?: unknown
  [extra: string]: unknown
}): { site: 'main' | 'work'; path: string; project?: ProjectId } {
  const site = input.site === 'work' ? 'work' : 'main'
  const path = sanitizeVisitorPath(input.path)
  const project = sanitizeProjectId(input.projectId ?? input.project)
  const out: { site: 'main' | 'work'; path: string; project?: ProjectId } = { site, path }
  if (project) out.project = project
  return out
}

export function resolveMainProjectId(hash: string): ProjectId | undefined {
  const id = (hash.startsWith('#') ? hash.slice(1) : hash).split(/[?&]/)[0]
  return sanitizeProjectId(id)
}

export function resolveWorkProjectId(path: string): ProjectId | undefined {
  const clean = sanitizeVisitorPath(path)
  if (clean.startsWith('/projects/courier')) return 'courier'
  if (clean.startsWith('/projects/analytics')) return 'analytics'
  if (clean.startsWith('/projects/lowcode')) return 'lowcode'
  if (clean.startsWith('/projects/liveshop')) return 'liveshop'
  return undefined
}

export function otherSiteOwnerUrl(input: {
  hostname: string
  port?: string
  protocol?: string
  excluded: boolean
  mainSiteUrl?: string
  workSiteUrl?: string
}): string {
  const hash = input.excluded ? '#owner-exclude' : '#owner-include'
  if (isLoopbackHost(input.hostname)) {
    const protocol = input.protocol || 'http:'
    const port = input.port || ''
    const pair: Record<string, string> = {
      '5173': '5174',
      '5174': '5173',
      '4173': '4174',
      '4174': '4173',
    }
    const nextPort = pair[port] || '5174'
    return `${protocol}//127.0.0.1:${nextPort}/${hash}`
  }
  const onWork = input.hostname.toLowerCase().startsWith('work.')
  const base = onWork
    ? input.mainSiteUrl || 'https://weijianjun.me/'
    : input.workSiteUrl || 'https://work.weijianjun.me/'
  const withSlash = base.endsWith('/') ? base : `${base}/`
  return `${withSlash}${hash}`
}
