export const env = {
  /** Empty means same-origin, which is how the backend is reached in dev, preview and production. */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
};
