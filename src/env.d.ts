/// <reference types="vite/client" />

// Injected by vite.config.ts at build time: the commit SHA of this build.
declare const __COMMIT_SHA__: string

interface ImportMetaEnv {
  readonly VITE_BAIDU_HM_ID_MAIN?: string
  readonly VITE_BAIDU_HM_ID_WORK?: string
}
