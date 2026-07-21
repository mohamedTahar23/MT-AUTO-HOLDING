# MT AUTO — Buyer App Documentation

The buyer-facing front door of **MT AUTO**, a reverse marketplace for car parts in
Algeria run by «محل محمد الطاهر لبيع قطع غيار السيارات» (El Hadjar, Annaba). A buyer
describes the part they need; the platform broadcasts the request to a network of
shops, returns up to 3 quotes, films a proof video of the chosen part, ships it, and
the buyer pays **cash on delivery after inspecting the part**. The UI is entirely
right-to-left Arabic.

This app is a faithful React implementation of the Claude Design prototype
`**** MT AUTO - BUYER ***.dc.html` (from the original design bundle), built with the
scope agreed for the first pass: **the front door only** — landing, login, request
wizard, orders list, account, and the assistant chat. The deep order-tracking journey
is stubbed (see [Stubbed / out of scope](#stubbed--out-of-scope)).

> **Path note:** in the `MT-AUTO-HOLDING` GitHub repo the app lives at the repository
> root (`src/`, `e2e/`, `index.html`, …). All paths below are relative to the app
> root. In the original design-handoff workspace the same tree sat under `buyer-app/`.

---

## Architecture

**Stack:** React 18 + Vite, plain JavaScript (no TypeScript), no router, no state
library, no CSS framework. Two plain CSS files carry all styling.

```
index.html                 HTML shell: dir="rtl" lang="ar", Cairo font from Google Fonts
vite.config.js             Vite + @vitejs/plugin-react, dev server on :5173
src/
  main.jsx                 Entry point — mounts <App/> and imports the two stylesheets
  App.jsx                  ★ The heart of the app: all state, all handlers, the derived
                           view-model, and the mocked الميسر reply logic
  data.js                  Constants ported from the prototype: saved vehicles, demo
                           profile, seeded orders, order-status map (BSTAT), the wilaya
                           list with delivery fees, phone/OTP/order-code helpers
  icons.jsx                Small shared SVG icon components (stroke-based, currentColor)
  styles/
    site.css               ★ Copied VERBATIM from the design bundle's site.css —
                           the single source of visual truth (~2100 lines)
    extra.css              The design file's inline <head> styles: الميسر chat panel,
                           floating action button, typing-dots animation
  components/
    Header.jsx             Sticky navy header: brand, nav, "اطلب قطعتك" CTA; shows
                           "طلباتي" + account chip only when logged in
    Landing.jsx            Marketing page: hero, how-it-works (4 steps), FAQ (6 items),
                           visit-us section with embedded Google map, and a {children}
                           slot where the account section is injected between hero and
                           how-it-works
    AccountSection.jsx     ★ The #account section — renders EITHER the login card
                           (logged out: phone → OTP) OR the 3-step request wizard
                           (logged in). Contains VehicleStep, PartStep, DetailsStep,
                           and the "sent" confirmation
    OrdersHub.jsx          Full-screen «طلباتي» overlay: order cards with status chips,
                           reorder / maintenance-reminder actions, empty state, and the
                           stubbed order-journey tracker
    Modals.jsx             Four modals: Contact, Terms (doubles as the submit gate),
                           Account (stats + vehicles + profile), EditProfile
    MobileMenu.jsx         Slide-in sheet for small screens
    Footer.jsx             Social links + footer
    Assistant.jsx          الميسر chat: FAB, panel, suggestion chips, typing indicator,
                           WhatsApp escalation links
e2e/
  smoke.mjs                Playwright end-to-end smoke test (31 assertions, see below)
```

**How it fits together.** `App.jsx` owns a single state object (`useState`) and passes
one `app` bag — `{ s, vm, ...handlers }` — down to every component:

- `s` is the raw state (step, login stage, form fields, orders, open/closed flags…).
- `vm` is a memoized **view-model** derived from `s` — booleans like `isPartStep`,
  computed strings like the order summary (`sumV`, `sumP`, `sumPhotos`), and mapped
  collections (orders decorated with status-chip colors, saved vehicles with `on`
  selection flags). This mirrors the prototype's `renderVals()` method one-to-one,
  which makes it easy to diff behavior against the original design file.
- Components are almost purely presentational; nearly every interaction calls a
  handler defined in `App.jsx`.

There is no routing: which "screen" you see is a function of state
(`loggedIn`, `step: 'vehicle' | 'part' | 'details' | 'sent'`, `hubOpen`, modal flags).

---

## The buyer flow (what a user experiences)

1. **Landing** — navy hero ("صِف القطعة التي تحتاجها سيّارتك — ونحن نتكفّل بالباقي"),
   trust tiles (cash on delivery, hard-to-find parts, quotes from all of Algeria),
   how-it-works, FAQ, and the shop's location/map. The `#account` section sits right
   below the hero.

2. **Login (`#account`, logged out)** — buyer enters a phone number (validated as an
   Algerian mobile: `0[5-7]` + 8 digits). "أرسِل رمز الدخول" generates a 6-digit code
   and switches to the OTP stage, which shows the code in an amber demo banner
   ("للتجربة فقط — رمزك هو …"). Entering ≥4 digits enables "دخول إلى حسابي".
   Successful verify seeds the account: profile (كريم بن عيسى, عنابة/الحجار), two
   saved vehicles (Kia Picanto 2018, Kia Rio 2016), and two historical orders.

3. **Request wizard (logged in)** — a 3-node stepper: **السيارة → القطعة → الإرسال**.
   Above it, a warning card frames the service ("if the part is easy to find near
   you, this service is not for you").
   - **Step 1 — السيارة:** pick a saved vehicle (radio-style cards, first one
     preselected after login), or enter another car: simulated carte-grise scan
     (1.1 s "reading…" then autofills Picanto data), VIN field (uppercased,
     17-char cap, requires an "I confirm the VIN is correct" checkbox once ≥11
     chars), or manual make/model/year/fuel. Optional: engine code, car note.
     Continue requires either a confirmed VIN or make+model+year.
   - **Step 2 — القطعة:** part name (any language, "photo and description suffice"),
     up to 4 photo slots, an ECU-not-supported notice, optional part reference
     number / preferred + alternate brand / quantity / free note (the placeholder
     shows Darija examples). "+ أضف قطعة أخرى" banks the current part and clears the
     form so multiple parts ride one request. Continue requires ≥1 banked part, a
     name, or a photo.
   - **Step 3 — الإرسال:** read-only summary (car / parts / photo count) with
     "تعديل" links jumping back to the right step, then delivery details: first/last
     name, a simulated "حدّد موقعي تلقائياً" geo-detect (1 s → عنابة/البوني), wilaya
     select (26 seeded wilayas with home/desk delivery fees), commune.
   - **Terms gate:** "مراجعة الطلب وإرساله" opens the Terms modal — the buyer must
     tap "قرأتُ وأوافق على الشروط" and only then does the order submit. (This ordering
     — terms at the very end, gating submit — is deliberate; it comes from the
     `MT-BUYER-FLOW-FINAL.md` planning doc that superseded earlier flows.)
   - **Confirmation:** green check, order number, and a "تابع الطلب في «طلباتي»"
     button. The new order is prepended to the orders list with status `sourcing`.

4. **Orders hub («طلباتي»)** — a full-screen overlay listing all orders: status chip
   (color-coded), order code, part, car, date. Delivered/complete orders get a footer
   with "اطلب مرة أخرى" (reorder — reopens the wizard prefilled) and, for maintenance
   parts (matched by an Arabic keyword regex: oils, filters, brake pads, belts,
   batteries…), a "تذكير الصيانة" WhatsApp deep link. Tapping an order opens the
   **journey tracker stub** (see below). Empty state prompts starting a first request.

5. **Account** — header chip opens the Account modal: avatar + verified badge,
   order/vehicle counts, vehicle list, "إضافة مركبة" (jumps to a blank vehicle step),
   profile rows with an Edit modal (phone locked — "رقمك مؤكّد"). Logout returns to
   the login card.

6. **الميسر assistant** — floating bot button (bottom-inline-start). Opens a chat
   panel with a welcome message and 4 suggestion chips; replies are currently mocked
   (see below). Human support is one tap away via WhatsApp links in the panel header
   and footer.

---

## Design decisions

- **State-driven single page, no router.** The prototype is one HTML file whose
  "screens" are `sc-if` blocks over a single state object. Mirroring that (one state
  object + derived view-model) keeps the React code diffable against the design file
  and avoids inventing URL structure the design never specified. If deep-linking is
  ever needed, the natural seam is to lift `step`/`hubOpen` into the URL.

- **`site.css` reused verbatim.** The design bundle's stylesheet IS the design
  system — tokens, components, responsive breakpoints, RTL logical properties. Copying
  it unmodified (rather than translating to CSS-in-JS or Tailwind) guarantees pixel
  fidelity and means future design exports can be re-diffed against it. Components use
  its class names (`form-card`, `oflow-*`, `hub-*`, `btn btn-primary`, `modal`, `tk`…)
  plus inline styles only where the prototype itself used inline styles. **Rule of
  thumb: never add layout styles that compete with a site.css class** — that's how the
  one real layout bug during development happened (inline grid on `.how-flow`
  overrode its responsive collapse; fixed by removing the inline styles).

- **Design tokens** (in `:root` of site.css): navy scale `--navy-900 #0A1830` →
  `--navy-700 #1D3F73`, amber `--amber #FF8A1F`, green/red/blue families each with
  `-soft`/`-line`/`-text` variants, radius scale `--r-sm…--r-xl` + `--pill`, shadow
  scale `--sh-sm/md/lg`. WhatsApp green (`#1FA855`/`#0E6B45`) is used for everything
  WhatsApp-related. Amber = primary action & in-progress states; green = done/verified;
  navy = neutral/chrome.

- **RTL/Arabic handling.** `dir="rtl" lang="ar"` on `<html>`; site.css uses logical
  properties (`inset-inline-start`, `margin-inline-end`, …) throughout so no mirroring
  hacks are needed. Latin/numeric content (phone numbers, VIN, order codes, OTP) is
  isolated with `dir="ltr"` + `<bdi>` and the `.num` class (tabular figures). Cairo is
  the only font family, weights 400–900.

- **One `app` prop bag instead of context/prop threading.** With a single stateful
  root and ~10 consumers, a context layer would add indirection without benefit. If
  the app grows screens, `App.jsx` handler groups (login / wizard / hub / chat) are
  already clustered for extraction into hooks.

---

## Mocked vs. real — exact swap-in points

Everything below is intentionally fake, matching the prototype's demo behavior.
All swap points are in **`src/App.jsx`** unless noted.

| Mock | Where | What it does now | Real implementation |
|---|---|---|---|
| **OTP send** | `sendLoginCode` | Generates a random 6-digit code client-side (`newCode()` in `data.js`) and displays it in the UI demo banner | Call your backend to send a WhatsApp OTP; delete the demo banner in `AccountSection.jsx` (`LoginCard`, the amber "للتجربة فقط" block) |
| **OTP verify** | `loginVerify` | Accepts any input ≥ 4 digits (does **not** even compare against the generated code — prototype behavior) | Verify server-side; on success fetch the real profile/vehicles/orders instead of seeding from `data.js` |
| **Account data** | `data.js`: `SAVED_PROFILE`, `SAVED_VEHICLES`, `ACCT_ORDERS` | Hard-coded demo buyer (كريم بن عيسى) with 2 vehicles and 2 orders | Replace with API responses at login time |
| **Order submit** | `submitRequest` | Creates the order client-side and prepends it to local state; code format `MT-XXXX` via `genOrder()` | POST to backend. Note: the platform's planning docs standardize on `MT-YYMMDD-####` (the seeded historical orders use it); the prototype's generator produced the short form and was ported as-is — adopt the long form server-side |
| **Carte-grise scan** | `scanCG` | 1.1 s timeout, then autofills fixed Picanto data | Real image upload + OCR endpoint |
| **Photo upload** | `addPhoto`/`rmPhoto` | Just a counter (max 4) rendering placeholder thumbnails | Real file input + upload; thumbnails in `PartStep` |
| **Geo-detect** | `geoDetect` | 1 s timeout → always عنابة / البوني | `navigator.geolocation` + reverse-geocode to wilaya/commune |
| **الميسر assistant** | `mockReply()` (bottom of `App.jsx`) + `sendChat` | Keyword-matched canned Arabic answers after a 850 ms fake delay | Replace `mockReply` with a call to a **backend proxy** to the Claude API (never call it with an API key from the browser). The full Arabic system prompt the design authored — platform rules, privacy constraints, tone — is preserved in the design bundle file `**** MT AUTO - BUYER ***.dc.html` (the `SYSTEM` constant, lines ≈922–939). Reuse it verbatim |
| **Profile save** | `saveProfile` | Local state only (the prototype also wrote localStorage; dropped as backend-bait) | PUT to backend |

---

## Stubbed / out of scope

- **Order-journey tracker.** Tapping an order in «طلباتي» shows a simple 6-stage
  vertical tracker (`OrderJourneyStub` in `OrdersHub.jsx`) with the current stage
  highlighted. The **full journey is a separate ~1,400-line design**:
  `MT AUTO VIP - Buyer.dc.html` in the design bundle — sourcing with a 48 h countdown,
  up-to-3 quote comparison, part-proof video request (locks the chosen offer, freezes
  the others), proof review with a report-a-problem branch, confirm with rights &
  obligations, delivery tracking, inspect-at-door payment, plus edge states (no
  offers / closed / cancelled / suspended / banned). The buyer-behavior spec for it is
  `MT-BUYER-PORTAL-after-otp.md` in the bundle. This is the highest-value next build.
- **Other platform roles.** Seller, supplier, grossiste, B2B store, and the operator
  console exist only as design prototypes in the original bundle — nothing built.
- **Status flags with no UI yet:** `BSTAT` includes `video`, `confirm`, `delivery`
  states that only ever appear as chips; their screens belong to the journey app.

## Order status vocabulary (`BSTAT` in `data.js`)

| key | chip label | color family |
|---|---|---|
| `sourcing` | قيد المطابقة | amber |
| `quotes` | عروض جاهزة | amber |
| `video` | بانتظار الدليل | amber |
| `confirm` | مؤكّد | navy |
| `delivery` | في الطريق | amber |
| `delivered` | سُلّم | green |
| `complete` | مكتمل | green |

---

## How to run and test

```bash
npm install
npm run dev        # Vite dev server → http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build

# End-to-end smoke test (dev server must be running in another terminal):
npm run test:e2e   # runs e2e/smoke.mjs with playwright-core
```

The e2e test uses `playwright-core` (no bundled browsers) and expects a Chromium
binary at `/opt/pw-browsers/chromium` — **set `CHROMIUM_PATH=/path/to/chrome` to
point it at any local Chrome/Chromium**. It saves step screenshots to `e2e/shots/`
(gitignored).

**What the 31 assertions cover**, in execution order:

1. *Landing (5):* RTL direction, hero headline, login card visible when logged out,
   exactly 4 how-it-works steps, exactly 6 FAQ items.
2. *Login (4):* send button enables only on a valid phone, a 6-digit demo code is
   displayed, the wizard appears after verify, the header gains «طلباتي».
3. *Vehicle step (2):* saved vehicles are offered, continue is enabled with the
   prefilled saved car.
4. *Part step (2 + interactions):* adding a photo renders a removable thumb,
   continue enables once a part name exists.
5. *Details + submit (6):* summary shows the chosen car and part, first name is
   prefilled from the seeded profile, geo-detect completes, review button enables,
   the Terms modal opens as the submit gate, and accepting it yields an `MT-####`
   order number.
6. *Orders hub (3):* three orders listed (2 seeded + 1 new), the new order is first
   with the "قيد المطابقة" chip, the journey stub tracker renders with a current
   stage.
7. *Account (3):* modal shows the profile name and both vehicles; the edit modal's
   phone field is disabled.
8. *Assistant (3):* welcome message, 4 suggestion chips, and a keyword-relevant mock
   reply about the proof video.
9. *Session + layout (3):* logout returns to the login card, no horizontal overflow
   at 390 px width, and no console/page errors (external-resource failures from
   blocked networks are filtered out).

---

## Known quirks

- **Duplicate files at the repo root** (GitHub repo only): an early manual upload
  left copies of some component files (`App.jsx`, `Header.jsx`, …) at the repository
  root. **The live code is exclusively under `src/`** — the build only imports from
  `src/` via `index.html → src/main.jsx`. The root copies are dead weight; safe to
  delete in one commit whenever convenient.
- **Missing hero photo.** The design's hero references `IMG_20251011_101535.jpg`,
  which was not included in the design export. The `url()` layer was removed from
  `.req-hero` in `src/styles/site.css` (a comment marks the spot); the navy gradient
  fallback renders instead. Restore the image + the `url()` layer for the intended
  look.
- **Demo OTP on screen.** By design for the prototype phase — the generated code is
  shown in the UI. Remove the banner when real OTP lands (see the mock table).
- **`loginVerify` accepts any ≥4-digit input.** Inherited from the prototype; the
  demo code shown is decorative. Don't mistake it for a bug report during QA.
- **Google Fonts + Google Maps are external.** In offline/sandboxed environments the
  font falls back to system sans and the map iframe stays blank; both are cosmetic.
  The e2e test already ignores these network failures.
- **Two stylesheets are intentionally not merged.** `site.css` must stay verbatim
  (diffable against future design exports); app-specific additions belong in
  `extra.css`.
- **React StrictMode is on** (`main.jsx`): effects and reducers run twice in dev.
  All state updaters are pure, so this is harmless — keep it that way.
