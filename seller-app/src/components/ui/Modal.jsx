import { useEffect } from 'react'

/** Generic modal shell: scrim + centered panel + close button. */
export default function Modal({ onClose, tag, title, sub, children, footer, maxWidth = 520, testid }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

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
