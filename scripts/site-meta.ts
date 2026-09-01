import { profile } from '../src/data/profile.ts'

// User-confirmed production URL. Never infer it from request headers.
const productionUrl = 'https://weijianjunwjj.github.io/weijianjun-career/'
export function socialTags(env: Record<string, string | undefined>) {
  const configured = env.VITE_SITE_URL
  const raw = configured || productionUrl
  const url = new URL(raw)
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error('Public site URL must use HTTPS and contain no credentials, query or hash.')
  }
  if (!url.pathname.endsWith('/')) url.pathname += '/'
  const siteUrl = url.href
  const { title, description } = profile.meta
  return [
    { tag: 'title', children: title },
    { tag: 'meta', attrs: { name: 'description', content: description } },
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { tag: 'meta', attrs: { property: 'og:locale', content: 'zh_CN' } },
    { tag: 'meta', attrs: { property: 'og:title', content: title } },
    { tag: 'meta', attrs: { property: 'og:description', content: description } },
    { tag: 'meta', attrs: { property: 'og:url', content: siteUrl } },
    { tag: 'meta', attrs: { property: 'og:image', content: new URL('og.png', siteUrl).href } },
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
    { tag: 'meta', attrs: { name: 'twitter:image', content: new URL('og.png', siteUrl).href } },
    {
      tag: 'meta',
      attrs: { name: 'twitter:image:alt', content: 'BUILD BEYOND FRONTEND. / WEI JIANJUN' },
    },
    { tag: 'link', attrs: { rel: 'canonical', href: siteUrl } },
  ]
}
