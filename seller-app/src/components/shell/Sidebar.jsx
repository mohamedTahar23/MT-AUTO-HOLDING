import { useApp } from '../../state/store.jsx'

// Nav model (sell dashboard — buy mode is a single landing with no sidebar).
// `perm` gates items for staff (owner sees all). `soon` = coming-soon.
const SELL = [
  { name: 'queue', label: 'طابور التسعير', perm: 'pricing', badge: 'queue', tone: 'amber' },
  { name: 'quotes', label: 'عروضي', perm: 'pricing', badge: 'quotes', tone: 'grey' },
  { name: 'deliveries', label: 'التسليمات', perm: 'pricing', badge: 'deliveries', tone: 'amber' },
  { name: 'payouts', label: 'الأرباح', perm: 'payout' },
  { name: 'performance', label: 'الأداء والتقييم' },
  { name: 'messages', label: 'الرسائل' },
  { name: 'feed', label: 'إعلانات MT' },
]

export default function Sidebar({ counts }) {
  const { route, navigate, isOwner, perms } = useApp()

  const items = SELL.filter((i) => isOwner || !i.perm || perms[i.perm])

  return (
    <aside className="sidebar">
      <div className="nav-group-label">
        <span className="dot" style={{ width: 7, height: 7, borderRadius: 9, background: 'var(--amber)' }} />
        {`لوحة المحل — البيع${!isOwner ? ` · موظف` : ''}`}
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
