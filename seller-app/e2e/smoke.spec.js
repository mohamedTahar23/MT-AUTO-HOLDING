import { test, expect } from '@playwright/test'

// End-to-end smoke test of the core seller loop: it drives the app the way a
// shop would — sign in, land on the pricing queue, submit an offer through the
// modal — asserting the mocked backend and RTL UI are wired correctly.

test.beforeEach(async ({ context }) => {
  // Start each test signed out.
  await context.clearCookies()
})

test('landing gate renders in Arabic RTL', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.getByRole('heading', { name: 'زد مبيعاتك مع MT AUTO' })).toBeVisible()
  await expect(page.getByTestId('send-code')).toBeVisible()
})

test('sign in → pricing queue → submit an offer', async ({ page }) => {
  await page.goto('/')

  // Known account → OTP path.
  await page.getByPlaceholder('vendeur@mtauto.cloud').fill('owner@alamine-parts.dz')
  await page.getByTestId('send-code').click()

  // OTP: any 6 digits (demo 123456).
  for (let i = 0; i < 6; i++) await page.getByTestId(`otp-${i}`).fill(String((i + 1) % 10))
  await page.getByTestId('verify').click()

  // Land on the queue.
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()
  await expect(page.getByText('MT-10482')).toBeVisible()

  // Open the offer modal for the first task and submit a valid offer.
  await page.getByTestId('quote-MT-10482').click()
  const modal = page.getByTestId('offer-modal')
  await expect(modal).toBeVisible()
  await page.getByTestId('offer-price').fill('4500')
  await page.getByTestId('offer-brand').fill('Hepu')
  await page.getByTestId('offer-country').selectOption('ألمانيا')
  await page.getByTestId('offer-agree').check()
  await page.getByTestId('offer-submit').click()

  // Modal closes and the queue button flips to "submitted".
  await expect(modal).toBeHidden()
  await expect(page.getByTestId('quote-MT-10482')).toContainText('تم تقديم عرضك')
})

test('offer submit stays disabled until price/brand/country/agreement are valid', async ({ page }) => {
  await page.goto('/')
  await page.getByPlaceholder('vendeur@mtauto.cloud').fill('owner@alamine-parts.dz')
  await page.getByTestId('send-code').click()
  for (let i = 0; i < 6; i++) await page.getByTestId(`otp-${i}`).fill('1')
  await page.getByTestId('verify').click()

  await page.getByTestId('quote-MT-10488').click()
  const submit = page.getByTestId('offer-submit')
  await expect(submit).toBeDisabled() // empty form

  await page.getByTestId('offer-price').fill('12') // <3 digits
  await expect(submit).toBeDisabled()

  await page.getByTestId('offer-price').fill('3200')
  await page.getByTestId('offer-brand').fill('Bosch')
  await page.getByTestId('offer-country').selectOption('اليابان')
  await expect(submit).toBeDisabled() // still needs the commitment checkbox
  await page.getByTestId('offer-agree').check()
  await expect(submit).toBeEnabled()
})
