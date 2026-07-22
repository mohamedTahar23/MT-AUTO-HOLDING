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

test('landing shows every design section top to bottom', async ({ page }) => {
  await page.goto('/')

  // §1 header: FR/AR language toggle — AR active, FR honestly disabled («قريباً»).
  const toggle = page.getByRole('group', { name: 'اللغة' })
  await expect(toggle.getByRole('button', { name: 'AR' })).toBeVisible()
  await expect(toggle.getByRole('button', { name: 'FR' })).toBeVisible()
  await expect(toggle.getByRole('button', { name: 'FR' })).toBeDisabled()
  await expect(toggle.getByText('قريباً')).toBeVisible()

  // §2 hero: example pricing card figures.
  await expect(page.getByText('Alternateur — Hyundai i10 2016')).toBeVisible()
  await expect(page.getByText('MT-14902')).toBeVisible()
  await expect(page.getByText('16,650')).toBeVisible()

  // §3 the نحن / أنت / 10% band.
  await expect(page.getByText('من يحدّد السعر.')).toBeVisible()

  // §4 كيف يعمل (4 numbered cards).
  await expect(page.getByText('إذا توفّرت لديك القطعة قدّم عرضك.')).toBeVisible()

  // §5 فريق المحل: employee invitation.
  await expect(page.getByRole('heading', { name: /أضِف موظفيك لتقديم العروض مكانك/ })).toBeVisible()
  await expect(page.getByText('yacine@atlas-pieces.dz')).toBeVisible()
  await expect(page.getByText('samir@atlas-pieces.dz')).toBeVisible()
  await expect(page.getByText('٣ موظفين')).toBeVisible()
  await expect(page.getByRole('button', { name: '+ دعوة موظف' })).toBeVisible()

  // §6 سوق الجملة: قريباً + the search-engine example.
  await expect(page.getByRole('heading', { name: 'اشترِ بسعر الجملة الحقيقي.' })).toBeVisible()
  await expect(page.locator('#wholesale').getByText('قريباً', { exact: true })).toBeVisible()
  await expect(page.getByText('Tendeur de chaîne')).toBeVisible()
  await expect(page.getByText('Mobis')).toBeVisible()
  await expect(page.getByText('KFM')).toBeVisible()

  // §7 sign-in: Google + «أو» divider + email form.
  await expect(page.getByTestId('google-signin')).toBeVisible()
  await expect(page.getByText('أو', { exact: true })).toBeVisible()
  await expect(page.getByPlaceholder('vendeur@mtauto.cloud')).toBeVisible()

  // §8 contact.
  await expect(page.getByText('الحجّار، ولاية عنابة — «محل محمد الطاهر لبيع قطع غيار السيارات»')).toBeVisible()
  await expect(page.getByText('0659 40 13 38')).toBeVisible()
  await expect(page.getByRole('link', { name: 'احصل على الاتجاهات' })).toBeVisible()

  // §9 footer: تابعنا + the five social links.
  await expect(page.getByRole('heading', { name: 'تابعنا' })).toBeVisible()
  for (const s of ['واتساب', 'اليوتيوب', 'تيك توك', 'إنستغرام', 'فيسبوك']) {
    await expect(page.locator('.land-social').getByRole('link', { name: s })).toBeVisible()
  }
})

test('متابعة عبر Google signs into the demo shop', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('google-signin').click()
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()
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

test('valid email advances to the OTP screen (send-code → أدخل رمز الدخول)', async ({ page }) => {
  await page.goto('/')

  // The reported bug: clicking "إرسال رمز الدخول" must reveal the 6-box OTP screen.
  await page.getByPlaceholder('vendeur@mtauto.cloud').fill('owner@alamine-parts.dz')
  await page.getByTestId('send-code').click()

  await expect(page.getByRole('heading', { name: 'أدخل رمز الدخول' })).toBeVisible()
  await expect(page.getByTestId('otp-0')).toBeVisible()
  await expect(page.getByTestId('verify')).toContainText('تأكيد ودخول')
  await expect(page.getByTestId('resend-timer')).toBeVisible() // resend countdown
})

test('malformed email shows an inline error and stays on login', async ({ page }) => {
  await page.goto('/')
  await page.getByPlaceholder('vendeur@mtauto.cloud').fill('not-an-email')
  await page.getByTestId('send-code').click()

  await expect(page.getByText('الرجاء إدخال بريد إلكتروني صحيح')).toBeVisible()
  await expect(page.getByTestId('otp-0')).toBeHidden() // never left the login step
})

test('unregistered email → OTP → join request form', async ({ page }) => {
  await page.goto('/')

  // Any valid but unregistered email now reaches the OTP screen (the fix),
  // then routes to the "طلب الانضمام" form once the code is confirmed.
  await page.getByPlaceholder('vendeur@mtauto.cloud').fill('newshop@example.com')
  await page.getByTestId('send-code').click()
  await expect(page.getByTestId('otp-0')).toBeVisible()

  for (let i = 0; i < 6; i++) await page.getByTestId(`otp-${i}`).fill(String((i + 1) % 10))
  await page.getByTestId('verify').click()
  await expect(page.getByRole('heading', { name: 'طلب الانضمام كبائع' })).toBeVisible()
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
