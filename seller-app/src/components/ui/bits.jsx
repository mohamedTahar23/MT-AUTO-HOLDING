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
