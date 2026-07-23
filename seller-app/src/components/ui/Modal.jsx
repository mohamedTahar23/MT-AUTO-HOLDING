import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

// Shared LIFO of every mounted Modal. Esc and the blur focus trap act only on
// the top entry, so if dialogs ever stack (e.g. a screen modal plus the
// account popup) each Esc closes exactly one — last-opened first.
const modalStack = []

/**
 * Generic modal shell: scrim + centered panel + close button.
 *
 * variant="blur" is the account-area popup: blurred fixed backdrop, centered
 * flex-column panel (pinned header/footer, scrolling body), body-scroll lock
 * and a focus trap. `testid` also derives `${testid}-backdrop` / `${testid}-close`;
 * `bodyTestid` lands on the scrollable body root. On close, focus returns to
 * `restoreFocus.current` (falling back to whatever was focused at open).
 */
export default function Modal({
  onClose,
  tag,
  title,
  sub,
  children,
  footer,
  maxWidth = 520,
  testid,
  variant = 'default',
  bodyTestid,
  restoreFocus,
}) {
  const blur = variant === 'blur'
  const panelRef = useRef(null)
  const stackId = useRef({})

  useEffect(() => {
    const id = stackId.current
    modalStack.push(id)
    return () => {
      const i = modalStack.indexOf(id)
      if (i !== -1) modalStack.splice(i, 1)
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (modalStack[modalStack.length - 1] !== stackId.current) return
      if (e.key === 'Escape') return onClose?.()
      // Blur variant: keep Tab cycling inside the panel.
      if (blur && e.key === 'Tab' && panelRef.current) {
        const items = Array.from(panelRef.current.querySelectorAll(FOCUSABLE))
        if (!items.length) {
          e.preventDefault()
          return panelRef.current.focus()
        }
        const first = items[0]
        const last = items[items.length - 1]
        const active = document.activeElement
        if (!panelRef.current.contains(active)) {
          e.preventDefault()
          ;(e.shiftKey ? last : first).focus()
        } else if (e.shiftKey && (active === first || active === panelRef.current)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, blur])

  // Blur variant: lock body scroll and move focus in; undo both on close.
  useEffect(() => {
    if (!blur) return
    const prevFocus = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      const target = restoreFocus?.current || (prevFocus?.isConnected ? prevFocus : null)
      target?.focus?.()
    }
    // restoreFocus is a ref (stable) — run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blur])

  if (blur) {
    const titleId = testid ? `${testid}-title` : undefined
    // Portaled to <body> so the backdrop is a root-level layer (z-index 60)
    // rather than being capped inside an ancestor's stacking context.
    return createPortal(
      <div
        className="blur-scrim"
        data-testid={testid ? `${testid}-backdrop` : undefined}
        onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <div
          className="blur-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          data-testid={testid}
          ref={panelRef}
          tabIndex={-1}
        >
          <div className="blur-head">
            <div className="grow">
              <h2 id={titleId}>{title}</h2>
              {sub && <p className="sub">{sub}</p>}
            </div>
            <button
              type="button"
              className="blur-close"
              onClick={onClose}
              aria-label="إغلاق"
              data-testid={testid ? `${testid}-close` : undefined}
            >
              ✕
            </button>
          </div>
          <div className="blur-body" data-testid={bodyTestid}>
            {children}
          </div>
          {footer && <div className="blur-foot">{footer}</div>}
        </div>
      </div>,
      document.body,
    )
  }

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal" style={{ maxWidth }} role="dialog" aria-modal="true" data-testid={testid}>
        <div className="modal-head">
          <button className="x" onClick={onClose} aria-label="إغلاق">
            ✕
          </button>
          {tag && <span className="tag">{tag}</span>}
          {title && (
            <h2 className="h1" style={{ fontSize: 20, marginTop: tag ? 10 : 0 }}>
              {title}
            </h2>
          )}
          {sub && <p className="sub">{sub}</p>}
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}
