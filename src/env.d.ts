/// <reference types="vite/client" />

// Injected by vite.config.ts at build time: the commit SHA of this build.
declare const __COMMIT_SHA__: string

interface ImportMetaEnv {
  readonly VITE_POP800_JOB_NO?: string
  readonly VITE_POP800_UKEY?: string
}
