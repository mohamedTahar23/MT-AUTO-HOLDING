import { useApp } from '../../state/store.jsx'

// Nav model. `perm` gates items for staff (owner sees all). `soon` = coming-soon.
const SELL = [
  { name: 'queue', label: 'طابور التسعير', perm: 'pricing', badge: 'queue', tone: 'amber' },
  { name: 'quotes', label: 'عروضي', perm: 'pricing', badge: 'quotes', tone: 'grey' },
  { name: 'deliveries', label: 'التسليمات', perm: 'pricing', badge: 'deliveries', tone: 'amber' },
  { name: 'payouts', label: 'الأرباح', perm: 'payout' },
  { name: 'performance', label: 'الأداء والتقييم' },
  { name: 'messages', label: 'الرسائل' },
  { name: 'feed', label: 'إعلانات MT' },
]
const BUY = [
  { name: 'proc-search', label: 'محرّك البحث', soon: true },
  { name: 'proc-supply', label: 'التموين بأسعار الجملة', soon: true },
  { name: 'proc-submit', label: 'إرسال قائمة' },
  { name: 'proc-requests', label: 'طلباتي' },
]

export default function Sidebar({ counts, mode, setMode }) {
  const { route, navigate, isOwner, perms } = useApp()

  const visibleSell = SELL.filter((i) => isOwner || !i.perm || perms[i.perm])
  const items = mode === 'buy' ? BUY : visibleSell

  return (
    <aside className="sidebar">
      <div className="row" style={{ background: '#f4f6fa', borderRadius: 12, padding: 4, marginBottom: 12 }}>
        {[
          ['sell', 'البيع'],
          ['buy', 'الشراء'],
        ].map(([m, l]) => (
          <button
            key={m}
            className="btn btn-sm"
            style={{
              flex: 1,
              minHeight: 34,
              background: mode === m ? '#fff' : 'transparent',
              color: 'var(--navy-850)',
              boxShadow: mode === m ? 'var(--sh-sm)' : 'none',
            }}
            onClick={() => setMode(m)}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="nav-group-label">
        <span className="dot" style={{ width: 7, height: 7, borderRadius: 9, background: 'var(--amber)' }} />
        {mode === 'buy' ? 'المشتريات — Path B' : `لوحة المحل — البيع${!isOwner ? ` · موظف` : ''}`}
      </div>

      {items.map((i) => {
        const n = i.badge ? counts[i.badge] : null
        return (
          <button
            key={i.name}
            className={`nav-item ${route.name === i.name ? 'active' : ''}`}
            onClick={() => navigate(i.name)}
            data-testid={`nav-${i.name}`}
          >
            {i.label}
            {i.soon ? (
              <span className="count soon">قريباً</span>
            ) : n ? (
              <span className={`count ${i.tone || 'grey'}`}>{n}</span>
            ) : null}
          </button>
        )
      })}
    </aside>
  )
}
