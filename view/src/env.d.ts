/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_friendLink: string
  readonly VITE_author: string
  readonly VITE_record: string
  readonly VITE_record_link: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
