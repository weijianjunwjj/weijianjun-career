/// <reference types="vite/client" />

// Injected by vite.config.ts at build time: the commit SHA of this build.
declare const __COMMIT_SHA__: string

interface ImportMetaEnv {
  readonly VITE_TAWK_PROPERTY_ID?: string
  readonly VITE_TAWK_WIDGET_ID?: string
}
