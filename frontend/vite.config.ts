import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// The browser calls the backend through same-origin paths; in dev and preview Vite forwards
// them to the FastAPI server, so no CORS configuration is needed. The target is not bundled.
const backendTarget = process.env.VITE_API_PROXY_TARGET ?? 'http://127.0.0.1:8000';
const proxy = {
  '/health': backendTarget,
  '/api': backendTarget,
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { proxy },
  preview: { proxy },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
});
