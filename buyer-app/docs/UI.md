# Buyer App — Screen Reference (UI.md)

Screen-by-screen map of what exists, what it reads, what it mutates, and what is
stubbed. Architecture, design decisions, the mock-swap table, and the e2e
coverage breakdown live in [`BUYER-APP.md`](BUYER-APP.md) — this file
cross-references rather than repeats them.

**There is no router.** Every "screen" is a render condition over the single
state object `s` in [`src/App.jsx`](../src/App.jsx) (`loggedIn`,
`step: 'vehicle' | 'part' | 'details' | 'sent'`, `hubOpen`, `hubOrder`, modal
flags). Components receive one `app` prop bag — `{ s, vm, ...handlers }` — and
are almost purely presentational; every mutation below is a handler defined in
`App.jsx` that patches `s`. The derived view-model `vm` (memoized in `App.jsx`)
carries all computed display values.

Business-rule constants and helpers live in [`src/data.js`](../src/data.js):
`phoneOk` (Algerian mobile `0[5-7]` + 8 digits), `onlyDigits`, `newCode`,
`genOrder` (`MT-XXXX`), `BSTAT` (order-status vocabulary), `MAINT_RE`
(maintenance-part keywords), `WILAYAS` (26 wilayas with home/desk delivery
fees), `WHATSAPP`, and the seeded demo account (`SAVED_PROFILE`,
`SAVED_VEHICLES`, `ACCT_ORDERS`).

---

## Landing

- **Shown when:** always (it is the page; other screens overlay or embed in it).
- **Components:** [`Landing.jsx`](../src/components/Landing.jsx) (hero,
  how-it-works ×4, FAQ ×6, visit-us + Google-map iframe),
  [`Header.jsx`](../src/components/Header.jsx) (sticky navy header; «طلباتي» +
  account chip render only when `s.loggedIn`),
  [`Footer.jsx`](../src/components/Footer.jsx),
  [`MobileMenu.jsx`](../src/components/MobileMenu.jsx) (slide-in sheet).
- **Reads:** `s.loggedIn`, `s.menuOpen`, `vm.acctName` / `vm.acctInitial`,
  `vm.ordersCount`.
- **Mutations:** `goOrder` (CTA — scrolls to `#account`, or restarts the wizard
  when logged in), `openHub`, `openAcct`, `openContact`, `openTerms`,
  `toggleMenu` / `closeMenu`, `goLogin`.
- **Rules:** none of its own; the «اطلب قطعتك» CTA routes by `loggedIn`.
- **Gaps:** the map iframe and Cairo font are external and blank/fall back
  offline. The hero background photo (the shopfront `IMG_20251011_101535.jpg`)
  is restored in `extra.css`, layered under the navy scrim from site.css; the
  navy gradient still renders as the fallback if the image fails to load.

## Login (`#account`, logged out)

- **Shown when:** `!s.loggedIn`. Rendered by
  [`AccountSection.jsx`](../src/components/AccountSection.jsx) (`LoginCard`),
  injected between the hero and how-it-works via `Landing`'s children slot.
- **Reads:** `s.loginStage` (`'phone' | 'otp'`), `s.loginPhone`, `s.loginCode`,
  `s.loginInput`, `vm.loginSendDisabled`, `vm.loginVerifyDisabled`.
- **Mutations:** `onLoginPhone`, `sendLoginCode` (generates a 6-digit demo code
  client-side and shows it in an amber banner), `onLoginInput`,
  `backLoginPhone`, `loginVerify` (seeds profile, vehicles, and the two
  historical orders from `data.js`, preselects the first saved vehicle),
  `logout` (resets to `INITIAL`).
- **Rules:** `phoneOk` gates the send button. **`loginVerify` accepts any input
  ≥ 4 digits and never compares against the generated code** — inherited
  prototype behavior, not a bug (see BUYER-APP.md "Known quirks").
- **Gaps:** the entire OTP flow is client-side demo behavior; swap points are in
  the BUYER-APP.md mock table.

## Request wizard (logged in): السيارة → القطعة → الإرسال

All three steps render inside `AccountSection.jsx` under a 3-node stepper;
`vm.carStepCls` / `partStepCls` / `detStepCls` drive the stepper states, and
`go(step)` moves between steps.

### Step 1 — Vehicle (`s.step === 'vehicle'`)

- **Reads:** `vm.savedVehicles` (with `on` selection flags), `s.vin`,
  `s.vinConfirm`, `s.make/model/year/fuel/engine/carNote`, `vm.showScan` /
  `showFilled` / `showIdle`, `vm.vehDisabled`.
- **Mutations:** `pickVehicle`, `setVin` (uppercased, alphanumeric, 17-char
  cap), `toggleVinConfirm`, `scanCG` (1.1 s fake carte-grise scan → autofills
  fixed Picanto data), `set('make')` etc., `setYear`.
- **Rules:** continue requires either a VIN with ≥ 11 digits **and** the
  "I confirm the VIN" checkbox, or make + model + year (`vehicleOk` in
  `App.jsx`).

### Step 2 — Part (`s.step === 'part'`)

- **Reads:** `s.parts` (banked parts), `s.pName/pRef/pBrand/pBrandAlt/pQty/pNote`,
  `s.pPhotos`, `vm.canAddPhoto`, `vm.addPartDisabled`, `vm.partNextDisabled`.
- **Mutations:** `addPhoto` / `rmPhoto` (a counter, max 4 — placeholder thumbs,
  no real upload), `addPart` (banks the current part and clears the form for
  multi-part requests), `rmPart`, `setQty`.
- **Rules:** continue requires ≥ 1 banked part, a part name, or a photo
  (`partOk`). ECU units are called out as unsupported in the UI copy.

### Step 3 — Details + submit (`s.step === 'details'`)

- **Reads:** `vm.sumV` / `sumP` / `sumPhotos` (read-only summary with تعديل
  links back to steps), `s.cFirst/cLast/cPhone/cWilaya/cCommune`, `vm.geoLabel`,
  `WILAYAS`, `vm.reviewDisabled`.
- **Mutations:** `geoDetect` (1 s fake geolocate → always عنابة/البوني),
  `set('cFirst')` etc., `startSubmit` (opens the Terms modal with
  `termsGate: true`), `agreeFromTerms` → `submitRequest` (creates the order
  client-side with `genOrder()`, prepends it with status `sourcing`).
- **Rules:** submit requires first + last name, `phoneOk` phone, and a wilaya
  (`detailsOk`), and is **gated behind accepting the Terms modal** — deliberate
  flow order, see BUYER-APP.md. Wilaya choice carries home/desk delivery fees
  from `WILAYAS`.
- **Gaps:** order codes use the prototype's short `MT-XXXX` form; the platform's
  planning docs standardize `MT-YYMMDD-####` (the seeded orders use the long
  form). Flagged in the BUYER-APP.md mock table — adopt the long form
  server-side.

### Confirmation (`s.step === 'sent'`)

- **Reads:** `s.orderNum`.
- **Mutations:** `goToOrders` (opens the hub), `startNewRequest`.

## Orders hub «طلباتي»

- **Shown when:** `s.hubOpen` — a full-screen overlay,
  [`OrdersHub.jsx`](../src/components/OrdersHub.jsx).
- **Reads:** `vm.orders` — each order decorated with `BSTAT` chip label/colors,
  `done` (delivered/complete), `remind` (part name matches `MAINT_RE`), and a
  prebuilt WhatsApp `remindHref`.
- **Mutations:** `closeHub`, `openOrderJourney(o)` / `closeOrderJourney`,
  `reorderOrder(o)` (reopens the wizard prefilled with the order's part name),
  `startNewRequest` (empty state CTA).
- **Rules:** status vocabulary is exactly `BSTAT` in `data.js` — do not invent
  states. Maintenance reminders are keyword-driven by `MAINT_RE`.
- **Gaps:** tapping an order opens **`OrderJourneyStub`** — a simple 6-stage
  vertical tracker. The full journey (48 h sourcing countdown, quote comparison,
  proof-video review, delivery tracking, payment at the door, edge states) is a
  separate ~1,400-line design not yet built; it is the highest-value next build
  (see BUYER-APP.md "Stubbed / out of scope"). `BSTAT` states `video`,
  `confirm`, and `delivery` only ever appear as chips — their screens belong to
  that journey app.

## Account modal + Edit profile

- **Shown when:** `s.acctOpen` / `s.editOpen` —
  [`Modals.jsx`](../src/components/Modals.jsx) (`AccountModal`,
  `EditProfileModal`).
- **Reads:** `vm.acctName` / `acctPhone` / `acctInitial`, `vm.ordersCount` /
  `vehiclesCount`, `vm.vehicles`, `vm.profileRows`.
- **Mutations:** `openAcct` / `closeAcct`, `editProfile` / `closeEdit`,
  `saveProfile` (local state only), `addVehicle` (jumps to a blank vehicle
  step), `logout`.
- **Rules:** the phone field in the edit modal is disabled («رقمك مؤكّد») — the
  verified number is not editable client-side.

## Contact + Terms modals

- **Shown when:** `s.contactOpen` / `s.termsOpen` (`Modals.jsx`).
- **Rules:** the Terms modal doubles as the submit gate — when opened via
  `startSubmit` (`s.termsGate === true`), accepting it fires `submitRequest`;
  opened from the nav it is informational only.

## الميسر assistant

- **Shown when:** always (floating FAB); panel open when `s.chatOpen` —
  [`Assistant.jsx`](../src/components/Assistant.jsx).
- **Reads:** `s.chatMessages`, `s.chatInput`, `s.chatSending`,
  `vm.chatSendDisabled`, `vm.showSuggestions` (4 chips from `SUGGESTIONS`).
- **Mutations:** `toggleChat` (seeds the welcome message on first open),
  `onChatInput`, `sendChat` (user message + 850 ms fake delay + `mockReply`).
- **Rules / gaps:** replies are keyword-matched canned Arabic answers
  (`mockReply` at the bottom of `App.jsx`). The real implementation is a backend
  proxy to the Claude API — never call it with an API key from the browser; the
  full Arabic system prompt is preserved in the design bundle (see the
  BUYER-APP.md mock table). WhatsApp escalation links are live.

## Dev mode (browse-anywhere)

- **Shown when:** a 🛠️ launcher pinned to the inline-start edge (vertically
  centred) is **always visible** — [`DevPanel.jsx`](../src/components/DevPanel.jsx).
  Clicking it switches dev mode **on**; the dev behaviours (auto-login, dropped
  gates, full panel) stay **off until that click**, so the launcher's presence is
  the only change to a normal visit and the e2e suite (which never clicks it) is
  unaffected.
- **Enable / disable:** click the launcher, or `?dev` (`?dev=1`) in the URL /
  `?dev=0` to force off, or the **Ctrl/⌘+Shift+D** shortcut. The choice persists
  in `localStorage` (`mt.devmode`). State + hook live in
  [`devmode.js`](../src/devmode.js).
- **What it does:** turning it on auto-logs-in the demo account (no OTP) and
  drops the wizard validation gates — in `App.jsx` `vm.vehDisabled` /
  `partNextDisabled` / `reviewDisabled` are forced `false` when `dev`, so the
  real «تابع» / «مراجعة» buttons work with empty fields. The floating panel then
  jumps to any wizard step (`devGo` — vehicle / part / details / sent) or opens
  any overlay (`طلباتي`, `حسابي`, `تواصل`, `الشروط`, `المساعد`) through the same
  handlers the product uses — it is not a parallel code path, it only skips the
  gates.
- **Reads / mutations:** `s.loggedIn`, `s.step`; `devLogin`, `devGo`, `logout`,
  and the existing modal openers (all on the `app` prop bag).
