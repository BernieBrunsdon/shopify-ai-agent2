/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SHOPIFY_STORE: string;
    readonly VITE_SHOPIFY_CLIENT_ID: string;
    readonly VITE_SHOPIFY_CLIENT_SECRET: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }