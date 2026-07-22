import { test, expect } from '@playwright/test'
import { reachPartStep } from './helpers.js'

// Area 4 — Part step (2 assertions). Name the part + attach a photo.
test.describe.configure({ mode: 'serial' })

let page
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await reachPartStep(page)
})
test.afterAll(async () => { await page.close() })

test('adding a photo renders a removable thumb', async () => {
  await page.fill('.form-card input.inp >> nth=0', 'Disque de frein avant')
  await page.click('button[aria-label="أضف صورة"]')
  await expect(page.locator('button[aria-label="حذف"]')).toHaveCount(1)
})

test('continue enables once a part name exists', async () => {
  await expect(page.locator('button:has-text("تابع — الإرسال والتأكيد")')).toBeEnabled()
})
