/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ENV: string;
  // Add other variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
