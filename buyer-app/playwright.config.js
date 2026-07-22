import { defineConfig, devices } from '@playwright/test'

// Smoke-test config. Builds + serves the app on 4173, then runs e2e/.
// Locally: run `npm run test:e2e:install` once to fetch Chromium. In managed
// environments a system Chromium can be supplied via CHROMIUM_PATH instead.
const executablePath = process.env.CHROMIUM_PATH || undefined

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    locale: 'ar',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: { executablePath } } },
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
