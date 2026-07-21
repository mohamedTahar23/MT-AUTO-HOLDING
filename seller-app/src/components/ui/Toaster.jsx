import { useApp } from '../../state/store.jsx'

/** Renders transient toasts from the store. */
export default function Toaster() {
  const { toasts } = useApp()
  return (
    <div className="toaster" aria-live="polite">
      {toasts.map((t) => (
        <div className={`toast ${t.kind === 'ok' ? 'ok' : t.kind === 'err' ? 'err' : ''}`} key={t.id}>
          {t.text}
        </div>
      ))}
    </div>
  )
}
