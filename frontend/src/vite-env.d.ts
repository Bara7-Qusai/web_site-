/// <reference types="vite/client" />

// Only VITE_-prefixed variables reach the bundle, and everything there is public.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}
