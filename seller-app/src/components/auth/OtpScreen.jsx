import { useRef, useState } from 'react'
import { Ltr, Spinner } from '../ui/bits.jsx'

// 6-digit email OTP. Mock accepts any 6 digits (demo code: 123456).
export default function OtpScreen({ email, onVerify, onChangeEmail }) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const refs = useRef([])

  const code = digits.join('')

  function setAt(i, v) {
    const d = v.replace(/\D/g, '').slice(-1)
    setDigits((prev) => {
      const next = [...prev]
      next[i] = d
      return next
    })
    if (d && i < 5) refs.current[i + 1]?.focus()
  }
  function onKey(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }
  function onPaste(e) {
    const t = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6)
    if (t) {
      e.preventDefault()
      setDigits(t.padEnd(6, '').split('').slice(0, 6).map((c) => c || ''))
      refs.current[Math.min(t.length, 5)]?.focus()
    }
  }

  async function verify() {
    if (code.length !== 6) return
    setBusy(true)
    setErr('')
    try {
      await onVerify(code)
    } catch (e) {
      setErr(e.message === 'unknown-email' ? 'هذا البريد غير مسجّل.' : 'الرمز غير صحيح أو منتهي الصلاحية')
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card" style={{ maxWidth: 440, textAlign: 'center' }}>
        <div className="eyebrow">MT AUTO VIP</div>
        <h1 className="h1" style={{ marginTop: 8 }}>
          أدخل رمز الدخول
        </h1>
        <p className="sub">
          أرسلنا رمزاً إلى <Ltr>{email}</Ltr>{' '}
          <button className="linklike" onClick={onChangeEmail} style={btnLink}>
            تغيير
          </button>
        </p>

        <div className="otp-boxes" onPaste={onPaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              aria-label={`رقم ${i + 1}`}
              data-testid={`otp-${i}`}
            />
          ))}
        </div>
        <p className="hint">الرمز صالح لمدة 10 دقائق</p>
        {err && <div className="err-text">{err}</div>}

        <button
          className="btn btn-primary btn-block"
          style={{ marginTop: 14 }}
          onClick={verify}
          disabled={busy || code.length !== 6}
          data-testid="verify"
        >
          {busy ? <Spinner /> : 'تأكيد'}
        </button>

        <p className="hint" style={{ marginTop: 14 }}>
          لم يصلك الرمز؟ تحقّق من مجلد الرسائل غير المرغوب فيها. <b>(تجريبي: 123456)</b>
        </p>
      </div>
    </div>
  )
}

const btnLink = {
  border: 0,
  background: 'transparent',
  color: 'var(--amber-text)',
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
}
