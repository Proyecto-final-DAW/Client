/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOCAL_API_BASE_URL: string;
  readonly VITE_PROD_API_BASE_URL: string;
  readonly VITE_USE_LOCAL_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
