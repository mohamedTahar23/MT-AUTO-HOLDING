/** Shared helpers for the marketing landing sections. */

export function scrollToSignin() {
  document.getElementById('signin')?.scrollIntoView({ behavior: 'smooth' })
}

/** Amber check bullet used by the team / wholesale feature lists. */
export function Ticks({ items }) {
  return (
    <ul className="ticks">
      {items.map((t) => (
        <li key={t}>
          <span className="tick" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}
