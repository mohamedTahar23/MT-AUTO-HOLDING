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
  await expect(banner).toContainText('Radiateur de climatisation')

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

// ---- التسليمات (Deliveries) -------------------------------------------------

async function openDeliveries(page, email = 'owner@alamine-parts.dz') {
  await page.goto('/')
  await page.getByPlaceholder('vendeur@mtauto.cloud').fill(email)
  await page.getByTestId('send-code').click()
  for (let i = 0; i < 6; i++) await page.getByTestId(`otp-${i}`).fill('1')
  await page.getByTestId('verify').click()
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()
  await page.getByTestId('nav-deliveries').click()
  await expect(page.getByRole('heading', { name: 'التسليمات' })).toBeVisible()
}

test('deliveries: a status pill of every kind renders', async ({ page }) => {
  await openDeliveries(page)

  // Derived from stage (video → pack) — the only action-needed (amber) pill.
  const pack = page.getByTestId('status-MT-10459')
  await expect(pack).toHaveText('بانتظار التسليم')
  await expect(pack).toHaveClass(/pill-amber/)

  // Stored delivery statuses — all neutral pills.
  await expect(page.getByTestId('status-MT-4741')).toHaveText('سُلّمت للشركة')
  await expect(page.getByTestId('status-MT-4719')).toHaveText('في الطريق')
  await expect(page.getByTestId('status-MT-4702')).toHaveText('في المعاينة')
  await expect(page.getByTestId('status-MT-4726')).toHaveText('قيد النزاع')
  await expect(page.getByTestId('status-MT-10405')).toHaveText('مدفوع')
  await expect(page.getByTestId('status-MT-4726')).toHaveClass(/pill-grey/)
})

test('deliveries: progress fill grows picked → transit → delivered → paid', async ({ page }) => {
  await openDeliveries(page)

  const fillPct = async (id) => {
    const style = await page.getByTestId(`delivery-${id}`).locator('.dtrack-fill').getAttribute('style')
    return parseInt(style.match(/width:\s*(\d+)%/)[1], 10)
  }
  const widths = [await fillPct('MT-4741'), await fillPct('MT-4719'), await fillPct('MT-4702'), await fillPct('MT-10405')]
  expect(widths).toEqual([0, 33, 67, 100])
})

test('deliveries: dispute panel — owner gets the WhatsApp CTA', async ({ page }) => {
  await openDeliveries(page)

  const dispute = page.getByTestId('dispute-MT-4726')
  await expect(dispute).toContainText('النزاع يُحلّ عبر واتساب')
  const wa = page.getByTestId('dispute-wa-MT-4726')
  await expect(wa).toBeVisible()
  await expect(wa).toHaveAttribute('href', /wa\.me\/213659401338/)

  // The dispute panel only exists on the disputed card.
  await expect(page.getByTestId('dispute-MT-4719')).toHaveCount(0)
})

test('deliveries: dispute panel — staff sees the in-platform text, no link', async ({ page }) => {
  await openDeliveries(page, 'samir@alamine-parts.dz')

  const dispute = page.getByTestId('dispute-MT-4726')
  await expect(dispute).toContainText('يُحلّ النزاع داخل المنصة')
  await expect(page.getByTestId('dispute-wa-MT-4726')).toHaveCount(0)

  // Everything else is identical to the owner view — same tracker + pill.
  await expect(page.getByTestId('status-MT-4726')).toHaveText('قيد النزاع')
})

// ---- الأرباح (Earnings) -----------------------------------------------------

async function openPayouts(page) {
  await page.goto('/')
  await page.getByPlaceholder('vendeur@mtauto.cloud').fill('owner@alamine-parts.dz')
  await page.getByTestId('send-code').click()
  for (let i = 0; i < 6; i++) await page.getByTestId(`otp-${i}`).fill('1')
  await page.getByTestId('verify').click()
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()
  await page.getByTestId('nav-payouts').click()
  await expect(page.getByRole('heading', { name: 'الأرباح' })).toBeVisible()
}

test('earnings: totals, a pill of every kind, and no dispute rows', async ({ page }) => {
  await openPayouts(page)

  // Seed totals: pending = every non-dispute amount (nothing confirmed yet),
  // received = the lifetime baseline.
  await expect(page.getByTestId('pending-total')).toContainText('36 700')
  await expect(page.getByTestId('received-total')).toContainText('494 700')

  // Status → pill matrix (delivered/collected neutral, paid green).
  const delivered = page.getByTestId('status-MT-4702')
  await expect(delivered).toHaveText('بانتظار التحصيل')
  await expect(delivered).toHaveClass(/pill-grey/)
  await expect(page.getByTestId('status-MT-4695')).toHaveText('تم التحصيل')
  const paid = page.getByTestId('status-MT-4676')
  await expect(paid).toHaveText('مدفوع')
  await expect(paid).toHaveClass(/pill-green/)

  // The disputed order's money is frozen under التسليمات — never listed here.
  await expect(page.getByTestId('payout-MT-4726')).toHaveCount(0)
})

test('earnings: tracker fill follows delivered → collected → paid', async ({ page }) => {
  await openPayouts(page)

  const fillPct = async (ref) => {
    const style = await page.getByTestId(`payout-${ref}`).locator('.dtrack-fill').getAttribute('style')
    return parseInt(style.match(/width:\s*(\d+)%/)[1], 10)
  }
  const widths = [await fillPct('MT-4702'), await fillPct('MT-4695'), await fillPct('MT-4676')]
  expect(widths).toEqual([0, 50, 100])
})

test('earnings: confirming receipt flips the toggle and moves the amount', async ({ page }) => {
  await openPayouts(page)

  // Paid card starts unconfirmed → amber ask.
  const toggle = page.getByTestId('receipt-toggle-MT-4676')
  await expect(toggle).toContainText('أكّد استلام دفعتك')

  // Click opens the receipt-confirm modal; confirming flips the switch.
  await toggle.click()
  await expect(page.getByTestId('receipt-modal')).toBeVisible()
  await page.getByTestId('receipt-confirm').click()
  await expect(toggle).toContainText('تم تأكيد الاستلام')
  await expect(toggle).toHaveClass(/on/)

  // 14 000 دج moved out of pending and into received — live, no reload.
  await expect(page.getByTestId('pending-total')).toContainText('22 700')
  await expect(page.getByTestId('received-total')).toContainText('508 700')

  // Only the confirmed card flipped; the other paid cards still ask.
  await expect(page.getByTestId('receipt-toggle-MT-4688')).toContainText('أكّد استلام دفعتك')
})

// ---- الشراء (Buy mode) ------------------------------------------------------

async function openBuy(page) {
  await page.goto('/')
  await page.getByPlaceholder('vendeur@mtauto.cloud').fill('owner@alamine-parts.dz')
  await page.getByTestId('send-code').click()
  for (let i = 0; i < 6; i++) await page.getByTestId(`otp-${i}`).fill('1')
  await page.getByTestId('verify').click()
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()
  await page.getByTestId('mode-toggle-buy').click()
  await expect(page.getByRole('heading', { name: 'اشترِ بسعر الجملة الحقيقي' })).toBeVisible()
}

test('buy mode: toggle opens the wholesale landing and toggles back', async ({ page }) => {
  await openBuy(page)

  // The landing renders top to bottom: hero pill, empty search state, the
  // benefit/method sections, the 5 steps, network banner and footer strip.
  await expect(page.getByText('الإطلاق قريباً جداً')).toBeVisible()
  await expect(page.getByTestId('buy-result-empty')).toBeVisible()
  await expect(page.getByText('مخزون بين يديك')).toBeVisible()
  await expect(page.getByText('أرسل قائمتك — صورة أو جدول')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'خطوات الشراء' })).toBeVisible()
  await expect(page.getByText('نجمع طلبك من شبكة واسعة من تجّار الجملة والموردين.')).toBeVisible()
  await expect(page.getByText('آلاف الأرقام المرجعية، وتزداد كلّ أسبوع', { exact: false })).toBeVisible()

  // Buy mode is a single landing — the sell sidebar is gone.
  await expect(page.getByTestId('nav-queue')).toHaveCount(0)

  // Toggling back restores the sell dashboard.
  await page.getByTestId('mode-toggle-sell').click()
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()
  await expect(page.getByTestId('nav-queue')).toBeVisible()
})

test('buy mode: the choice persists across a reload', async ({ page }) => {
  test.slow() // full login + reload → generous budget on loaded machines
  await openBuy(page)

  await page.reload()
  await expect(page.getByRole('heading', { name: 'اشترِ بسعر الجملة الحقيقي' })).toBeVisible()
  await expect(page.getByTestId('mode-toggle-buy')).toBeVisible()
})

test('buy search: alias ref hit renders the demo result card with supplier prices', async ({ page }) => {
  await openBuy(page)

  await page.getByTestId('buy-search-input').fill('2M803-24410')
  await page.getByTestId('buy-search-btn').click()

  const result = page.getByTestId('buy-result')
  await expect(result).toBeVisible()
  await expect(result).toContainText('يطابق هذه القطعة')
  await expect(result).toContainText('رقم رسمي')
  await expect(result).toContainText('Tendeur de chaîne')
  await expect(result).toContainText('Sportage 5 · Tucson · Seltos')

  // Wholesale supplier rows: brand + price range.
  await expect(result).toContainText('Mobis')
  await expect(result).toContainText('9 250 – 10 500 دج')
  await expect(page.getByTestId('buy-result-empty')).toHaveCount(0)
})

test('buy search: vehicle-name hit, and a nonsense query shows the no-match state', async ({ page }) => {
  await openBuy(page)

  const input = page.getByTestId('buy-search-input')

  // By vehicle name (no ref needed).
  await input.fill('Sportage 5')
  await page.getByTestId('buy-search-btn').click()
  await expect(page.getByTestId('buy-result')).toContainText('Tendeur de chaîne')

  // Nonsense → the muted no-match state replaces the result card.
  await input.fill('XYZ-0000')
  await page.getByTestId('buy-search-btn').click()
  await expect(page.getByTestId('buy-result')).toHaveCount(0)
  await expect(page.getByTestId('buy-result-empty')).toContainText('لا نتائج')

  // From the empty state, the short marketing abbreviation + Enter must
  // re-create the card — proving the Enter submit path actually searches.
  await input.fill('TEN CH SPO')
  await input.press('Enter')
  await expect(page.getByTestId('buy-result')).toContainText('Mobis')
  await expect(page.getByTestId('buy-result-empty')).toHaveCount(0)
})

// ---- سجل نشاط الموظفين (Activity log) ---------------------------------------

async function signInAs(page, email) {
  await page.goto('/')
  await page.getByPlaceholder('vendeur@mtauto.cloud').fill(email)
  await page.getByTestId('send-code').click()
  for (let i = 0; i < 6; i++) await page.getByTestId(`otp-${i}`).fill('1')
  await page.getByTestId('verify').click()
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()
}

test('activity log: owner opens it from the account menu — ≥6 attributed rows, every dot color, meta amounts', async ({
  page,
}) => {
  await signInAs(page, 'owner@alamine-parts.dz')

  // Reachable via the header account menu (owner section) — opens as the
  // blurred account popup, not a routed screen.
  await page.locator('.acct-btn').click()
  await page.getByRole('button', { name: /سجل نشاط الموظفين/ }).click()

  const modal = page.getByTestId('account-modal')
  await expect(modal).toBeVisible()
  const screen = page.getByTestId('activity-screen')
  await expect(screen).toBeVisible()
  await expect(page.getByRole('heading', { name: 'سجل نشاط الموظفين' })).toBeVisible()
  await expect(modal).toContainText('كل إجراء يقوم به موظفوك يُنسَب إلى صاحبه')

  // Column header row + at least 6 attributed rows.
  await expect(screen.getByText('الموظف والإجراء')).toBeVisible()
  await expect(screen.getByText('الوقت', { exact: true })).toBeVisible()
  const rows = page.getByTestId('activity-row')
  await expect(rows.first()).toBeVisible()
  expect(await rows.count()).toBeGreaterThanOrEqual(6)

  // Newest row: who + act + target + meta amount + time.
  const first = rows.first()
  await expect(first).toContainText('yacine@alamine-parts.dz')
  await expect(first).toContainText('قدّم عرضاً على')
  await expect(first).toContainText('Alternateur · MT-4795')
  await expect(first).toContainText('14,000 دج')
  await expect(first).toContainText('اليوم 09:14')

  // Every kind → dot color appears (quote/message/delivery/withdraw/other).
  for (const kind of ['quote', 'message', 'delivery', 'withdraw', 'other']) {
    await expect(screen.locator(`.act-dot.${kind}`).first()).toBeVisible()
  }

  // Rows are attributed to STAFF only — the owner never appears in the list.
  await expect(screen.getByText('owner@alamine-parts.dz')).toHaveCount(0)
})

test('activity log: staff cannot reach it — no menu entry, the screen never renders', async ({ page }) => {
  await signInAs(page, 'samir@alamine-parts.dz')

  // The staff account menu offers no activity entry (only the perms summary).
  await page.locator('.acct-btn').click()
  await expect(page.getByRole('button', { name: /سجل نشاط الموظفين/ })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /صلاحياتك/ })).toBeVisible()

  // And the screen itself is nowhere in the DOM.
  await expect(page.getByTestId('activity-screen')).toHaveCount(0)
  await expect(page.getByTestId('activity-row')).toHaveCount(0)
})

// ---- Account area popups (settings / team / activity as blurred modals) -----

async function openAccountSection(page, menuTestid) {
  await signInAs(page, 'owner@alamine-parts.dz')
  await page.locator('.acct-btn').click()
  await page.getByTestId(menuTestid).click()
  await expect(page.getByTestId('account-modal')).toBeVisible()
}

test('account popup: menu-team opens the team section over the dashboard, Esc closes and returns focus', async ({
  page,
}) => {
  await openAccountSection(page, 'menu-team')

  // The team section renders INSIDE the modal body; the dashboard never routed
  // away — the queue heading is still behind the backdrop.
  const modal = page.getByTestId('account-modal')
  await expect(modal).toHaveAttribute('aria-modal', 'true')
  await expect(page.getByTestId('team-screen')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()

  // Body scroll is locked while the popup is open.
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden')

  // Esc closes it, unlocks scroll, and focus returns to the account trigger.
  await page.keyboard.press('Escape')
  await expect(modal).toHaveCount(0)
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
  await expect(page.locator('.acct-btn')).toBeFocused()
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()
})

test('account popup: backdrop click closes it, clicks inside the panel do not', async ({ page }) => {
  await openAccountSection(page, 'menu-team')

  // Clicking inside the panel (its title) must NOT close the popup.
  await page.locator('#account-modal-title').click()
  await expect(page.getByTestId('account-modal')).toBeVisible()

  // Clicking the blurred backdrop itself (viewport corner) closes it.
  await page.getByTestId('account-modal-backdrop').click({ position: { x: 8, y: 8 } })
  await expect(page.getByTestId('account-modal')).toHaveCount(0)
})

test('account popup: rapid double Esc closes once and never navigates the app away', async ({ page }) => {
  await openAccountSection(page, 'menu-settings')

  // Two Escapes in quick succession must collapse into ONE history.back() —
  // a second traversal would exit the SPA entirely.
  await page.keyboard.press('Escape')
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('account-modal')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()
  expect(new URL(page.url()).pathname).toBe('/')
})

test('account popup: the ✕ button and browser Back both close it without leaving the app', async ({ page }) => {
  await openAccountSection(page, 'menu-activity')
  await page.getByTestId('account-modal-close').click()
  await expect(page.getByTestId('account-modal')).toHaveCount(0)

  // Reopen, then the browser Back button closes the popup (pushState pairing).
  await page.locator('.acct-btn').click()
  await page.getByTestId('menu-activity').click()
  await expect(page.getByTestId('account-modal')).toBeVisible()
  await page.goBack()
  await expect(page.getByTestId('account-modal')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()
})

test('account popup: settings renders its cards, save lives in the pinned footer and enables only when dirty', async ({
  page,
}) => {
  await openAccountSection(page, 'menu-settings')
  await expect(page.getByTestId('settings-screen')).toBeVisible()

  // The three cards: store info, map, account & login.
  await expect(page.getByText('معلومات المتجر')).toBeVisible()
  await expect(page.getByText('موقع المحل على الخريطة')).toBeVisible()
  await expect(page.getByText('الحساب والدخول')).toBeVisible()

  // Save/reset live in the modal FOOTER (not the scrolling body), disabled while clean.
  const save = page.locator('.blur-foot').getByTestId('settings-save')
  const reset = page.locator('.blur-foot').getByTestId('settings-reset')
  await expect(save).toBeVisible()
  await expect(save).toBeDisabled()
  await expect(reset).toBeDisabled()

  // Editing a field arms them; reset returns to the clean state.
  await page.getByTestId('settings-name').fill('قطع غيار الأمين — الفرع الرئيسي')
  await expect(save).toBeEnabled()
  await expect(reset).toBeEnabled()
  await reset.click()
  await expect(page.getByTestId('settings-name')).toHaveValue('قطع غيار الأمين')
  await expect(save).toBeDisabled()

  // Saving a real change persists it (header shop name re-renders) and disarms.
  await page.getByTestId('settings-name').fill('قطع غيار الأمين الجديد')
  await save.click()
  await expect(save).toBeDisabled()
  await expect(page.getByTestId('settings-name')).toHaveValue('قطع غيار الأمين الجديد')
})

test('account popup: team section invites a seat and toggles per-seat permission switches', async ({ page }) => {
  await openAccountSection(page, 'menu-team')

  // Seed team: the owner seat is fixed; employees expand to their switches.
  await expect(page.getByTestId('team-row-u_owner')).toContainText('المالك — كل الصلاحيات')
  await page.getByTestId('team-expand-u_emp_1').click()
  const pricing = page.getByTestId('perm-pricing-u_emp_1')
  const payout = page.getByTestId('perm-payout-u_emp_1')
  await expect(pricing).toHaveClass(/on/)
  await expect(payout).not.toHaveClass(/on/)

  // Granting flips the switch in place.
  await payout.click()
  await expect(payout).toHaveClass(/on/)

  // Inviting adds a pending seat to the list.
  await page.getByTestId('team-invite-email').fill('karim@alamine-parts.dz')
  await page.getByTestId('team-invite-send').click()
  await expect(page.getByTestId('team-list')).toContainText('karim@alamine-parts.dz')
  await expect(page.getByTestId('team-list')).toContainText('بانتظار القبول')
})
