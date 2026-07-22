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
  await expect(page.getByTestId('quote-MT-10482')).toBeVisible()

  // Open the offer modal for the first task and submit a valid offer.
  await page.getByTestId('quote-MT-10482').click()
  const modal = page.getByTestId('offer-modal')
  await expect(modal).toBeVisible()
  await page.getByTestId('offer-price').fill('4500')
  await page.getByTestId('offer-brand').fill('Hepu')
  await page.getByTestId('offer-country').selectOption('ألمانيا')
  await page.getByTestId('offer-agree').check()
  await page.getByTestId('offer-submit').click()

  // Submit shows the "what happens next" confirmation; closing it flips the card.
  await expect(page.getByRole('heading', { name: 'تم إرسال عرضك' })).toBeVisible()
  await page.getByTestId('offer-done').click()
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

test('brand filter narrows the queue and can empty it', async ({ page }) => {
  await page.goto('/')
  await page.getByPlaceholder('vendeur@mtauto.cloud').fill('owner@alamine-parts.dz')
  await page.getByTestId('send-code').click()
  for (let i = 0; i < 6; i++) await page.getByTestId(`otp-${i}`).fill('1')
  await page.getByTestId('verify').click()
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()

  // No filter → the Volkswagen (German) request is present.
  await expect(page.getByTestId('quote-MT-10482')).toBeVisible()

  // Filter to Renault → only the Renault request remains in the grid.
  await page.getByTestId('brand-filter').click()
  await page.getByTestId('brand-opt-Renault').click()
  await expect(page.getByTestId('brand-filter-count')).toHaveText('1')
  await expect(page.getByTestId('quote-MT-10495')).toBeVisible()
  await expect(page.getByTestId('quote-MT-10482')).toHaveCount(0)

  // Clear → all requests return.
  await page.getByTestId('brand-filter-clear').click()
  await expect(page.getByTestId('quote-MT-10482')).toBeVisible()

  // A brand with no open requests → filter-specific empty state.
  await page.getByTestId('brand-opt-Toyota').click()
  await expect(page.getByTestId('queue-empty')).toBeVisible()
})

test('queue shows the sponsored right rail', async ({ page }) => {
  await page.goto('/')
  await page.getByPlaceholder('vendeur@mtauto.cloud').fill('owner@alamine-parts.dz')
  await page.getByTestId('send-code').click()
  for (let i = 0; i < 6; i++) await page.getByTestId(`otp-${i}`).fill('1')
  await page.getByTestId('verify').click()
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()

  await expect(page.locator('.rail-spon')).toHaveText('مموّل')
  await expect(page.getByTestId('ad-carousel')).toBeVisible()
})

// ---- عروضي (My Offers) ------------------------------------------------------

async function openMyOffers(page) {
  await page.goto('/')
  await page.getByPlaceholder('vendeur@mtauto.cloud').fill('owner@alamine-parts.dz')
  await page.getByTestId('send-code').click()
  for (let i = 0; i < 6; i++) await page.getByTestId(`otp-${i}`).fill('1')
  await page.getByTestId('verify').click()
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()
  await page.getByTestId('nav-quotes').click()
  await expect(page.getByRole('heading', { name: 'عروضي' })).toBeVisible()
}

test('my offers: won banner, stat tiles, grouped table and status badges', async ({ page }) => {
  await openMyOffers(page)

  // Won banner shows the confirmed (video-done) offer with its net receipt.
  const banner = page.getByTestId('won-banner')
  await expect(banner).toBeVisible()
  await expect(banner).toContainText('تم تأكيد الطلب')
  await expect(banner).toContainText('رادياتير مكيّف')

  // Tiles derive from the same offers list: 1 video / 4 review / 1 won.
  await expect(page.getByTestId('stat-video')).toContainText('1')
  await expect(page.getByTestId('stat-review')).toContainText('4')
  await expect(page.getByTestId('stat-won')).toContainText('1')

  // Two brand-offers on MT-10501 → group count pill + add-brand affordance.
  await expect(page.getByTestId('group-count-MT-10501')).toHaveText('عرضان')
  await expect(page.getByTestId('add-brand-MT-10501')).toBeVisible()

  // Status → badge/action matrix.
  await expect(page.getByTestId('status-of_3')).toContainText('مطلوب فيديو')
  await expect(page.getByTestId('film-of_3')).toBeVisible() // amber film CTA
  await expect(page.getByTestId('status-of_q1')).toContainText('قيد المراجعة')
  await expect(page.getByTestId('withdraw-of_q1')).toBeVisible()
  await expect(page.getByTestId('status-of_lost')).toContainText('لم يُختَر')
})

test('my offers: summary strips match format.js commission tiers (10% / 6%)', async ({ page }) => {
  await openMyOffers(page)

  // ≤ 50 000 دج → 10%: 1 800 − 180 = 1 620.
  const s10 = page.getByTestId('summary-of_1')
  await expect(s10).toContainText('10%')
  await expect(s10).toContainText('180 دج')
  await expect(s10).toContainText('1 620 دج')

  // > 50 000 دج → 6%: 62 000 − 3 720 = 58 280.
  const s6 = page.getByTestId('summary-of_won2')
  await expect(s6).toContainText('6%')
  await expect(s6).toContainText('3 720 دج')
  await expect(s6).toContainText('58 280 دج')
})

test('my offers: prep toggle flips and add-brand grows the group', async ({ page }) => {
  await openMyOffers(page)

  // Prep/deliver toggle on the won offer's row.
  const toggle = page.getByTestId('deliver-of_won2')
  await expect(toggle).toContainText('أكّد التسليم')
  await toggle.click()
  await expect(toggle).toContainText('تم التسليم')

  // "+ عرض لعلامة أخرى" reopens the offer modal for MT-10501 and appends.
  await page.getByTestId('add-brand-MT-10501').click()
  await expect(page.getByTestId('offer-modal')).toBeVisible()
  await page.getByTestId('offer-price').fill('6100')
  await page.getByTestId('offer-brand').fill('Sachs')
  await page.getByTestId('offer-country').selectOption('ألمانيا')
  await page.getByTestId('offer-agree').check()
  await page.getByTestId('offer-submit').click()
  await expect(page.getByRole('heading', { name: 'تم إرسال عرضك' })).toBeVisible()
  await page.getByTestId('offer-done').click()
  await expect(page.getByTestId('group-count-MT-10501')).toHaveText('3 عروض')
})

test('my offers: withdraw free vs late strikes, 3rd late locks pricing', async ({ page }) => {
  await openMyOffers(page)

  // of_1 is inside the 15-min window → free withdrawal, no counter bump.
  await page.getByTestId('withdraw-of_1').click()
  await expect(page.getByTestId('withdraw-modal')).toContainText('نافذة التصحيح')
  await page.getByTestId('withdraw-confirm').click()
  await expect(page.getByTestId('status-of_1')).toContainText('مسحوب')

  // of_2 is late (seed warns=1 → this is strike #2) → amber warning copy.
  await page.getByTestId('withdraw-of_2').click()
  await expect(page.getByTestId('withdraw-modal')).toContainText('ثاني عملية سحب')
  await page.getByTestId('withdraw-confirm').click()
  await expect(page.getByTestId('status-of_2')).toContainText('مسحوب')

  // of_q2 is late → strike #3 → red final copy, then pricing locks (R2).
  await page.getByTestId('withdraw-of_q2').click()
  await expect(page.getByTestId('withdraw-modal')).toContainText('ثالث عملية سحب')
  await page.getByTestId('withdraw-confirm').click()

  // Remaining submitted rows lose their withdraw button → "التسعير موقوف".
  await expect(page.getByTestId('status-of_q1')).toContainText('قيد المراجعة')
  await expect(page.getByTestId('withdraw-of_q1')).toHaveCount(0)
  await expect(page.getByText('التسعير موقوف مؤقتاً', { exact: false })).toBeVisible() // R2Banner
})
