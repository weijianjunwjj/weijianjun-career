import { createApp, createSSRApp, type App as VueApp } from 'vue'
import App from './App.vue'
import { installStaleChunkReload } from './staleChunkReload.ts'
import './style.css'

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function scheduleMonitoring(app: VueApp) {
  if (!isBrowser()) return

  const load = () => {
    void import('./monitoring').then(({ setupMonitoring }) => {
      setupMonitoring(app)
    })
  }

  if (window.location.hash === '#sentry-test') {
    load()
    return
  }

  const ric = window.requestIdleCallback
  if (typeof ric === 'function') {
    ric(() => load(), { timeout: 2500 })
  } else {
    window.setTimeout(load, 1500)
  }
}

if (isBrowser()) {
  installStaleChunkReload()
}

const el = isBrowser() ? document.querySelector('#app') : null
const hasSSRMarkup = Boolean(el && el.firstElementChild)
const app = hasSSRMarkup ? createSSRApp(App) : createApp(App)
app.mount('#app')
scheduleMonitoring(app)

if (isBrowser()) {
  void import('./shared/visitorWidget.ts').then(({ setupVisitorWidget }) => {
    setupVisitorWidget({ site: 'main' })
  })
}
