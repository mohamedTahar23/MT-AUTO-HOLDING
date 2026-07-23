import { test, expect } from '@playwright/test'

// Phone-viewport suite (Pixel 7 project — see playwright.config.js). Guards
// the mobile shell: no horizontal overflow anywhere (in RTL an overflowing
// page shifts leftward and mis-anchors every fixed overlay), the bottom tab
// bar that replaces the hidden sidebar, and the account popup's anchoring.

const noHorizontalOverflow = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)

async function signInAsOwner(page) {
  await page.goto('/')
  await page.getByTestId('google-signin').click()
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()
}

test('landing fits the phone viewport and the hero card keeps its badges intact', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'زد مبيعاتك مع MT AUTO' })).toBeVisible()
  expect(await noHorizontalOverflow(page)).toBe(true)

  // The request-ref badge stays on one line (no mid-reference break).
  const pill = page.locator('.hero-card .pill').first()
  await expect(pill).toContainText('MT-14902')
  const box = await pill.boundingBox()
  expect(box.height).toBeLessThan(34) // a wrapped pill is ~2 lines tall
})

test('dashboard fits the phone viewport and the bottom tab bar navigates', async ({ page }) => {
  await signInAsOwner(page)
  expect(await noHorizontalOverflow(page)).toBe(true)

  // The sidebar is gone; the tab bar replaces it with the same items.
  await expect(page.getByTestId('nav-queue')).toBeHidden()
  await expect(page.getByTestId('mnav-queue')).toBeVisible()

  await page.getByTestId('mnav-quotes').click()
  await expect(page.getByRole('heading', { name: 'عروضي' })).toBeVisible()
  await page.getByTestId('mnav-payouts').click()
  await expect(page.getByRole('heading', { name: 'الأرباح' })).toBeVisible()
  await page.getByTestId('mnav-queue').click()
  await expect(page.getByRole('heading', { name: 'طابور التسعير' })).toBeVisible()
})

test('account popup anchors to the visible viewport on a phone and closes', async ({ page }) => {
  await signInAsOwner(page)
  await page.locator('.acct-btn').click()
  await page.getByTestId('menu-settings').click()
  await expect(page.getByTestId('account-modal')).toBeVisible()

  // The fixed backdrop must cover exactly the visual viewport — a page wider
  // than the screen would shift it off to the side (the bug this suite guards).
  const viewport = page.viewportSize()
  const backdrop = await page.getByTestId('account-modal-backdrop').boundingBox()
  expect(Math.round(backdrop.x)).toBe(0)
  expect(Math.round(backdrop.width)).toBe(viewport.width)

  // The panel itself fits inside the screen.
  const panel = await page.getByTestId('account-modal').boundingBox()
  expect(panel.x).toBeGreaterThanOrEqual(0)
  expect(Math.round(panel.x + panel.width)).toBeLessThanOrEqual(viewport.width)

  // Footer actions are reachable and the popup closes cleanly.
  await expect(page.getByTestId('settings-save')).toBeVisible()
  await page.getByTestId('account-modal-close').click()
  await expect(page.getByTestId('account-modal')).toHaveCount(0)
})
