# MT AUTO — Seller Portal (بوابة البائعين)

React + Vite implementation of the seller side of MT AUTO — the shop-facing web app of the
reverse marketplace for auto parts in Algeria. Built from the Claude Design handoff
(`project/*** MT AUTO - Seller ***.dc.html` + `project/handoff/prompts/03 - Seller Portal.md`),
mirroring the buyer app's structure and design system.

Fully **Arabic RTL**. All backend calls are **mocked** — see [Swap-in points](#swap-in-points-backend).

## Run it

```bash
cd seller-app
npm install
npm run dev        # http://localhost:5174 (buyer app stays on 5173)
npm run build      # production build to dist/
npm run test:e2e   # Playwright smoke test (builds + serves on :4174)
```

First-time e2e locally: `npm run test:e2e:install` to fetch Chromium
(managed environments can point at a system browser via `CHROMIUM_PATH`).

**Demo credentials** — email `owner@alamine-parts.dz` + any 6-digit OTP (e.g. `123456`)
signs into the active demo shop. Any *other* email routes to the shop join-request form,
which lands on the "حسابك قيد المراجعة" state.

## Design tokens

Same generation as the buyer app — the canonical token source is `src/styles/site.css`,
reused verbatim from the design bundle for pixel fidelity:

| Token | Value | Use |
|---|---|---|
| `--navy-900` | `#0A1830` | darkest text, text on amber |
| `--navy-850` | `#0E2042` | headers, headings, dark cards |
| `--amber` / `--amber-h` | `#FF8A1F` / `#F0780A` | the one CTA per screen |
| font | **Cairo** (+ IBM Plex Mono for refs/prices/timers) | |

`src/styles/tokens.css` layers seller-app aliases on top; `src/styles/app.css` holds the
component styles **plus a "site.css collision overrides" block at the end** — site.css defines a
few generic names (`.modal`, `.field .err`, `.wrap`, …) with buyer-page semantics, and those
overrides must stay last in the cascade.

RTL rules per the design reference: root `dir="rtl" lang="ar"`, logical properties only,
every ref/phone/price in a `dir="ltr"` island (`<Ltr>`), `tabular-nums` on all counts,
navy-on-amber (never white-on-amber).

## Structure

```
seller-app/
├─ index.html                 # RTL root, Cairo + IBM Plex Mono fonts
├─ vite.config.js             # dev :5174, preview :4174
├─ playwright.config.js
├─ e2e/smoke.spec.js          # sign-in → queue → offer-modal loop
└─ src/
   ├─ main.jsx / App.jsx      # auth → review → shell routing
   ├─ state/store.jsx         # session, shop, route, toasts (React context)
   ├─ lib/format.js           # money/ages/countdowns + commission model (10%→6% >50k)
   ├─ api/
   │  ├─ index.js             # ★ THE swap-in boundary (see below)
   │  ├─ mock.js              # in-memory adapter enforcing the business rules
   │  └─ seed.js              # demo data shaped like the Data Contract
   ├─ styles/                 # site.css (reused) · tokens.css · app.css
   └─ components/
      ├─ auth/                # LoginGate (landing orchestrator) · Otp · ApplyForm · UnderReview
      ├─ landing/             # the full marketing landing, one component per design section
      ├─ shell/               # AppShell · Header (sell ⇄ buy mode toggle) · Sidebar · R2Banner
      ├─ buy/                 # BuyLanding — الشراء coming-soon page + demo wholesale search
      ├─ screens/             # Queue · MyOffers · Deliveries · Payouts · Performance · Messages
      ├─ modals/              # OfferModal · WithdrawModal · VideoModal
      └─ ui/                  # bits (Ltr/Pill/RefChip/Tile) · Modal · Stepper · Toaster
```

## Business rules implemented (from the handoff spec)

- **Offer** (`submit_offer`): price 3–7 digits · real brand, new parts only · country required ·
  note ≤240 · commitment checkbox gates submit · **multi-brand** = separate competing offer rows,
  deduped per shop+brand.
- **Withdraw** (`withdraw_offer`): free within **15 minutes**; later → strike warnings
  (1st/2nd/3rd copy from the prototype), **3rd late withdrawal → R2** restriction.
- **R2 state**: full-width restriction banner, queue emptied server-side, only path is
  "تواصل مع الدعم"; lift is admin-manual.
- **Proof video** (`upload_proof`): one continuous take (part → packaging), consent required;
  24h window carried on the order.
- **Handover** (`mark_handover`): parcel carries **label code + «MT AUTO» only — no addresses**.
- **Payouts**: net = agreed price − commission (10% ≤50k, 6% above), held (`مجمّد`) until
  delivery, then `مستحق` → `تم` via settlement.
- **Attribution**: every mutation logs an append-only event with `acted_by`
  (owner vs employee, perms gate the pricing/media/payout surfaces).
- **Blind wall**: zero buyer identity anywhere on seller surfaces.

## Swap-in points (backend)

`src/api/index.js` is the **single boundary** — screens never import the mock directly.
To go live against Supabase, write `src/api/supabase.js` with the same method signatures and
change one import. Mapping:

| App method | Real implementation |
|---|---|
| `requestOtp` / `verifyOtp` | `supabase.auth.signInWithOtp` / `auth.verifyOtp` (email OTP) |
| `signInWithGoogle` | `supabase.auth.signInWithOAuth({ provider: 'google' })` + session pickup on redirect (mock: resolves straight to the demo owner) |
| `applyShop(payload)` | RPC `apply_shop` (SELLER-2 enrollment payload) |
| `getTasks()` | `from('seller_task_v').select()` — anonymised, RLS-scoped to the shop |
| `getOffers` / `getOrders` / `getPayouts` | own-rows reads under RLS |
| `submitOffer` | RPC `submit_offer` (server carries `acted_by`, validates + dedupes) |
| `withdrawOffer` | RPC `withdraw_offer` (server owns the 15-min clock + warn counter + R2) |
| `uploadProof` | upload to private `proof-raw` bucket → RPC `upload_proof` |
| `markHandover` | RPC `mark_handover` |
| `reconfirmOffer` | RPC `reconfirm_offer` (frozen-offer re-selection window) |

The mock enforces the same rules client-side so UX states are real; on swap, keep the client
checks as fast-feedback and treat the RPCs as the source of truth.

## What's implemented vs. next

This build covers the **core seller loop**: marketing/login gate → OTP → join request →
under-review → pricing queue → offer modal (multi-brand) → withdraw window → proof video →
handover → deliveries tracking → payouts → performance → messages → announcements → R2 state.

The landing page (`src/components/landing/`) implements **every section of the seller design
page**, top to bottom: header with the FR/AR toggle · hero + example pricing card (MT-14902)
· the نحن/أنت/10% navy band · كيف يعمل (01–04) · فريق المحل (employee invitations + team
card) · سوق الجملة (قريباً + the parts-search-engine example) · sign-in (Google + email OTP)
· contact (address / phone / directions + map-image drop placeholder) · navy "تابعنا" social
footer. Notes: the FR side of the language toggle is disabled with a «قريباً» badge until French content ships;
the map drop-area previews the image client-side only (nothing is uploaded).

The header's **البيع ⇄ الشراء** toggle (persisted) switches the whole app between the sell
dashboard and the **الشراء** coming-soon landing (`components/buy/BuyLanding.jsx`): navy hero,
an interactive demo of the wholesale search engine (matches the seeded catalog by official
ref, alias/old/short refs, part name or vehicle name — `api.getWholesaleDemo()`), the
benefits/methods sections, the 5 buying steps and the sourcing-network banner. Everything
except the demo search is static marketing content until Path B ships.

Remaining screens from the prototype, stubbed as «قيد الإنشاء» pages: team & permissions
(دعوة الموظفين + perms editor), account settings, staff activity log, employee invite
activation, re-confirmation task UI, and the seven Path-B purchasing screens (المشتريات) —
fronted for now by the الشراء landing above. Each is fully specced in `project/handoff/`
and the seller `.dc.html`.

Known open items the handoff says to confirm with the owner (not guessed here): exact
post-15-min withdrawal penalty beyond the 3-warning track, offers grouping when one shop
submits multiple brands, WhatsApp/carrier providers, and the exact commission override rules.
