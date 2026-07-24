# CLAUDE.md

Working rules for this repo. Read before writing code. Screen-level detail lives
in each app's `docs/UI.md`; architecture background in `buyer-app/docs/BUYER-APP.md`
and `seller-app/README.md` — don't duplicate those here or there.

## How to work — read this first

- **No subagents** unless I explicitly ask. Do the work yourself.
- **One app per session.** Don't open the other app's files unless I ask.
- **Read narrow.** Name the 2–3 files you need before opening anything.
  Never scan the tree or grep the repo to "get oriented" — this file plus
  the app's `docs/UI.md` is the orientation.
- **Load docs on demand**, not upfront: `docs/UI.md` only when touching a
  screen; `BUYER-APP.md` / `seller-app/README.md` only when architecture
  is actually in question.
- **Short replies.** No recap of what you just did, no file listings, no
  summaries of code you didn't change.
 
  
## Repo layout

- `buyer-app/` and `seller-app/` are sibling, fully self-contained apps: each has
  its own `package.json`, lockfile, `vite.config.js`, `playwright.config.js`,
  `wrangler.jsonc`, `e2e/`, and `src/`. Run every npm command from inside the app
  folder, never at the repo root.
- Future portals (supplier, grossiste, operator) get new sibling folders with the
  same shape — model them on `seller-app/`, which has the cleaner internal
  structure (`api/` + `state/` + `lib/` + `components/`).

## Stack

React 18 + Vite 6, plain JavaScript. No TypeScript, no router, no state library,
no CSS framework. "Routing" is state: the buyer app derives screens from one state
object in `App.jsx`; the seller app keeps a `route` object in `state/store.jsx`.
Everything is Arabic RTL (`dir="rtl" lang="ar"`).

## Invariants — do not break

- **`src/styles/site.css` stays verbatim** from the design bundle in both apps —
  it must stay diffable against future design exports. App-specific rules go in
  `buyer-app/src/styles/extra.css`, or in the seller app in
  `src/styles/tokens.css` + `src/styles/app.css` (the "site.css collision
  overrides" block at the end of `app.css` must stay last in the cascade).
- **Use design tokens, never raw hexes**: `--amber #FF8A1F` for the one CTA per
  screen; the navy scale `--navy-900 #0A1830` (darkest) → `--navy-850 #0E2042`
  (headers, dark cards) → `--navy-800` / `--navy-700`. Navy text on amber, never
  white on amber.
- **Business rules live in one place — never reimplement them in a component.**
  Seller app: `src/lib/format.js` (`money`, `grouped`, `commissionRate` /
  `rateLabel` / `commissionAmount` / `netEarnings` — 10% ≤ 50 000 دج, 6% above —
  plus `WITHDRAW_WINDOW_MS` = 15 min and `VIDEO_WINDOW_MS` = 24 h). Buyer app:
  `src/data.js` (`phoneOk`, `BSTAT` status vocabulary, `MAINT_RE`, `WILAYAS`
  delivery fees, order-code helpers).
- **UI primitives are shared, not re-invented.** Seller app:
  `src/components/ui/bits.jsx` (`Ltr`, `Pill`, `Tile`, `RefChip`, `Spinner`) plus
  `Modal` / `Stepper` / `Toaster` in the same folder. Buyer app: `src/icons.jsx`
  and the site.css class vocabulary (`btn btn-primary`, `form-card`, `modal`, …).
- **The mock-backend seam must hold.** In the seller app, components call `api`
  from `src/api/index.js` (never import `api/mock.js` directly) and reach shared
  state only through `state/store.jsx`. This seam is what makes the real backend
  a one-import swap instead of a rewrite. In the buyer app the seam is the
  handler layer in `App.jsx` + the constants in `data.js` — the exact swap points
  are tabulated in `buyer-app/docs/BUYER-APP.md` ("Mocked vs. real").
- **Ports are fixed**: buyer dev 5173 / preview 4173, seller dev 5174 / preview
  4174. Each app's `playwright.config.js` builds and serves on its own preview
  port — changing a port breaks that app's e2e suite.
- **`wrangler.jsonc` names stay `mt-auto` (buyer) and `mt-auto-seller`** — they
  are the deployed Worker identities.
- **Commit the lockfile whenever `package.json` changes** — CI and Cloudflare run
  `npm ci` / clean installs, which fail on a stale `package-lock.json`.
- **Numbers/refs/phones/VINs sit in LTR islands** (`<Ltr>` in the seller app,
  `dir="ltr"` + `<bdi>` / `.num` in the buyer app); layout uses logical
  properties only.
- **Spare-part names are French, platform-wide.** Every part name the platform
  itself authors — seller-app `api/seed.js` (`part.name`, `partName`), buyer-app
  defaults/examples in `App.jsx` + `data.js` — is a French auto-parts term
  (`Disques de frein avant`, `Amortisseur avant`, `Filtre à huile`, `Kit
  d'embrayage`). Buyers may still *describe* a part in Arabic/Darija + photo in
  the request wizard (that stays), but the stored/displayed name is French. Any
  logic keyed off part-name text must handle French: `MAINT_RE` (buyer `data.js`)
  matches French **and** Arabic keywords, case-insensitively, for exactly this
  reason.

## Workflow

- CI (`.github/workflows/ci.yml`) runs per-app on every PR and push to `main`:
  `npm ci` → build → Playwright e2e. There is **no lint step** and no `lint`
  script in either app.
- **There is no branch protection: a red check does not block a merge.** If CI
  fails on your PR, say so explicitly in the PR — never leave a red check
  uncommented, and never merge over one silently.
- Cloudflare only builds `main`; deploys are `npm run deploy` from each app.

## Documentation rule

Any PR that changes a screen, a business rule, or the seed/data shape must update
the relevant doc **in the same PR**: the app's `docs/UI.md` for screens, state,
and rules; `buyer-app/docs/BUYER-APP.md` / `seller-app/README.md` where they are
the source; and this file if an invariant moves.
