interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_WS_URL?: string
  readonly VITE_DEFAULT_LOCALE?: string
  readonly VITE_META_APP_ID?: string
  readonly VITE_META_REDIRECT_URI?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
