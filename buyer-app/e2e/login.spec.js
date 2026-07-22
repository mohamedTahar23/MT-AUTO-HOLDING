import { test, expect } from '@playwright/test'

// Area 2 — Login (4 assertions). Phone → WhatsApp OTP (demo code) → account.
test.describe.configure({ mode: 'serial' })

let page
let demo = ''
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.fill('#lg_phone', '0659401338')
})
test.afterAll(async () => { await page.close() })

test('send-code button enables after a valid phone', async () => {
  await expect(page.locator('#account button:has-text("أرسِل رمز الدخول")')).toBeEnabled()
})

test('a 6-digit demo OTP code is shown', async () => {
  await page.click('#account button:has-text("أرسِل رمز الدخول")')
  await page.waitForSelector('.otp-block.on')
  demo = ((await page.locator('.otp-block b[dir=ltr]').textContent()) || '').trim()
  expect(demo).toMatch(/^\d{6}$/)
})

test('the wizard appears after verifying', async () => {
  await page.fill('.otp-block input.inp', demo)
  await page.click('button:has-text("دخول إلى حسابي")')
  await expect(page.locator('.oflow-steps')).toBeVisible()
})

test('the header gains «طلباتي» after login', async () => {
  await expect(page.locator('.hub-link')).toBeVisible()
})
