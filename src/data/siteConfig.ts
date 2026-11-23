import { publicAsset } from '../utils/publicAsset.ts'

export const POSITIONING = '高级前端工程师｜AI 应用工程化'
export const RESUME_FILENAME = '魏建军-资深7年前端-18352517082.pdf'
export const RESUME_LEGACY_FILENAME = 'wei-jianjun-resume.pdf'
export const RESUME_SHA256 = '08eab5fe16ead1e965149a879fe30c62b3790f083ad9e360f39753e28252622c'

export const RESUME_PATH = `resume/${encodeURIComponent(RESUME_FILENAME)}`
export const RESUME_HREF = publicAsset(RESUME_PATH)

const envMeta = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : undefined

export const MAIN_SITE_URL = (envMeta?.VITE_MAIN_SITE_URL || 'https://weijianjun.me/').replace(
  /\/?$/,
  '/',
)
export const WORK_SITE_URL = (envMeta?.VITE_WORK_SITE_URL || 'https://work.weijianjun.me/').replace(
  /\/?$/,
  '/',
)

export function workUrl(path = ''): string {
  const clean = path.replace(/^\/+/, '')
  return clean ? `${WORK_SITE_URL}${clean}` : WORK_SITE_URL
}

export function mainUrl(hash = ''): string {
  if (!hash) return MAIN_SITE_URL
  return hash.startsWith('#') ? `${MAIN_SITE_URL}${hash}` : `${MAIN_SITE_URL}#${hash}`
}
