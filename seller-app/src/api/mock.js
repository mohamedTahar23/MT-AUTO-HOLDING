// ---------------------------------------------------------------------------
// Mock backend adapter.
//
// Implements the same interface the real Supabase adapter must implement (see
// ./index.js and the README "Swap-in points" table). All state is in-memory and
// resets on reload, except the session which is persisted to localStorage so a
// refresh keeps you signed in.
//
// Business rules encoded here come straight from handoff/prompts/03 - Seller
// Portal.md and the Data Contract:
//   • price ≥3 and ≤7 digits
//   • buyer_note ≤240 chars
//   • withdraw is free within 15 min of submitting; later → warned + counted,
//     3rd late withdrawal → R2 restriction
//   • proof video has a 24h window; every mutation carries acted_by + logs an event
// ---------------------------------------------------------------------------
import * as seed from './seed.js'
import { WITHDRAW_WINDOW_MS } from '../lib/format.js'

const SESSION_KEY = 'mtseller.session'
const delay = (ms = 320) => new Promise((r) => setTimeout(r, ms))
const clone = (v) => JSON.parse(JSON.stringify(v))
const uid = (p) => `${p}_${Math.random().toString(36).slice(2, 8)}`

// Mutable in-memory state (seeded once).
const db = {
  shop: clone(seed.shop),
  users: clone(seed.shopUsers),
  tasks: clone(seed.tasks),
  offers: clone(seed.offers),
  orders: clone(seed.orders),
  payouts: clone(seed.payouts),
  payoutReceived: [], // refs of paid payouts the shop confirmed receiving — seeded empty

  messages: clone(seed.messages),
  events: [],
}

let session = readSession()

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}
function writeSession(s) {
  session = s
  if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s))
  else localStorage.removeItem(SESSION_KEY)
}

function requireSession() {
  if (!session) throw new Error('غير مسجّل الدخول')
  return session
}

/** Append-only audit event (the backbone every action writes to). */
function logEvent(kind, note = '') {
  const actor = session
    ? { side: 'seller', user_id: session.user.id, name: session.user.name, role: session.user.role }
    : { side: 'seller' }
  db.events.push({ at: new Date().toISOString(), actor, kind, note, manual: false })
}

export const mockApi = {
  // ---- auth ---------------------------------------------------------------
  async requestOtp(email) {
    await delay()
    const known = Boolean(seed.knownAccounts[email.trim().toLowerCase()])
    // In real life the OTP is emailed. Mock: accept any 6 digits (hint: 000000).
    return { ok: true, known }
  },

  async verifyOtp(email, code) {
    await delay()
    if (!/^\d{6}$/.test(String(code))) throw new Error('الرمز يجب أن يكون 6 أرقام')
    const e = email.trim().toLowerCase()
    // Resolve seeded accounts, then invited seats (invite_member adds the
    // email to db.users — their first login flips the seat to active).
    const userId = seed.knownAccounts[e]
    const user = userId
      ? db.users.find((u) => u.id === userId)
      : db.users.find((u) => (u.email || '').toLowerCase() === e)
    if (!user) throw new Error('unknown-email') // caller routes to the apply form
    if (user.status === 'invited') user.status = 'active'
    writeSession({ shopId: db.shop.id, user, email: e })
    logEvent('login', email)
    return { session: clone(session), shop: clone(db.shop) }
  },

  async signInWithGoogle() {
    await delay(700)
    // Mock: Google OAuth resolves straight to the demo owner account. Real
    // adapter: supabase.auth.signInWithOAuth({ provider: 'google' }) + session
    // pickup on redirect.
    const user = db.users.find((u) => u.id === seed.knownAccounts['owner@alamine-parts.dz'])
    writeSession({ shopId: db.shop.id, user, email: 'owner@alamine-parts.dz' })
    logEvent('login', 'google:owner@alamine-parts.dz')
    return { session: clone(session), shop: clone(db.shop) }
  },

  async applyShop(payload) {
    await delay(600)
    // apply_shop RPC — creates a pending shop in "قيد المراجعة".
    db.shop = {
      ...db.shop,
      name: payload.gShopName || db.shop.name,
      wilaya: payload.gWilaya || db.shop.wilaya,
      phone: payload.gPhone1 || db.shop.phone,
      address: payload.gAddress || db.shop.address,
      mapsUrl: payload.gMapsUrl || db.shop.mapsUrl,
      status: 'review',
    }
    const owner = { ...db.users[0], name: payload.gOwner || db.users[0].name }
    writeSession({ shopId: db.shop.id, user: owner })
    logEvent('apply_shop', payload.gShopName)
    return { status: 'review', shop: clone(db.shop) }
  },

  currentSession() {
    return session ? clone(session) : null
  },

  async signOut() {
    logEvent('logout')
    writeSession(null)
  },

  // ---- reads --------------------------------------------------------------
  async getShop() {
    await delay(120)
    return clone(db.shop)
  },
  async getShopUsers() {
    await delay(120)
    return clone(db.users)
  },
  async getTasks() {
    await delay()
    requireSession()
    // Tasks stay visible while restricted (R2): the queue renders each card's
    // action as "التسعير موقوف" and submitOffer still refuses server-side.
    return clone(db.tasks)
  },
  async getOffers() {
    await delay()
    requireSession()
    return clone(db.offers)
  },
  async getOrders() {
    await delay()
    requireSession()
    return clone(db.orders)
  },
  async getDeliveries() {
    await delay()
    requireSession()
    // Tracking view of confirmed orders. Stored stages are never renamed —
    // orders without an explicit `delivery` status derive one from `stage`.
    const STAGE_TO_STATUS = { video: 'pack', handover: 'pack', transit: 'transit', done: 'delivered' }
    return clone(db.orders).map((o) => ({ ...o, deliveryStatus: o.delivery || STAGE_TO_STATUS[o.stage] || 'pack' }))
  },
  async getPayouts() {
    await delay()
    requireSession()
    // Rows carry a derived `received` flag (per-ref set, user-confirmed via the
    // receipt toggle). baseline = lifetime received total before these rows.
    return {
      baseline: seed.PAYOUT_BASELINE,
      rows: clone(db.payouts).map((p) => ({ ...p, received: db.payoutReceived.includes(p.ref) })),
    }
  },
  async getPerformance() {
    await delay(160)
    return clone(seed.performance)
  },
  async getMessages() {
    await delay(160)
    return clone(db.messages)
  },
  async sendMessage(text) {
    await delay(160)
    requireSession()
    const msg = { id: uid('m'), from: 'shop', at: new Date().toISOString(), text }
    db.messages.push(msg)
    logEvent('message', text.slice(0, 60))
    return clone(msg)
  },
  async getActivityLog() {
    await delay(160)
    const s = requireSession()
    // Owner-only read — staff never see the audit trail, mirroring the UI gate.
    if (s.user.role !== 'owner') throw new Error('سجل النشاط متاح للمالك فقط')
    return clone(seed.activityLog)
  },
  async getAds() {
    await delay(120)
    return clone(seed.ads)
  },
  async getWholesaleDemo() {
    await delay(120)
    // Demo catalog for the Buy-landing search — static marketing data, so no
    // session gate (the page itself already sits behind the shell).
    return clone(seed.wholesaleDemo)
  },
  getMeta() {
    return { countries: seed.countries, brandChips: seed.brandChips, wilayas: seed.wilayas, carBrandGroups: seed.carBrandGroups }
  },

  // ---- RPC mutations ------------------------------------------------------
  // update_shop — owner edits the shop profile (إعدادات الحساب). Only the
  // profile fields are writable; status/r2/rating stay server-owned.
  async updateShop(patch) {
    await delay(420)
    const s = requireSession()
    if (s.user.role !== 'owner') throw new Error('إعدادات الحساب متاحة للمالك فقط')
    // Validate the whole patch BEFORE touching db.shop — a rejected save must
    // not leave a partial write behind.
    const next = {}
    for (const k of ['name', 'wilaya', 'phone', 'address', 'mapsUrl']) {
      if (typeof patch?.[k] === 'string') next[k] = patch[k].trim()
    }
    if ('name' in next && !next.name) throw new Error('اسم المحل مطلوب')
    Object.assign(db.shop, next)
    logEvent('update_shop', db.shop.name)
    return clone(db.shop)
  },

  // invite_member — owner invites an employee seat (الفريق والصلاحيات). The
  // seat starts 'invited' with pricing only; the owner grants the rest.
  async inviteTeamMember(email) {
    await delay(420)
    const s = requireSession()
    if (s.user.role !== 'owner') throw new Error('إدارة الفريق متاحة للمالك فقط')
    const e = String(email || '').trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new Error('الرجاء إدخال بريد إلكتروني صحيح')
    if (db.users.some((u) => (u.email || '').toLowerCase() === e)) throw new Error('هذا البريد موجود في الفريق من قبل')
    const user = {
      id: uid('u'),
      shop_id: db.shop.id,
      name: e.split('@')[0],
      email: e,
      role: 'employee',
      status: 'invited',
      perms: { pricing: true, media: false, payout: false, team: false },
    }
    db.users.push(user)
    logEvent('invite_member', e)
    return clone(user)
  },

  // update_perms — owner flips a seat's permission switches. The owner's own
  // perms are fixed (always everything).
  async updateUserPerms(userId, perms) {
    await delay(260)
    const s = requireSession()
    if (s.user.role !== 'owner') throw new Error('إدارة الصلاحيات متاحة للمالك فقط')
    const u = db.users.find((x) => x.id === userId)
    if (!u) throw new Error('الموظف غير موجود')
    if (u.role === 'owner') throw new Error('صلاحيات المالك ثابتة')
    u.perms = { pricing: false, media: false, payout: false, team: false, ...perms }
    logEvent('update_perms', `${u.email || u.name} · ${Object.keys(u.perms).filter((k) => u.perms[k]).join(',') || '—'}`)
    return clone(u)
  },

  // submit_offer — validates and appends a competing offer row.
  async submitOffer({ taskId, price, brand, country, buyer_note = '', commit_agree, partNo = '' }) {
    await delay(420)
    const s = requireSession()
    if (db.shop.r2.active) throw new Error('حسابك مقيّد حالياً')
    if (!s.user.perms?.pricing) throw new Error('لا تملك صلاحية التسعير')
    const digits = String(price).replace(/\D/g, '')
    if (digits.length < 3 || digits.length > 7) throw new Error('السعر يجب أن يكون بين 3 و7 أرقام')
    if (!brand?.trim()) throw new Error('الماركة مطلوبة (قطع جديدة فقط)')
    if (!country) throw new Error('بلد الصنع مطلوب')
    if (buyer_note.length > 240) throw new Error('الملاحظة أطول من 240 حرفاً')
    if (!commit_agree) throw new Error('يجب الموافقة على الالتزامات')

    const task = db.tasks.find((t) => t.id === taskId)
    const offer = {
      id: uid('of'),
      taskId,
      partName: task?.part?.name || '',
      car: task ? `${task.car.make} ${task.car.model} ${task.car.year}` : '',
      price: Number(digits),
      brand: brand.trim(),
      country,
      note: buyer_note.trim(),
      partNo: partNo.trim(),
      status: 'sent',
      submittedAt: new Date().toISOString(),
      actedBy: s.user.id,
      competingShops: task?.competingShops ?? 0,
    }
    // Dedupe same shop + same brand on the same request.
    const dup = db.offers.find((o) => o.taskId === taskId && o.brand === offer.brand && o.status === 'sent')
    if (dup) throw new Error('لديك عرض بنفس الماركة على هذا الطلب')
    db.offers.unshift(offer)
    logEvent('submit_offer', `${taskId} · ${brand} · ${offer.price}`)
    return clone(offer)
  },

  // withdraw_offer — free within the 15-min window, else warned + counted.
  async withdrawOffer(offerId) {
    await delay(300)
    requireSession()
    const offer = db.offers.find((o) => o.id === offerId)
    if (!offer) throw new Error('العرض غير موجود')
    const late = Date.now() - new Date(offer.submittedAt).getTime() > WITHDRAW_WINDOW_MS
    offer.status = 'withdrawn'
    offer.withdrawnAt = new Date().toISOString()
    let r2Triggered = false
    if (late) {
      db.shop.withdraw_warns = Math.min(3, db.shop.withdraw_warns + 1)
      if (db.shop.withdraw_warns >= 3) {
        db.shop.r2 = {
          active: true,
          reason: 'ثلاث عمليات سحب متأخرة للعروض',
          since: new Date().toISOString(),
          lifted_by: null,
          lifted_at: null,
        }
        r2Triggered = true
      }
    }
    logEvent('withdraw_offer', `${offerId}${late ? ' (متأخر)' : ''}`)
    return { late, warns: db.shop.withdraw_warns, r2Triggered, shop: clone(db.shop) }
  },

  // upload_proof — one continuous take; marks proof uploaded, advances to handover.
  async uploadProof(orderId, fileName = 'proof.mp4') {
    await delay(700)
    const s = requireSession()
    if (!s.user.perms?.media) throw new Error('لا تملك صلاحية رفع الوسائط')
    const order = db.orders.find((o) => o.id === orderId)
    if (!order) throw new Error('الطلب غير موجود')
    order.proofStatus = 'مرفوع'
    order.stage = 'handover'
    order.labelCode = order.labelCode || `YAL-${Math.floor(1000 + Math.random() * 8999)}-AN`
    logEvent('upload_proof', `${orderId} · ${fileName}`)
    return clone(order)
  },

  // mark_handover — parcel handed to carrier (label code + "MT AUTO"), no address.
  async markHandover(orderId) {
    await delay(400)
    requireSession()
    const order = db.orders.find((o) => o.id === orderId)
    if (!order) throw new Error('الطلب غير موجود')
    if (!order.labelCode) throw new Error('لا يوجد رمز ملصق بعد')
    order.status = 'قيد الشحن'
    order.stage = 'transit'
    order.tracking = ['تجهيز', 'استلمها الناقل']
    logEvent('mark_handover', `${orderId} · ${order.labelCode}`)
    return clone(order)
  },

  // confirm_payout_receipt — shop attests a paid transfer actually reached its
  // account. Moves the amount from «قيد الانتظار» into the received total.
  async confirmPayoutReceipt(ref) {
    await delay(300)
    requireSession()
    const payout = db.payouts.find((p) => p.ref === ref)
    if (!payout) throw new Error('الدفعة غير موجودة')
    if (payout.status !== 'paid') throw new Error('لا يمكن تأكيد استلام دفعة لم تُحوَّل بعد')
    if (!db.payoutReceived.includes(ref)) db.payoutReceived.push(ref)
    logEvent('confirm_payout_receipt', ref)
    return { ok: true, ref }
  },

  // reconfirm_offer — confirm availability+price on a re-selected frozen offer.
  async reconfirmOffer(offerId, decision) {
    await delay(300)
    requireSession()
    const offer = db.offers.find((o) => o.id === offerId)
    if (offer) offer.status = decision === 'confirm' ? 'won' : 'lost'
    logEvent('reconfirm_offer', `${offerId} · ${decision}`)
    return { ok: true }
  },

  // Test/demo helper: force the R2 restricted state.
  async _debugSetR2(active) {
    db.shop.r2 = active
      ? { active: true, reason: 'وضع تجريبي', since: new Date().toISOString() }
      : { active: false, reason: '' }
    return clone(db.shop)
  },

  // Dev-mode helper: sign in as any seeded user without OTP, so DevPanel can
  // land straight in the shell. Mock-only (the `_` prefix marks it as such) —
  // the real adapter never fabricates a session client-side.
  async _devSignIn(userId = 'u_owner') {
    const user = db.users.find((u) => u.id === userId) || db.users[0]
    if (db.shop.status !== 'active') db.shop.status = 'active' // skip the review gate
    writeSession({ shopId: db.shop.id, user, email: user.email })
    logEvent('login', `dev:${user.email}`)
    return { session: clone(session), shop: clone(db.shop) }
  },
}
