// ---------------------------------------------------------------------------
// Dev mode — a browse-anywhere switch for demos and manual testing.
//
// OFF by default: nothing here changes product behaviour or the e2e suite until
// it is explicitly turned on. Enable with the `?dev` URL param (or `?dev=0` to
// disable) or the Ctrl/⌘+Shift+D shortcut; the choice is remembered in
// localStorage. When on, App.jsx drops the order-flow validation gates and
// renders <DevPanel>, which can log in and jump to any screen/step/modal
// without filling a single field.
// ---------------------------------------------------------------------------
import { useEffect, useState } from 'react'

const KEY = 'mt.devmode'
const listeners = new Set()

function readInitial() {
  if (typeof window === 'undefined') return false
  try {
    const p = new URLSearchParams(window.location.search)
    if (p.has('dev')) {
      const v = (p.get('dev') || '').toLowerCase()
      const on = v !== '0' && v !== 'off' && v !== 'false'
      try { localStorage.setItem(KEY, on ? '1' : '0') } catch { /* storage blocked */ }
      return on
    }
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

let current = readInitial()

export function isDevMode() {
  return current
}

export function setDevMode(on) {
  const next = Boolean(on)
  if (next === current) return
  current = next
  try { localStorage.setItem(KEY, next ? '1' : '0') } catch { /* storage blocked */ }
  listeners.forEach((fn) => fn(next))
}

export function toggleDevMode() {
  setDevMode(!current)
}

// Global keyboard toggle, registered once regardless of how many components
// subscribe (so the combo flips the flag exactly once per press).
if (typeof window !== 'undefined' && !window.__mtDevKey) {
  window.__mtDevKey = true
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'd' || e.key === 'D')) {
      e.preventDefault()
      toggleDevMode()
    }
  })
}

/** Subscribe a component to the dev-mode flag. Returns `[dev, toggleDevMode]`. */
export function useDevMode() {
  const [dev, setDev] = useState(current)
  useEffect(() => {
    const fn = (on) => setDev(on)
    listeners.add(fn)
    fn(current) // resync if the flag changed between render and subscribe
    return () => listeners.delete(fn)
  }, [])
  return [dev, toggleDevMode]
}
