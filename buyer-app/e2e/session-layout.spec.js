import { test, expect } from '@playwright/test'
import { reachHub, attachErrorCollector } from './helpers.js'

// Area 9 — Session + layout (3 assertions). Logout, mobile overflow, and the
// whole-journey "no console/page errors" invariant. The error collector is
// attached before navigation and the full happy path is driven in beforeAll so
// errors from every surface (landing → wizard → submit → hub → journey →
// account → assistant) are captured, exactly as the original single-pass test.
test.describe.configure({ mode: 'serial' })

let page
let errors
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  errors = attachErrorCollector(page)

  // Landing → login → wizard → submit → orders hub.
  await reachHub(page)

  // Journey stub tracker, then back out of the hub.
  await page.locator('.hub-orders > div').first().locator('[role=button]').click()
  await page.waitForSelector('.track')
  await page.click('button:has-text("كل الطلبات")')
  await page.click('.hub-back')

  // Account modal + edit-profile.
  await page.click('.acct-chip')
  await page.waitForSelector('.modal.open h3:has-text("حسابي")')
  await page.click('.modal.open button:has-text("تعديل")')
  await page.waitForSelector('.modal.open h3:has-text("تعديل بياناتي")')
  await page.click('.modal.open button:has-text("حفظ التغييرات")')
  await page.waitForSelector('.modal.open h3:has-text("حسابي")')
  await page.click('.modal.open .x')

  // الميسر assistant.
  await page.click('.mysr-fab')
  await page.waitForSelector('.mysr-panel')
  await page.click('.mysr-chip >> nth=1')
  await page.waitForFunction(
    () => document.querySelectorAll('.mysr-b.a:not(.mysr-dots)').length >= 2,
    null,
    { timeout: 5000 },
  )
  await page.click('.mysr-panel button[aria-label="إغلاق"]')
})
test.afterAll(async () => { await page.close() })

test('logout returns to the login card', async () => {
  await page.click('.acct-chip')
  await page.click('.modal.open button:has-text("تسجيل الخروج")')
  await page.waitForSelector('#lg_phone')
  await expect(page.locator('#lg_phone')).toBeVisible()
})

test('no horizontal overflow on mobile', async () => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(300)
  const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= 391)
  expect(noOverflow).toBe(true)
})

test('no console or page errors across the journey', async () => {
  expect(errors).toEqual([])
})
