// Build-time origin only. Never infer a public origin from browser/request headers.
export function socialTags(env: Record<string, string | undefined>) {
  const configured = env.VITE_SITE_URL
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL
  const raw = configured || (vercel ? `https://${vercel}` : undefined)
  if (!raw) return []
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
  const tags = [
    { tag: 'meta', attrs: { property: 'og:url', content: `${origin}/` } },
    { tag: 'meta', attrs: { property: 'og:image', content: `${origin}/og.png` } },
    {
      tag: 'meta',
      attrs: {
        property: 'og:image:alt',
        content: '魏建军 · Frontend & AI Engineering · Vue / TypeScript · AI Agent',
      },
    },
    { tag: 'meta', attrs: { name: 'twitter:image', content: `${origin}/og.png` } },
    {
      tag: 'meta',
      attrs: { name: 'twitter:image:alt', content: '魏建军 · Frontend & AI Engineering' },
    },
  ]
  // Canonical is intentionally omitted until a permanent domain is explicitly set.
  return configured
    ? [...tags, { tag: 'link', attrs: { rel: 'canonical', href: `${origin}/` } }]
    : tags
}
