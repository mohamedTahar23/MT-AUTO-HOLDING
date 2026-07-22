import { test, expect } from '@playwright/test'

// Area 1 — Landing (5 assertions). The marketing front-door, logged out.
test.describe.configure({ mode: 'serial' })

let page
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await page.goto('/', { waitUntil: 'networkidle' })
})
test.afterAll(async () => { await page.close() })

test('RTL direction is set', async () => {
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
})

test('hero headline is visible', async () => {
  await expect(page.locator('.req-hero h1')).toBeVisible()
})

test('login card is visible when logged out', async () => {
  await expect(page.locator('#account .form-card')).toBeVisible()
})

test('how-it-works has exactly 4 steps', async () => {
  await expect(page.locator('#how .how-step')).toHaveCount(4)
})

test('FAQ has exactly 6 items', async () => {
  await expect(page.locator('#faq details.qa')).toHaveCount(6)
})
