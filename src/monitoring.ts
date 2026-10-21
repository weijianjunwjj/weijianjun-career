import * as Sentry from '@sentry/vue'
import type { App } from 'vue'

// The DSN only identifies where to send events; it is safe to ship to browsers.
const dsn =
  'https://7ba96774d71f6793a1324c2e84b0c770@o4512292915511296.ingest.us.sentry.io/4512292959354880'

export function setupMonitoring(app: App) {
  Sentry.init({
    app,
    dsn,
    // Only the production build reports; local dev stays quiet.
    enabled: import.meta.env.PROD,
    environment: import.meta.env.PROD ? 'production' : 'development',
    // Same commit as /version.json, so every event points at the exact build.
    release: __COMMIT_SHA__,
    // Error monitoring only: no user info, cookies, headers, query strings or bodies.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      urlQueryParams: false,
      httpBodies: [],
    },
  })

  recoverFromStaleChunks()

  // Drill hook: visit https://weijianjun.me/#sentry-test to send one test error.
  if (location.hash === '#sentry-test') {
    setTimeout(triggerTestError, 0)
  }
}

// A deploy replaces every file, so a tab opened before it may ask for a chunk that no
// longer exists. Vite then fires `vite:preloadError`. Report it, then reload once to
// pick up the new version; the timestamp guard stops a reload loop if the new
// version is broken too.
const RELOAD_KEY = 'stale-chunk-reload-at'
const RELOAD_GUARD_MS = 30_000

function recoverFromStaleChunks() {
  window.addEventListener('vite:preloadError', (event) => {
    Sentry.captureException(event.payload, { tags: { kind: 'stale-chunk' } })

    let lastReload = 0
    try {
      lastReload = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0)
    } catch {
      // Storage can be unavailable (private mode); fall through without reloading twice.
    }
    if (Date.now() - lastReload < RELOAD_GUARD_MS) return

    event.preventDefault()
    try {
      sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
    } catch {
      return
    }
    // Give Sentry a moment to send the event before the page goes away.
    void Sentry.flush(2000).finally(() => location.reload())
  })
}

export function triggerTestError(): never {
  throw new Error('Sentry drill: this error should map back to src/monitoring.ts')
}
