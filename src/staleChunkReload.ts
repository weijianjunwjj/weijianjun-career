const RELOAD_KEY = 'stale-chunk-reload-at'
const RELOAD_GUARD_MS = 30_000

/** 入口常驻的轻量兜底：不依赖 Sentry，避免把 @sentry/vue 打进主包。 */
export function installStaleChunkReload() {
  if (typeof window === 'undefined') return

  window.addEventListener('vite:preloadError', (event) => {
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
    location.reload()
  })
}
