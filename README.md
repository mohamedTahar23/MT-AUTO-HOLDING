# MT AUTO — Buyer Front-Door (React)

Real implementation of the Claude Design prototype **`project/**** MT AUTO - BUYER ***.dc.html`** — the buyer entry point for the MT AUTO reverse marketplace (Algerian car-parts service, fully RTL/Arabic).

## Stack

- **React 18 + Vite** — no router needed; the design is a single page with state-driven views.
- **`src/styles/site.css`** — copied **verbatim** from the design bundle (`project/site.css`) for pixel fidelity. `src/styles/extra.css` carries the inline `<head>` styles from the design file (الميسر chat panel + FAB).
- Cairo font from Google Fonts, navy `#0A1830` + amber `#FF8A1F` design tokens.

## What's implemented (agreed scope: front-door only)

| Area | Status |
|---|---|
| Marketing landing (hero, how-it-works, FAQ, visit/map, footer, mobile menu) | ✅ |
| Login gate: phone → WhatsApp OTP (demo code shown) → account | ✅ |
| 3-step request wizard: السيارة → القطعة → الإرسال → confirmation | ✅ |
| Carte-grise scan simulation, saved vehicles, VIN confirm, photo slots (max 4), multi-part | ✅ |
| Terms modal as the final submit gate (per MT-BUYER-FLOW-FINAL.md) | ✅ |
| Orders hub «طلباتي» (status chips, reorder, maintenance-reminder WhatsApp link, empty state) | ✅ |
| Account modal (stats, vehicles, profile) + edit-profile modal | ✅ |
| الميسر AI assistant — chat UI complete, **mocked replies** (see below) | ✅ |
| Order journey detail (sourcing → quotes → video proof → confirm → delivery) | 🔶 Stubbed tracker — the full sub-app lives in `project/MT AUTO VIP - Buyer.dc.html`, out of scope for this pass |

## Integration points (when a backend exists)

- **OTP**: `sendLoginCode` / `loginVerify` in `src/App.jsx` — currently generates a demo code shown in the UI (as the prototype does).
- **الميسر assistant**: `mockReply()` at the bottom of `src/App.jsx`. The design called `window.claude.complete` with a full Arabic system prompt (preserved in the design file, lines 922–939); swap `mockReply` for a call to your backend proxy to the Claude API.
- **Orders/profile**: seeded from `src/data.js` (`ACCT_ORDERS`, `SAVED_VEHICLES`, `SAVED_PROFILE`) — same demo data as the prototype.
- **Hero photo**: the design references `IMG_20251011_101535.jpg`, which was missing from the export bundle. The hero falls back to the navy gradient; restore the `url()` layer in `site.css` (`.req-hero`) once the image is available.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run test:e2e   # Playwright smoke test (needs dev server running + Chromium; CHROMIUM_PATH env overrides the binary)
```

The e2e test drives the whole happy path: landing → login/OTP → wizard (saved car → part + photo → delivery details + geo) → terms gate → submit → orders hub → journey stub → account/edit → assistant → logout → mobile-overflow check. 31 assertions.
