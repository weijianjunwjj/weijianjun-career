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

  // Drill hook: visit https://weijianjun.me/#sentry-test to send one test error.
  if (location.hash === '#sentry-test') {
    setTimeout(triggerTestError, 0)
  }
}

export function triggerTestError(): never {
  throw new Error('Sentry drill: this error should map back to src/monitoring.ts')
}
