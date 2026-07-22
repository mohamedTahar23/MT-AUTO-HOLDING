// End-to-end smoke test of the MT AUTO buyer front-door.
import { chromium } from 'playwright-core'

const BASE = 'http://localhost:5173'
const SHOT = (n) => `e2e/shots/${n}.png`
const results = []
const ok = (name, cond) => { results.push([cond ? 'PASS' : 'FAIL', name]); if (!cond) process.exitCode = 1 }

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium', headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => { const t = m.text(); if (m.type() === 'error' && !/ERR_CERT|ERR_NAME|ERR_INTERNET|Failed to load resource/.test(t)) errors.push(t) })

await page.goto(BASE, { waitUntil: 'networkidle' })

// 1. Landing renders (RTL, hero, login card)
ok('dir=rtl set', await page.getAttribute('html', 'dir') === 'rtl' || await page.locator('[dir=rtl]').first().isVisible())
ok('hero headline visible', await page.locator('.req-hero h1').isVisible())
ok('login card visible (logged out)', await page.locator('#account .form-card').isVisible())
ok('how-it-works section', await page.locator('#how .how-step').count() === 4)
ok('faq has 6 items', await page.locator('#faq details.qa').count() === 6)
await page.screenshot({ path: SHOT('01-landing'), fullPage: false })

// 2. Login: phone → OTP → verify
await page.fill('#lg_phone', '0659401338')
ok('send-code enabled after valid phone', await page.locator('#account button:has-text("أرسِل رمز الدخول")').isEnabled())
await page.click('#account button:has-text("أرسِل رمز الدخول")')
await page.waitForSelector('.otp-block.on')
const demo = await page.locator('.otp-block b[dir=ltr]').textContent()
ok('demo OTP code shown', /^\d{6}$/.test((demo || '').trim()))
await page.fill('.otp-block input.inp', demo.trim())
await page.click('button:has-text("دخول إلى حسابي")')
await page.waitForSelector('.oflow-steps')
ok('wizard visible after login', await page.locator('.oflow-steps').isVisible())
ok('header shows طلباتي after login', await page.locator('.hub-link').isVisible())
await page.screenshot({ path: SHOT('02-wizard-vehicle'), fullPage: false })

// 3. Vehicle step: saved vehicle preselected (Picanto), continue
ok('saved vehicles offered', (await page.locator('.oflow-inline button:has-text("Picanto")').count()) > 0)
const contBtn = page.locator('button:has-text("تابع — تفاصيل القطعة")')
ok('continue enabled (saved car prefilled)', await contBtn.isEnabled())
await contBtn.click()
await page.waitForSelector('h2.oflow-title:has-text("ما القطعة")')

// 4. Part step: name + photo, continue
await page.fill('.form-card input.inp >> nth=0', 'Disque de frein avant')
await page.click('button[aria-label="أضف صورة"]')
ok('photo thumb added', (await page.locator('button[aria-label="حذف"]').count()) === 1)
const partNext = page.locator('button:has-text("تابع — الإرسال والتأكيد")')
ok('part continue enabled', await partNext.isEnabled())
await page.screenshot({ path: SHOT('03-part-step'), fullPage: false })
await partNext.click()
await page.waitForSelector('h2.oflow-title:has-text("أرسل طلبك")')

// 5. Details step: summary + profile prefilled from login, geo detect, submit via terms
const sumTxt = await page.locator('.oflow-inline').textContent()
ok('summary shows car', sumTxt.includes('كيا Picanto 2018'))
ok('summary shows part', sumTxt.includes('Disque de frein avant'))
ok('first name prefilled', (await page.inputValue('.form-card input.inp >> nth=0')) === 'كريم')
await page.click('button:has-text("حدّد موقعي")')
await page.waitForFunction(() => document.body.textContent.includes('تم تحديد موقعك'))
await page.screenshot({ path: SHOT('04-details-step'), fullPage: false })
const review = page.locator('button:has-text("مراجعة الطلب وإرساله")')
ok('review enabled', await review.isEnabled())
await review.click()
await page.waitForSelector('.modal.open')
ok('terms modal opens as submit gate', await page.locator('.modal.open h3:has-text("الشروط")').isVisible())
await page.click('.modal.open button:has-text("قرأتُ وأوافق")')
await page.waitForSelector('h2.oflow-title:has-text("تم استلام طلبك")')
const orderNum = await page.locator('bdi.num[dir=ltr]').first().textContent()
ok('order number MT-####', /^MT-\d{4}$/.test((orderNum || '').trim()))
await page.screenshot({ path: SHOT('05-sent'), fullPage: false })

// 6. Orders hub: new order on top with sourcing status
await page.click('button:has-text("تابع الطلب في «طلباتي»")')
await page.waitForSelector('.hub')
const firstCard = page.locator('.hub-orders > div').first()
ok('hub shows 3 orders', (await page.locator('.hub-orders > div').count()) === 3)
ok('new order first + sourcing chip', (await firstCard.textContent()).includes('قيد المطابقة'))
await page.screenshot({ path: SHOT('06-hub'), fullPage: false })
// open journey stub
await firstCard.locator('[role=button]').click()
await page.waitForSelector('.track')
ok('journey stub tracker renders', await page.locator('.tk.cur').isVisible())
await page.screenshot({ path: SHOT('07-journey'), fullPage: false })
await page.click('button:has-text("كل الطلبات")')
await page.click('.hub-back')

// 7. Account modal + edit profile
await page.click('.acct-chip')
await page.waitForSelector('.modal.open h3:has-text("حسابي")')
const acctTxt = await page.locator('.modal.open').textContent()
ok('account modal shows name', acctTxt.includes('كريم بن عيسى'))
ok('account modal shows vehicles', acctTxt.includes('Picanto') && acctTxt.includes('Rio'))
await page.screenshot({ path: SHOT('08-account'), fullPage: false })
await page.click('.modal.open button:has-text("تعديل")')
await page.waitForSelector('.modal.open h3:has-text("تعديل بياناتي")')
ok('edit profile phone disabled', await page.locator('.modal.open input[disabled]').isVisible())
await page.click('.modal.open button:has-text("حفظ التغييرات")')
await page.waitForSelector('.modal.open h3:has-text("حسابي")')
await page.click('.modal.open .x')

// 8. الميسر assistant (mock)
await page.click('.mysr-fab')
await page.waitForSelector('.mysr-panel')
ok('welcome message', (await page.locator('.mysr-b.a').first().textContent()).includes('الميسر'))
ok('4 suggestion chips', (await page.locator('.mysr-chip').count()) === 4)
await page.click('.mysr-chip >> nth=1') // ما معنى «دليل القطعة»؟
await page.waitForFunction(() => document.querySelectorAll('.mysr-b.a:not(.mysr-dots)').length >= 2, { timeout: 5000 })
ok('mock reply about proof video', (await page.locator('.mysr-b.a:not(.mysr-dots)').last().textContent()).includes('دليل القطعة'))
await page.screenshot({ path: SHOT('09-assistant'), fullPage: false })
await page.click('.mysr-panel button[aria-label="إغلاق"]')

// 9. Logout returns to login card
await page.click('.acct-chip')
await page.click('.modal.open button:has-text("تسجيل الخروج")')
await page.waitForSelector('#lg_phone')
ok('logout returns to login', await page.locator('#lg_phone').isVisible())

// 10. Mobile layout sanity
await page.setViewportSize({ width: 390, height: 844 })
await page.waitForTimeout(300)
await page.screenshot({ path: SHOT('10-mobile'), fullPage: false })
ok('no horizontal overflow on mobile', await page.evaluate(() => document.documentElement.scrollWidth <= 391))

ok('no console/page errors', errors.length === 0)
if (errors.length) console.log('ERRORS:', errors.slice(0, 5))

console.log(results.map((r) => r.join('  ')).join('\n'))
console.log(`\n${results.filter((r) => r[0] === 'PASS').length}/${results.length} passed`)
await browser.close()
