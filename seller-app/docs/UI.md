# Seller App — Screen Reference (UI.md)

Screen-by-screen map of what exists, what it reads, what it mutates, and what is
stubbed. Stack, structure, the business-rule summary, and the backend swap-in
table live in the app [`README.md`](../README.md) — this file cross-references
rather than repeats them.

**Routing** is a `{ name, params }` object in
[`src/state/store.jsx`](../src/state/store.jsx) (`navigate(name)`), rendered by
[`AppShell.jsx`](../src/components/shell/AppShell.jsx)'s `SCREENS` map. The
top-level gate in [`App.jsx`](../src/App.jsx) is: no session → `AuthFlow`; shop
status `review` → `UnderReview`; otherwise → `AppShell`. The store exposes
`api`, `session`, `shop`, `route`, `mode` (sell ⇄ buy, persisted to
localStorage), `accountModal` + `openAccountModal` / `closeAccountModal` (the
owner account-area popups — see below), `toast(s)`, `isOwner`, and `perms`.

**All data access goes through `api` from
[`src/api/index.js`](../src/api/index.js)** (currently the mock in
`api/mock.js`, seeded from `api/seed.js`). Money/commission/countdown rules come
from [`src/lib/format.js`](../src/lib/format.js). Never bypass either — see the
root `CLAUDE.md` invariants.

Demo accounts (from `seed.knownAccounts`): `owner@alamine-parts.dz` (owner, all
perms) and `samir@alamine-parts.dz` (employee: pricing + media, no payout/team).
Any 6-digit OTP verifies; any other email routes to the join-request form.

---

## Pre-auth

### Marketing landing + login gate

- **Component:** [`auth/LoginGate.jsx`](../src/components/auth/LoginGate.jsx),
  orchestrating the full marketing page in
  [`components/landing/`](../src/components/landing/) (one component per design
  section — hero, stat band, how-it-works, team, wholesale, sign-in card,
  contact, footer).
- **Reads:** nothing from the store (pre-session).
- **Mutations:** `api.requestOtp(email)` (via `AuthFlow.startLogin`),
  `api.signInWithGoogle()` (mock: resolves straight to the demo owner).
- **Rules:** email format is validated inline; every valid email advances to the
  OTP screen — whether it belongs to a registered seller is resolved at verify
  time.
- **Floating support:** a fixed WhatsApp FAB (`.fab-wa`, bottom-inline-end) opens
  `wa.me/213659401338` — the WhatsApp glyph on a brand-green circle with a soft
  attention halo and hover lift. Styled in `app.css`; the pulse self-disables
  under `prefers-reduced-motion` (handled globally in `tokens.css`).
- **Gaps:** the FR side of the language toggle is disabled with a «قريباً» badge.

### OTP screen

- **Component:** [`auth/OtpScreen.jsx`](../src/components/auth/OtpScreen.jsx)
  (6 digit boxes, resend countdown, change-email).
- **Mutations:** `api.verifyOtp(email, code)` via `AuthFlow.verify` — success
  sets the session and lands on the queue; the `unknown-email` error routes to
  the apply form; other errors surface inline. `api.requestOtp` again on resend.
- **Rules:** code must be 6 digits (mock accepts any 6).

### Join request (apply) + under review

- **Components:** [`auth/ApplyForm.jsx`](../src/components/auth/ApplyForm.jsx)
  (SELLER-2 enrollment payload: shop name, wilaya, phones, address, owner,
  brand chips, and an **optional** store location picked on an interactive map
  — [`auth/LocationPicker.jsx`](../src/components/auth/LocationPicker.jsx),
  Leaflet + OpenStreetMap, geolocation button + draggable pin — persisted as a
  `maps?q=lat,lng` URL in `mapsUrl` so settings/seed stay unchanged),
  [`auth/UnderReview.jsx`](../src/components/auth/UnderReview.jsx).
- **Reads:** `api.getMeta()` (brand chips, wilayas).
- **Mutations:** `api.applyShop(payload)` — creates a `review`-status shop and a
  session; `App.jsx` then renders `UnderReview`. `signOut` is the only exit.

---

## Shell (all signed-in screens)

- **Components:** [`shell/AppShell.jsx`](../src/components/shell/AppShell.jsx),
  [`shell/Header.jsx`](../src/components/shell/Header.jsx),
  [`shell/Sidebar.jsx`](../src/components/shell/Sidebar.jsx),
  [`shell/MobileNav.jsx`](../src/components/shell/MobileNav.jsx),
  [`shell/R2Banner.jsx`](../src/components/shell/R2Banner.jsx).
- **Reads:** `route`, `shop` (R2 state), `isOwner`, `perms`, `mode`; badge
  counts from `getTasks` / `getOffers` (status `sent`) / `getOrders` (stage ≠
  `done`), refreshed on navigation and after mutations via the `onData` callback
  each screen receives.
- **Rules:**
  - Sidebar items are permission-gated for staff (`pricing` gates queue /
    quotes / deliveries, `payout` gates payouts); the owner sees all. The nav
    model (`SELL` in `Sidebar.jsx`) is shared with the phone shell: at ≤900px
    the sidebar hides and `MobileNav` renders the same gated items as a fixed
    bottom tab bar (`.mnav`, testids `mnav-*`).
  - **The shell must never overflow horizontally** — in RTL an overflowing
    page shifts leftward and mis-anchors every `position: fixed` overlay
    (account popup, toasts). ≤560px the header keeps the MT AUTO wordmark +
    avatar-only account chip; the phone e2e project asserts the invariant.
  - The account area (settings / team / activity) is **not routed** — it opens
    as a blurred-backdrop popup (see «Account area» below). `openAccountModal`
    ignores staff calls, and the header renders the popup for the owner only.
  - Staff see a persistent navy strip explaining the permission model; the R2
    banner renders above every sell screen while `shop.r2.active`.
  - Header account menu: owner → the three account-area popups + sign-out;
    staff → a read-only permissions summary + sign-out.
  - The البيع ⇄ الشراء header toggle switches the whole app; buy mode renders
    `BuyLanding` full-width with **no sidebar**, and the choice persists across
    reloads (`mtseller.mode` in localStorage).

## طابور التسعير — Queue (`route: queue`, default)

- **Component:** [`screens/Queue.jsx`](../src/components/screens/Queue.jsx) with
  [`queue/RequestCard.jsx`](../src/components/queue/RequestCard.jsx),
  [`queue/BrandFilter.jsx`](../src/components/queue/BrandFilter.jsx),
  [`queue/SponsoredRail.jsx`](../src/components/queue/SponsoredRail.jsx).
- **Reads:** `api.getTasks()` (anonymised `seller_task_v` rows — zero buyer
  identity), `api.getOrders()` (to surface a priority "مطلوب فيديو" strip when a
  won order has `proofStatus === 'بانتظار'`), `api.getOffers()` (tasks with a
  live `sent` offer render as already priced), `api.getMeta().carBrandGroups`
  (brand filter — tapping a country heading selects/clears every brand in that
  group), `api.getAds()` (sponsored rail carousel); `ageLabel` from
  `format.js` for card ages.
- **Mutations:** none directly — opens `OfferModal` (submit) and `VideoModal`
  (proof upload); both refresh via `load()` + `onData`.
- **Rules:** card action state ladder: R2-locked («التسعير موقوف») → already
  quoted → no `pricing` permission → «قدّم عرضك». Brand filter is client-side by
  car make; empty selection shows all.
- **Gaps:** «آخر تحديث الآن» is static copy — there is no polling/refresh timer.

### Offer modal (from Queue and My Offers)

- **Component:** [`modals/OfferModal.jsx`](../src/components/modals/OfferModal.jsx).
- **Reads:** the task (id, part name + OEM ref chip, car, engine),
  `api.getMeta().countries`; live commission preview from `format.js`
  (`rateLabel`, `netEarnings`, `money`) once the price has ≥ 3 digits.
- **Mutations:** `api.submitOffer({ taskId, price, brand, country, buyer_note,
  partNo, commit_agree })`. "أرسِل وسعّر ماركة أخرى" submits and resets the form
  for a multi-brand offer; a plain submit shows the "what happens next"
  confirmation step.
- **Rules (client mirror of `submit_offer`):** price 3–7 digits, brand required
  (new parts only), country required (with an «أخرى» free-text branch), note
  ≤ 240 chars, commitment checkbox gates submit. The mock additionally rejects
  when R2 is active, when the user lacks `pricing`, and dedupes same
  shop + brand + request. Keep the client checks as fast feedback; the server
  owns the rules after swap-in.

## عروضي — My Offers (`route: quotes`)

- **Component:** [`screens/MyOffers.jsx`](../src/components/screens/MyOffers.jsx)
  with [`offers/WonBanner.jsx`](../src/components/offers/WonBanner.jsx),
  [`offers/OffersTable.jsx`](../src/components/offers/OffersTable.jsx),
  [`offers/DeliverToggle.jsx`](../src/components/offers/DeliverToggle.jsx), and
  the pure derivation in [`offers/derive.js`](../src/components/offers/derive.js).
- **Reads:** `api.getOffers()` + `api.getTasks()` + `api.getOrders()`. Stored
  offer statuses are only `sent | won | lost | withdrawn`; `derive.js` maps them
  to the display vocabulary (`submitted`, `won`, `video` — a won offer whose
  linked order still has `proofStatus 'بانتظار'`, `lost`, `withdrawn`), groups
  rows by request (multi-brand groups get a count pill + "+ عرض لعلامة أخرى"),
  and feeds the three stat tiles. The won banner and per-row summaries show the
  commission math from `format.js`.
- **Mutations:** `api.withdrawOffer` (via `WithdrawModal`), `api.submitOffer`
  (add-brand via `OfferModal`), `api.uploadProof` (via `VideoModal` for rows in
  `video` state).
- **Rules:** submission does not guarantee winning; the buyer compares and
  picks. Withdraw/commission rules as below and in the README.
- **Gaps:** the prep/deliver toggle (`DeliverToggle`, on won rows and the won
  banner) only flips **local component state** — it does not call
  `api.markHandover`, so the handover mutation (and the label-code /
  «MT AUTO»-only parcel rule it implements in the mock) has no UI wired to it
  yet. `api.reconfirmOffer` (frozen-offer re-selection) also has no UI.

### Withdraw modal

- **Component:** [`modals/WithdrawModal.jsx`](../src/components/modals/WithdrawModal.jsx).
- **Reads:** the offer's `submittedAt` vs `WITHDRAW_WINDOW_MS` (15 min) from
  `format.js`; `shop.withdraw_warns` for the strike copy (seeded at 1).
- **Mutations:** `api.withdrawOffer(offerId)`, then `refreshShop()` so R2 state
  propagates.
- **Rules:** free within 15 minutes ("نافذة التصحيح", not counted); later → the
  1st/2nd warning copy, and the **3rd late withdrawal triggers R2** (red final
  copy, pricing locked, support-only recovery — see `R2Banner`).

### Proof-video modal

- **Component:** [`modals/VideoModal.jsx`](../src/components/modals/VideoModal.jsx).
- **Mutations:** `api.uploadProof(orderId)` — marks the proof uploaded, advances
  the order to `handover`, and assigns a label code.
- **Rules:** one continuous take (part from all sides → OEM label → original
  packaging), consent checkbox required; the video is the binding reference in
  any dispute. The 24 h deadline (`VIDEO_WINDOW_MS`) is carried on the order.
- **Gaps:** the record button just flips a boolean — no real capture/upload.

## التسليمات — Deliveries (`route: deliveries`)

- **Component:** [`screens/Deliveries.jsx`](../src/components/screens/Deliveries.jsx).
- **Reads:** `api.getDeliveries()` — confirmed orders with a derived
  `deliveryStatus` (stored `delivery` field, else derived from `stage`:
  video/handover → `pack`, transit → `transit`, done → `delivered`); `isOwner`
  for the dispute panel variant.
- **Mutations:** none — tracking only; handover is confirmed from the My Offers
  won row (see the gap above).
- **Rules:** 4-step tracker (handed to carrier → in transit → inspection →
  paid); `pack` is the only amber (action-needed) pill. Disputed orders park at
  the inspection step: the owner gets a WhatsApp CTA («الفيديو هو المرجع»),
  staff get in-platform-only text with no link. Disputed money never reaches
  Payouts — it stays frozen here as «قيد النزاع».

## الأرباح — Payouts (`route: payouts`)

- **Component:** [`screens/Payouts.jsx`](../src/components/screens/Payouts.jsx).
- **Reads:** `api.getPayouts()` → `{ baseline, rows }` where `baseline` is the
  lifetime received total before the listed rows and each row carries a
  `received` flag; amounts render via `grouped()` from `format.js`.
- **Mutations:** `api.confirmPayoutReceipt(ref)` — the shop attests a `paid`
  transfer actually arrived (modal-confirmed toggle, one-way). Moves the amount
  from «قيد الانتظار» into «إجمالي المدفوعات المستلمة» live.
- **Rules:** row statuses `delivered → collected → paid` (3-step tracker; only
  `paid` is green); `dispute` rows are filtered out entirely. Amounts are the
  seller's **net** (price − commission per `format.js`). Only `paid` rows show
  the receipt toggle, and confirmation cannot be undone from the UI.
- **Note:** the README's swap-in table predates this screen's receipt flow —
  `confirmPayoutReceipt` is listed in `api/index.js`'s boundary comment but not
  in the README table.

## الأداء — Performance (`route: performance`)

- **Component:** [`screens/Performance.jsx`](../src/components/screens/Performance.jsx).
- **Reads:** `api.getPerformance()` (static seed: rating, review count,
  standing, metric tiles, delivered/won counts).
- **Mutations / gaps:** none — read-only seed data; no real analytics.

## الرسائل — Messages (`route: messages`)

- **Component:** [`screens/Messages.jsx`](../src/components/screens/Messages.jsx).
- **Reads:** `api.getMessages()`. **Mutations:** `api.sendMessage(text)`.
- **Rules:** the thread is with the MT team only — never with the buyer (blind
  wall); disputes go through the shop's official line.
- **Gaps:** no unread state, no pagination.

## الشراء — Buy mode (header toggle, not a sidebar route)

- **Component:** [`buy/BuyLanding.jsx`](../src/components/buy/BuyLanding.jsx).
- **Reads:** `api.getWholesaleDemo()` — the demo wholesale search matches the
  seeded catalog by official ref, alias/old/short refs, part name, or vehicle
  name and renders supplier price-range rows.
- **Rules / gaps:** everything except the demo search is static marketing
  content until Path B (المشتريات) ships; the seven purchasing screens are
  specced in the handoff but unbuilt.

## Account area (`accountModal`: `settings` / `team` / `activity`, owner-only)

The owner account area does not route: each header-menu item opens its section
as a centered popup over a blurred backdrop — the `variant="blur"` shell in
[`ui/Modal.jsx`](../src/components/ui/Modal.jsx) (body-scroll lock, focus trap,
✕ / Esc / backdrop-click close, focus returned to the menu trigger; portaled to
`<body>` at z-index 60). `openAccountModal` pairs with `pushState`, so browser
Back closes the popup (and Forward reopens it); a refresh resets to closed.
Host: [`account/AccountModal.jsx`](../src/components/account/AccountModal.jsx);
only the Settings section has footer actions.

### إعدادات الحساب — Settings

- **Component:** [`account/SettingsSection.jsx`](../src/components/account/SettingsSection.jsx)
  — three cards: store info, Google-Maps location, account & login (read-only
  owner email + status pills).
- **Reads:** `shop`, `session.email`, `api.getMeta().wilayas`.
- **Mutations:** `api.updateShop(patch)` (owner-only; validates the whole patch
  before writing). Save/reset live in the modal **footer**, stay disabled until
  a field is dirty, and the fields freeze while the save RPC is in flight.

### الفريق والصلاحيات — Team

- **Component:** [`account/TeamSection.jsx`](../src/components/account/TeamSection.jsx)
  — invite card + seat list with expandable per-seat permission switches.
- **Reads:** `api.getShopUsers()`.
- **Mutations:** `api.inviteTeamMember(email)` — adds an `invited` seat with
  pricing only; the invitee's first OTP login flips the seat to active — and
  `api.updateUserPerms(userId, perms)` (optimistic switch flip, reverted from
  the server list on error).
- **Rules:** the owner seat is fixed («المالك — كل الصلاحيات»); employee seats
  expand to the four switches (pricing / media / payout / team).

### سجل نشاط الموظفين — Activity log

- **Component:** [`account/ActivitySection.jsx`](../src/components/account/ActivitySection.jsx).
- **Reads:** `api.getActivityLog()` — the mock throws for non-owners, mirroring
  the owner-only menu entry and the `openAccountModal` guard.
- **Rules:** rows are **staff actions only** (owner actions never listed), each
  attributed (`who` / `act` / `target` / `meta` / `time`) with a status dot per
  action kind (quote / message / delivery / withdraw / other).
- **Gaps:** reads a static seed (`seed.activityLog`), not the live `db.events`
  audit trail the mock's `logEvent` appends to — new mutations do not appear in
  the list.

---

## Dev mode (browse-anywhere)

- **Shown when:** a 🛠️ launcher pinned to the inline-start edge (vertically
  centred) is **always visible** —
  [`components/dev/DevPanel.jsx`](../src/components/dev/DevPanel.jsx). Clicking it
  switches dev mode **on**; the dev behaviours (no-OTP sign-in, full nav panel)
  stay **off until that click**, so the launcher's presence is the only change to
  a normal visit and the e2e suite (which never clicks it) is unaffected.
- **Enable / disable:** click the launcher, or `?dev` (`?dev=1`) in the URL /
  `?dev=0` to force off, or the **Ctrl/⌘+Shift+D** shortcut. The choice persists
  in `localStorage` (`mtseller.devmode`). State + hook live in
  [`lib/devmode.js`](../src/lib/devmode.js).
- **What it does:** the floating panel signs in without OTP (as owner `u_owner`
  or employee `u_emp_1`) via the mock-only `api._devSignIn(userId)` helper — a
  `_`-prefixed debug method alongside `_debugSetR2`, feature-detected so the real
  adapter (which never fabricates a session client-side) simply hides those
  buttons. It then drives the store's own `navigate` to reach every routed screen
  (including `performance` / `messages`, which the sidebar doesn't list),
  `openAccountModal` for the owner popups, `setMode` for buy ⇄ sell, and
  `_debugSetR2` + `refreshShop` to toggle the R2 restriction. No parallel code
  path — it calls the same store actions the product does.
- **Reads / mutations:** `session`, `route`, `mode`, `shop.r2`; store `signIn`,
  `signOut`, `navigate`, `openAccountModal`, `setMode`, `refreshShop`.

---

## E2E coverage

Two Playwright projects (see `playwright.config.js`): desktop Chrome runs
`smoke.spec.js`, and a Pixel-7 phone project runs
[`e2e/mobile.spec.js`](../e2e/mobile.spec.js) (3 tests) — no horizontal
overflow on the landing and dashboard, hero-card badge integrity, bottom
tab-bar navigation, and account-popup anchoring/closing on a phone.

[`e2e/smoke.spec.js`](../e2e/smoke.spec.js) (33 tests) drives: the landing
sections top-to-bottom, both auth paths (known → OTP → queue, unknown → apply),
Google sign-in, offer submit validation ladder, brand filter, sponsored rail,
My Offers derivation/commission-tier/withdraw-strike matrix (including the
3rd-strike R2 lock), Deliveries pills/progress/dispute (owner vs staff),
Payouts totals/receipt confirmation, buy-mode toggle + persistence + demo
search, the activity log (owner reach + staff denial), and the account-area
popups (Esc / backdrop / ✕ / browser-Back close semantics, double-Esc safety,
scroll lock + focus return, settings footer dirty-gating, team invites and
permission switches).
