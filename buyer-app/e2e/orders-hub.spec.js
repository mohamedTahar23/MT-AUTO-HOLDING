import { test, expect } from '@playwright/test'
import { reachHub } from './helpers.js'

// Area 6 — Orders hub «طلباتي» (3 assertions). New order on top, journey stub.
test.describe.configure({ mode: 'serial' })

let page
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await reachHub(page)
})
test.afterAll(async () => { await page.close() })

test('the hub shows 3 orders', async () => {
  await expect(page.locator('.hub-orders > div')).toHaveCount(3)
})

test('the new order is first with a sourcing chip', async () => {
  await expect(page.locator('.hub-orders > div').first()).toContainText('قيد المطابقة')
})

test('the journey stub tracker renders', async () => {
  await page.locator('.hub-orders > div').first().locator('[role=button]').click()
  await page.waitForSelector('.track')
  await expect(page.locator('.tk.cur')).toBeVisible()
})
