// Shared setup helpers for the buyer e2e specs. Each function drives the app
// to a given point in the request journey, mirroring the linear flow that the
// original hand-rolled e2e/smoke.mjs walked through in one pass. Specs use
// these in `beforeAll` (serial mode, shared page) so every original assertion
// survives as its own test.

// Log in: phone → demo OTP → verify → land on the request wizard (vehicle step).
export async function login(page) {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.fill('#lg_phone', '0659401338')
  await page.click('#account button:has-text("أرسِل رمز الدخول")')
  await page.waitForSelector('.otp-block.on')
  const demo = ((await page.locator('.otp-block b[dir=ltr]').textContent()) || '').trim()
  await page.fill('.otp-block input.inp', demo)
  await page.click('button:has-text("دخول إلى حسابي")')
  await page.waitForSelector('.oflow-steps')
  return demo
}

// From the vehicle step, continue (saved car prefilled) to the part step.
export async function reachPartStep(page) {
  await login(page)
  await page.click('button:has-text("تابع — تفاصيل القطعة")')
  await page.waitForSelector('h2.oflow-title:has-text("ما القطعة")')
}

// From the part step, fill a part name + photo, continue to the details step.
export async function reachDetailsStep(page) {
  await reachPartStep(page)
  await page.fill('.form-card input.inp >> nth=0', 'Disque de frein avant')
  await page.click('button[aria-label="أضف صورة"]')
  await page.click('button:has-text("تابع — الإرسال والتأكيد")')
  await page.waitForSelector('h2.oflow-title:has-text("أرسل طلبك")')
}

// From the details step, geo-detect, accept the terms gate, reach confirmation.
export async function reachConfirmation(page) {
  await reachDetailsStep(page)
  await page.click('button:has-text("حدّد موقعي")')
  await page.waitForFunction(() => document.body.textContent.includes('تم تحديد موقعك'))
  await page.click('button:has-text("مراجعة الطلب وإرساله")')
  await page.waitForSelector('.modal.open')
  await page.click('.modal.open button:has-text("قرأتُ وأوافق")')
  await page.waitForSelector('h2.oflow-title:has-text("تم استلام طلبك")')
}

// From confirmation, open the orders hub «طلباتي».
export async function reachHub(page) {
  await reachConfirmation(page)
  await page.click('button:has-text("تابع الطلب في «طلباتي»")')
  await page.waitForSelector('.hub')
}

// Collect page/console errors, filtering the same benign network noise the
// original smoke test ignored (blocked fonts/maps in sandboxed environments).
export function attachErrorCollector(page) {
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => {
    const t = m.text()
    if (m.type() === 'error' && !/ERR_CERT|ERR_NAME|ERR_INTERNET|Failed to load resource/.test(t)) errors.push(t)
  })
  return errors
}
