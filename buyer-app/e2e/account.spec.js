import { test, expect } from '@playwright/test'
import { login } from './helpers.js'

// Area 7 — Account (3 assertions). Account modal + edit-profile modal.
test.describe.configure({ mode: 'serial' })

let page
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await login(page)
  await page.click('.acct-chip')
  await page.waitForSelector('.modal.open h3:has-text("حسابي")')
})
test.afterAll(async () => { await page.close() })

test('the account modal shows the name', async () => {
  await expect(page.locator('.modal.open')).toContainText('كريم بن عيسى')
})

test('the account modal shows the saved vehicles', async () => {
  const modal = page.locator('.modal.open')
  await expect(modal).toContainText('Picanto')
  await expect(modal).toContainText('Rio')
})

test('edit-profile has the phone field disabled', async () => {
  await page.click('.modal.open button:has-text("تعديل")')
  await page.waitForSelector('.modal.open h3:has-text("تعديل بياناتي")')
  await expect(page.locator('.modal.open input[disabled]')).toBeVisible()
})
