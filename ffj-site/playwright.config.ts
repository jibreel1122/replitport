import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 0,
  use: { baseURL: 'http://localhost:3000' },
  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } }
  ]
})