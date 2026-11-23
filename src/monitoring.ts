import * as Sentry from '@sentry/vue'
import type { App } from 'vue'

// The DSN only identifies where to send events; it is safe to ship to browsers.
const dsn =
  'https://7ba96774d71f6793a1324c2e84b0c770@o4512292915511296.ingest.us.sentry.io/4512292959354880'

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

export function isLoopbackHost(hostname: string): boolean {
  return LOOPBACK_HOSTS.has(hostname.toLowerCase())
}

export function setupMonitoring(app: App) {
  const isProdRemote = import.meta.env.PROD && !isLoopbackHost(window.location.hostname)

  Sentry.init({
    app,
    dsn,
    enabled: isProdRemote,
    environment: isProdRemote ? 'production' : 'development',
    release: __COMMIT_SHA__,
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      urlQueryParams: false,
      httpBodies: [],
    },
  })

  recoverFromStaleChunks()

  if (location.hash === '#sentry-test') {
    setTimeout(triggerTestError, 0)
  }
}

const RELOAD_KEY = 'stale-chunk-reload-at'
const RELOAD_GUARD_MS = 30_000

function recoverFromStaleChunks() {
  window.addEventListener('vite:preloadError', (event) => {
    Sentry.captureException(event.payload, { tags: { kind: 'stale-chunk' } })

    let lastReload = 0
    try {
      lastReload = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0)
    } catch {
      // Storage unavailable
    }
    if (Date.now() - lastReload < RELOAD_GUARD_MS) return

    event.preventDefault()
    try {
      sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
    } catch {
      return
    }
    void Sentry.flush(2000).finally(() => location.reload())
  })
}

export function triggerTestError(): never {
  throw new Error('Sentry drill: this error should map back to src/monitoring.ts')
}
