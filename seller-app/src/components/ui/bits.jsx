import { useState } from 'react'

/** LTR island for refs / phones / prices inside the RTL document. */
export function Ltr({ children, className = '', mono = false }) {
  return <span className={`ltr ${mono ? 'mono' : ''} ${className}`}>{children}</span>
}

export function Spinner({ dark = false }) {
  return <span className={`spin ${dark ? 'dark' : ''}`} aria-hidden />
}

/** A status pill. `tone` ∈ amber | grey | navy | green | red. */
export function Pill({ tone = 'grey', dot = false, children }) {
  return (
    <span className={`pill pill-${tone}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  )
}

export function Tile({ label, value, navy = false, dotTone }) {
  return (
    <div className={`tile ${navy ? 'navy' : ''}`}>
      <div className="lbl">
        {dotTone && <span className={`dot`} style={{ width: 8, height: 8, borderRadius: 9, background: dotTone }} />}
        {label}
      </div>
      <div className="n">{value}</div>
    </div>
  )
}

/** Copyable OEM reference chip (Réf.). */
export function RefChip({ label = 'Réf.', value, onCopied }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(value)
    } catch {
      /* clipboard blocked — non-fatal in the mock */
    }
    setCopied(true)
    onCopied?.()
    setTimeout(() => setCopied(false), 1400)
  }
  return (
    <button type="button" className="ref-chip" onClick={copy} title="نسخ المرجع">
      <span className="ref-lbl">{label}</span>
      <span className="ref-val">{value}</span>
      <span aria-hidden style={{ color: copied ? 'var(--green)' : 'var(--faint)' }}>
        {copied ? '✓ نُسخ' : '⧉'}
      </span>
    </button>
  )
}

/** MT AUTO logo mark — bold "MT" monogram over the racing-stripe accent.
 *  One flat color via currentColor, so it inherits the brand's navy on the
 *  white headers. Decorative: the adjacent "MT AUTO" wordmark names it. */
export function Logo(props) {
  return (
    <svg viewBox="0 0 248 162" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M0 122 L0 0 L40 0 L59 86 L78 0 L118 0 L118 122 L84 122 L59 96 L34 122 Z" />
      <path d="M128 0 L248 0 L248 30 L204 30 L204 122 L172 122 L172 30 L128 30 Z" />
      <path d="M0 162 L8 162 L16 138 L8 138 Z M16 162 L24 162 L32 138 L24 138 Z M32 162 L40 162 L48 138 L40 138 Z M48 162 L56 162 L64 138 L56 138 Z M64 162 L72 162 L80 138 L72 138 Z M80 162 L88 162 L96 138 L88 138 Z" />
      <path d="M104 162 L248 162 L248 138 L112 138 Z" />
    </svg>
  )
}
