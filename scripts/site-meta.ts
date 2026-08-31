import { profile } from '../src/data/profile.ts'

// User-confirmed production origin. Never infer origins from request headers.
const productionOrigin = 'https://weijianjun-career.vercel.app'
export function socialTags(env: Record<string, string | undefined>) {
  const configured = env.VITE_SITE_URL
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL
  const raw = configured || (vercel ? `https://${vercel}` : productionOrigin)
  const url = new URL(raw)
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'Public site URL must be a clean HTTPS origin (no path, credentials, query or hash).',
    )
  }
  const origin = url.origin
  const { title, description } = profile.meta
  return [
    { tag: 'title', children: title },
    { tag: 'meta', attrs: { name: 'description', content: description } },
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { tag: 'meta', attrs: { property: 'og:locale', content: 'zh_CN' } },
    { tag: 'meta', attrs: { property: 'og:title', content: title } },
    { tag: 'meta', attrs: { property: 'og:description', content: description } },
    { tag: 'meta', attrs: { property: 'og:url', content: `${origin}/` } },
    { tag: 'meta', attrs: { property: 'og:image', content: `${origin}/og.png` } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1730' } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '909' } },
    {
      tag: 'meta',
      attrs: {
        property: 'og:image:alt',
        content: 'BUILD BEYOND FRONTEND. / WEI JIANJUN · Frontend & AI Product Engineer',
      },
    },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: `${origin}/og.png` } },
    {
      tag: 'meta',
      attrs: { name: 'twitter:image:alt', content: 'BUILD BEYOND FRONTEND. / WEI JIANJUN' },
    },
    { tag: 'link', attrs: { rel: 'canonical', href: `${origin}/` } },
  ]
}
