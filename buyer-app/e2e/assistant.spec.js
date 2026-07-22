import { test, expect } from '@playwright/test'

// Area 8 — الميسر assistant (3 assertions). Mocked chat replies.
// The FAB is rendered globally, so no login is needed to reach it.
test.describe.configure({ mode: 'serial' })

let page
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.click('.mysr-fab')
  await page.waitForSelector('.mysr-panel')
})
test.afterAll(async () => { await page.close() })

test('the panel opens with a welcome message', async () => {
  await expect(page.locator('.mysr-b.a').first()).toContainText('الميسر')
})

test('there are 4 suggestion chips', async () => {
  await expect(page.locator('.mysr-chip')).toHaveCount(4)
})

test('a mock reply about «دليل القطعة» comes back', async () => {
  await page.click('.mysr-chip >> nth=1') // ما معنى «دليل القطعة»؟
  await page.waitForFunction(
    () => document.querySelectorAll('.mysr-b.a:not(.mysr-dots)').length >= 2,
    null,
    { timeout: 5000 },
  )
  await expect(page.locator('.mysr-b.a:not(.mysr-dots)').last()).toContainText('دليل القطعة')
})
