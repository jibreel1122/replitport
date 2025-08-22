import { test, expect } from '@playwright/test'

test('home renders in EN and AR', async ({ page }) => {
  await page.goto('/en')
  await expect(page.locator('h1')).toBeVisible()
  await page.goto('/ar')
  await expect(page.locator('h1')).toBeVisible()
})