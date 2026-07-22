import { test, expect } from '@playwright/test'
import { login } from './helpers.js'

// Area 3 — Vehicle step (2 assertions). First wizard step, saved car prefilled.
test.describe.configure({ mode: 'serial' })

let page
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await login(page)
})
test.afterAll(async () => { await page.close() })

test('saved vehicles are offered', async () => {
  await expect(page.locator('.oflow-inline button:has-text("Picanto")').first()).toBeVisible()
})

test('continue is enabled with the prefilled saved car', async () => {
  await expect(page.locator('button:has-text("تابع — تفاصيل القطعة")')).toBeEnabled()
})
