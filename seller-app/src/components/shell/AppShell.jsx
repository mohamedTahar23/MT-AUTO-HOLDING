import { useEffect, useState, useCallback } from 'react'
import { useApp } from '../../state/store.jsx'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import R2Banner from './R2Banner.jsx'
import Queue from '../screens/Queue.jsx'
import MyOffers from '../screens/MyOffers.jsx'
import Deliveries from '../screens/Deliveries.jsx'
import Payouts from '../screens/Payouts.jsx'
import Performance from '../screens/Performance.jsx'
import Messages from '../screens/Messages.jsx'
import Feed from '../screens/Feed.jsx'
import ComingSoon from '../screens/ComingSoon.jsx'

const SCREENS = {
  queue: Queue,
  quotes: MyOffers,
  deliveries: Deliveries,
  payouts: Payouts,
  performance: Performance,
  messages: Messages,
  feed: Feed,
}
const SOON_TITLES = {
  team: 'الفريق والصلاحيات',
  settings: 'إعدادات الحساب',
  activity: 'سجل نشاط الموظفين',
  'proc-search': 'محرّك البحث عن قطع الجملة',
  'proc-supply': 'التموين بأسعار الجملة',
  'proc-submit': 'المشتريات — إرسال قائمة',
  'proc-requests': 'المشتريات — طلباتي',
}

export default function AppShell() {
  const { api, route, shop, isOwner, session } = useApp()
  const [counts, setCounts] = useState({ queue: 0, quotes: 0, deliveries: 0 })
  const [mode, setMode] = useState('sell')

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

  const Screen = SCREENS[route.name]
  const r2 = shop?.r2?.active

  return (
    <div className="shell">
      <Header />
      <div className="shell-body">
        <Sidebar counts={counts} mode={mode} setMode={setMode} />
        <main className="main">
          <div className="main-inner">
            {!isOwner && (
              <div className="strip strip-navy" style={{ marginBottom: 16 }}>
                أنت مسجَّل كموظف. تظهر لك فقط الصلاحيات التي منحك إياها المالك؛ ما لم يُمنح لك لا يظهر إطلاقاً.
                النزاعات تُدار عبر خط المحل الرسمي — رقمك الشخصي لا يصل للمشتري.
              </div>
            )}
            {r2 && <R2Banner reason={shop.r2.reason} />}

            {Screen ? (
              <Screen onData={loadCounts} />
            ) : (
              <ComingSoon title={SOON_TITLES[route.name] || 'قريباً'} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
