import { test, expect } from '@playwright/test'
import { reachDetailsStep } from './helpers.js'

// Area 5 — Details + submit (6 assertions). Summary, prefilled profile, geo,
// terms gate, confirmation with an order number.
test.describe.configure({ mode: 'serial' })

let page
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await reachDetailsStep(page)
})
test.afterAll(async () => { await page.close() })

test('summary shows the chosen car', async () => {
  await expect(page.locator('.oflow-inline')).toContainText('كيا Picanto 2018')
})

test('summary shows the chosen part', async () => {
  await expect(page.locator('.oflow-inline')).toContainText('Disque de frein avant')
})

test('first name is prefilled from the logged-in profile', async () => {
  await expect(page.locator('.form-card input.inp').first()).toHaveValue('كريم')
})

test('review enables after geo-detect', async () => {
  await page.click('button:has-text("حدّد موقعي")')
  await page.waitForFunction(() => document.body.textContent.includes('تم تحديد موقعك'))
  await expect(page.locator('button:has-text("مراجعة الطلب وإرساله")')).toBeEnabled()
})

test('the terms modal opens as the submit gate', async () => {
  await page.click('button:has-text("مراجعة الطلب وإرساله")')
  await page.waitForSelector('.modal.open')
  await expect(page.locator('.modal.open h3:has-text("الشروط")')).toBeVisible()
})

test('submitting yields an MT-#### order number', async () => {
  await page.click('.modal.open button:has-text("قرأتُ وأوافق")')
  await page.waitForSelector('h2.oflow-title:has-text("تم استلام طلبك")')
  const orderNum = ((await page.locator('bdi.num[dir=ltr]').first().textContent()) || '').trim()
  expect(orderNum).toMatch(/^MT-\d{4}$/)
})
