// Small formatting helpers shared across screens.
// Design-reference §3: currency is "1 234 دج" (space-grouped, dinar suffix);
// every ref/phone/price sits in a dir="ltr" island (use the `.ltr` class or <Ltr/>).

/** Group an integer with thin spaces and append the dinar suffix. */
export function money(n) {
  const v = Math.round(Number(n) || 0)
  return `${v.toLocaleString('en-US').replace(/,/g, ' ')} دج`
}

/** Group digits only, no suffix (for inputs / bare amounts). */
export function grouped(n) {
  const v = Math.round(Number(n) || 0)
  return v.toLocaleString('en-US').replace(/,/g, ' ')
}

/** Countdown mm:ss from a millisecond delta (clamped at 0). */
export function mmss(ms) {
  const t = Math.max(0, Math.floor(ms / 1000))
  const m = String(Math.floor(t / 60)).padStart(2, '0')
  const s = String(t % 60).padStart(2, '0')
  return `${m}:${s}`
}

/** Countdown HH:MM from a millisecond delta (clamped at 0). */
export function hhmm(ms) {
  const t = Math.max(0, Math.floor(ms / 60000))
  const h = String(Math.floor(t / 60)).padStart(2, '0')
  const m = String(t % 60).padStart(2, '0')
  return `${h}:${m}`
}

/** Coarse Arabic "age" label from an ISO timestamp. */
export function ageLabel(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'الآن'
  if (mins < 60) return `منذ ${mins} د`
  const h = Math.floor(mins / 60)
  if (h < 24) return `منذ ${h} س`
  return `منذ ${Math.floor(h / 24)} ي`
}

export const WITHDRAW_WINDOW_MS = 15 * 60 * 1000 // free withdrawal window
export const VIDEO_WINDOW_MS = 24 * 60 * 60 * 1000 // proof-video deadline

// MT commission model (from the marketing receipt + Data Contract pct_override):
// 10% up to 50 000 دج, 6% above. Seller net = price − commission.
// NOTE: handoff "Known open items" flags margin details to confirm with the owner.
export const COMMISSION_BREAK = 50000
export function commissionRate(price) {
  return Number(price) > COMMISSION_BREAK ? 0.06 : 0.1
}
export function commissionAmount(price) {
  return Math.round(Number(price) * commissionRate(price))
}
export function netEarnings(price) {
  return Math.round(Number(price)) - commissionAmount(price)
}
export function rateLabel(price) {
  return `${Math.round(commissionRate(price) * 100)}%`
}
