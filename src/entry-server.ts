import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'

function assertIsolatedFromBrowser() {
  const g = globalThis as typeof globalThis & {
    window?: unknown
    document?: unknown
    matchMedia?: unknown
  }
  if (typeof g.window !== 'undefined' && g.window) {
    throw new Error('SSR isolate: window must be absent')
  }
  if (typeof g.document !== 'undefined') {
    throw new Error('SSR isolate: document must be absent')
  }
  if (typeof g.matchMedia === 'function') {
    throw new Error('SSR isolate: matchMedia must be absent')
  }
}

export async function render() {
  assertIsolatedFromBrowser()
  const app = createSSRApp(App)
  return renderToString(app)
}
