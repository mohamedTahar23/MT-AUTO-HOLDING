import { useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { Ltr, Spinner } from '../ui/bits.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** §7 — "ابدأ الآن": Google sign-in, «أو» divider, then the email OTP form. */
export default function SigninCard({ onSubmit }) {
  const { api, setSession } = useApp()
  const [email, setEmail] = useState('')
  const [remember, setRemember] = useState(true)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)

  async function send(e) {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setErr('الرجاء إدخال بريد إلكتروني صحيح')
      return
    }
    setErr('')
    setLoading(true)
    try {
      await onSubmit(email.trim().toLowerCase())
    } finally {
      setLoading(false)
    }
  }

  async function google() {
    setGLoading(true)
    try {
      const { session } = await api.signInWithGoogle()
      setSession(session) // App re-routes to the shell on session change
    } finally {
      setGLoading(false)
    }
  }

  return (
    <section className="land-sec" id="signin">
      <div className="auth-card" style={{ margin: '0 auto' }}>
        <div className="eyebrow" style={{ textAlign: 'center' }}>
          ابدأ الآن
        </div>

        <button
          type="button"
          className="btn btn-google btn-block"
          style={{ marginTop: 16 }}
          onClick={google}
          disabled={gLoading}
          data-testid="google-signin"
        >
          {gLoading ? (
            <Spinner dark />
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path
                  d="M21.6 12.23c0-.68-.06-1.36-.19-2.02H12v3.83h5.4a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.74 2.97-4.3 2.97-7.33z"
                  fill="#4285F4"
                />
                <path
                  d="M12 22c2.7 0 4.97-.89 6.63-2.42l-3.23-2.5c-.9.6-2.05.95-3.4.95-2.6 0-4.82-1.76-5.61-4.13H3.05v2.58A10 10 0 0 0 12 22z"
                  fill="#34A853"
                />
                <path d="M6.39 13.9a6 6 0 0 1 0-3.8V7.52H3.05a10 10 0 0 0 0 8.96l3.34-2.58z" fill="#FBBC05" />
                <path
                  d="M12 5.97c1.47 0 2.78.5 3.82 1.5l2.86-2.87A9.97 9.97 0 0 0 12 2a10 10 0 0 0-8.95 5.52l3.34 2.58C7.18 7.73 9.4 5.97 12 5.97z"
                  fill="#EA4335"
                />
              </svg>
              متابعة عبر Google
            </>
          )}
        </button>

        <div className="or-divider">
          <span>أو</span>
        </div>

        <form onSubmit={send} noValidate>
          <div className="field">
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              id="email"
              className={`input ltr ${err ? 'err' : ''}`}
              type="email"
              inputMode="email"
              placeholder="vendeur@mtauto.cloud"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {err && <div className="err-text">{err}</div>}
          </div>
          <label className="check" style={{ marginBottom: 16 }}>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            ابقَ مسجّلاً لمدة 30 يوماً على هذا الجهاز
          </label>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading} data-testid="send-code">
            {loading ? <Spinner /> : 'إرسال رمز الدخول'}
          </button>
        </form>

        <p className="hint" style={{ marginTop: 14, textAlign: 'center' }}>
          وضع التجربة — الرمز <b>123456</b>. جرّب <Ltr>owner@alamine-parts.dz</Ltr> (نشط)، أو أي بريد آخر —
          وبعد تأكيد الرمز ينتقل البريد غير المسجّل إلى نموذج طلب الانضمام.
        </p>
      </div>
    </section>
  )
}
