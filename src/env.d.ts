/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_OPENROUTER_API_KEY: string;
  readonly PUBLIC_WEBSITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}