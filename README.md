# MT AUTO — Holding

This repository holds the multiple **MT AUTO** web portals — the front-ends of a
reverse marketplace for car parts in Algeria run by
«محل محمد الطاهر لبيع قطع غيار السيارات» (El Hadjar, Annaba). Each app is a
self-contained React + Vite project deployed as its own Cloudflare Worker.

| App | Folder | Live URL |
|---|---|---|
| Buyer | [`buyer-app/`](buyer-app/) | https://mt-auto.mohamedtahar318.workers.dev |
| Seller | [`seller-app/`](seller-app/) | https://mt-auto-seller.mohamedtahar318.workers.dev |

Each app has its own `README.md` (and the buyer app has fuller docs under
`buyer-app/docs/`) covering its stack, scripts, and deployment. Work inside the
relevant app folder — `npm install`, `npm run dev`, `npm run build`, and
`npm run deploy` are run from there.
