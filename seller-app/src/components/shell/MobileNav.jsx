import { useApp } from '../../state/store.jsx'
import { SELL } from './Sidebar.jsx'

// Bottom tab bar for phone widths (≤900px, where the sidebar is hidden).
// Same nav model and permission gating as the sidebar — SELL is the single
// source; only the presentation differs. Hidden on desktop via CSS (.mnav).
const ICONS = {
  queue: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12.6 3.5H19a1.5 1.5 0 0 1 1.5 1.5v6.4a2 2 0 0 1-.59 1.42l-7.09 7.09a2 2 0 0 1-2.83 0l-4.9-4.9a2 2 0 0 1 0-2.83l7.09-7.09a2 2 0 0 1 1.42-.59z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="15.8" cy="8.2" r="1.4" fill="currentColor" />
    </svg>
  ),
  quotes: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3.5h10A1.5 1.5 0 0 1 18.5 5v15l-3.25-2-3.25 2-3.25-2-3.25 2V5A1.5 1.5 0 0 1 7 3.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9 8.5h6M9 12h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  deliveries: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3.5 7.5h10v9h-10zM13.5 10h3.6l3.4 3.2v3.3h-7z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="18.5" r="1.7" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="18.5" r="1.7" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  payouts: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="6.5" width="17" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 10.5h17" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.5" cy="14.75" r="1.3" fill="currentColor" />
    </svg>
  ),
}

export default function MobileNav({ counts }) {
  const { route, navigate, isOwner, perms } = useApp()
  const items = SELL.filter((i) => isOwner || !i.perm || perms[i.perm])

  return (
    <nav className="mnav" aria-label="تنقّل الجوال">
      {items.map((i) => {
        const n = i.badge ? counts[i.badge] : null
        return (
          <button
            key={i.name}
            className={route.name === i.name ? 'active' : ''}
            onClick={() => navigate(i.name)}
            data-testid={`mnav-${i.name}`}
          >
            {ICONS[i.name]}
            {i.short || i.label}
            {n ? <span className={`count ${i.tone || 'grey'}`}>{n}</span> : null}
          </button>
        )
      })}
    </nav>
  )
}
