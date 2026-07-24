import { useEffect, useState, useCallback } from 'react'
import { useApp } from '../../state/store.jsx'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import MobileNav from './MobileNav.jsx'
import R2Banner from './R2Banner.jsx'
import { SCREEN_COMPONENTS } from '../screens/registry.jsx'
import ComingSoon from '../screens/ComingSoon.jsx'
import BuyLanding from '../buy/BuyLanding.jsx'

// Routed full-page screens come from the shared registry (screens/registry.jsx)
// — the single source of truth the dev menu also reads, so a new screen added
// there is instantly both routable and listed in DevPanel. The owner account
// area (settings / team / activity) is NOT routed — it opens as a blurred popup
// from the header account menu (store.accountModal → AccountModal).

export default function AppShell() {
  const { api, route, shop, isOwner, mode } = useApp()
  const [counts, setCounts] = useState({ queue: 0, quotes: 0, deliveries: 0 })

  const loadCounts = useCallback(async () => {
    const [tasks, offers, orders] = await Promise.all([api.getTasks(), api.getOffers(), api.getOrders()])
    setCounts({
      queue: tasks.length,
      quotes: offers.filter((o) => o.status === 'sent').length,
      deliveries: orders.filter((o) => o.stage !== 'done').length,
    })
  }, [api])

  // Refresh counts on navigation (covers post-mutation updates).
  useEffect(() => {
    loadCounts()
  }, [route.name, loadCounts])

  const Screen = SCREEN_COMPONENTS[route.name]
  const r2 = shop?.r2?.active

  // Buy mode (header toggle) — the wholesale coming-soon landing, full width:
  // a single page with no sidebar shell.
  if (mode === 'buy') {
    return (
      <div className="shell">
        <Header />
        <main className="main buy-main">
          <BuyLanding />
        </main>
      </div>
    )
  }

  return (
    <div className="shell">
      <Header />
      <div className="shell-body">
        <Sidebar counts={counts} />
        <main className="main">
          <div className="main-inner">
            {!isOwner && (
              <div className="strip strip-navy" style={{ marginBottom: 16 }}>
                أنت مسجَّل كموظف. تظهر لك فقط الصلاحيات التي منحك إياها المالك؛ ما لم يُمنح لك لا يظهر إطلاقاً.
                النزاعات تُدار عبر خط المحل الرسمي — رقمك الشخصي لا يصل للمشتري.
              </div>
            )}
            {r2 && <R2Banner reason={shop.r2.reason} />}

            {Screen ? <Screen onData={loadCounts} /> : <ComingSoon title="قريباً" />}
          </div>
        </main>
      </div>
      {/* ≤900px replacement for the hidden sidebar — same model, same gating. */}
      <MobileNav counts={counts} />
    </div>
  )
}
