// Node loads these data modules in content tests; browser builds use Vite's resolved base.
const baseUrl = typeof document === 'undefined' ? '/' : import.meta.env.BASE_URL

export function publicAsset(path: string) {
  return `${baseUrl}${path.replace(/^\/+/, '')}`
}
