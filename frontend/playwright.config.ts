import { defineConfig, devices } from '@playwright/test';

// The smoke test runs the built frontend against a real FastAPI process.
const baseURL = 'http://127.0.0.1:4173';
const backendCommand =
  process.env.E2E_BACKEND_COMMAND ?? 'python -m uvicorn app.main:app --port 8000';
// Optional: use a pre-installed Chromium instead of the one Playwright downloads.
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL, trace: 'on-first-retry' },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(chromiumPath ? { launchOptions: { executablePath: chromiumPath } } : {}),
      },
    },
  ],
  webServer: [
    {
      command: backendCommand,
      cwd: '../backend',
      url: 'http://127.0.0.1:8000/health',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
