import { useState } from 'react'
import { Ltr, Spinner } from '../ui/bits.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Condensed marketing landing + sign-in card. (The full prototype landing is
// long-form marketing; this keeps the on-brand hero, the "how it works" arc,
// the commission facts, and the real sign-in entry point.)
export default function LoginGate({ onSubmit }) {
  const [email, setEmail] = useState('')
  const [remember, setRemember] = useState(true)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

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

  function scrollToSignin() {
    document.getElementById('signin')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app-page">
      <div className="landing">
        <header className="landing-head">
          <div className="brand">
            <span className="logo">MT</span> MT AUTO
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginInlineStart: 'auto' }} onClick={scrollToSignin}>
            تسجيل الدخول
          </button>
        </header>

        <section className="hero">
          <div>
            <div className="eyebrow">طلبات قطع غيار من كل أنحاء الجزائر بين يديك.</div>
            <h1>زد مبيعاتك مع MT AUTO</h1>
            <p className="sub" style={{ fontSize: 16 }}>
              تصلك طلبات مجهّلة الهوية، تُسعّرها، وإن اختير عرضك تُصوّر القطعة وتسلّم الطرد للناقل —
              مهمّتك التسعير والتصوير فقط.
            </p>
            <div className="row wrap" style={{ marginTop: 16 }}>
              <button className="btn btn-primary" onClick={scrollToSignin}>
                تسجيل الدخول أو طلب الانضمام
              </button>
              <span className="chip">بِع واشترِ في مكان واحد</span>
              <span className="chip">مهمتك: التسعير والتصوير فقط</span>
            </div>
          </div>

          {/* sample "receipt" preview */}
          <div className="card card-pad">
            <div className="row between center">
              <span className="pill pill-amber">
                <span className="dot" /> طلب تسعير · <Ltr mono>MT-14902</Ltr>
              </span>
              <span className="faint" style={{ fontSize: 12 }}>
                مثال توضيحي
              </span>
            </div>
            <div style={{ fontWeight: 800, color: 'var(--navy-850)', marginTop: 12 }}>
              Alternateur — Hyundai i10 2016
            </div>
            <div className="faint" style={{ fontSize: 12.5, marginBottom: 10 }}>
              <Ltr mono>OEM 37300-03600</Ltr> · الكمية: 1
            </div>
            <div className="hr" />
            <div className="row between">
              <span className="muted">سعرك</span>
              <Ltr mono>18 500 دج</Ltr>
            </div>
            <div className="row between">
              <span className="muted">عمولة MT AUTO −10%</span>
              <Ltr mono>−1 850 دج</Ltr>
            </div>
            <div className="row between" style={{ fontWeight: 900, color: 'var(--navy-850)', marginTop: 4 }}>
              <span>أرباحك</span>
              <Ltr mono>16 650 دج</Ltr>
            </div>
          </div>
        </section>

        <div className="stat-band">
          <div>
            <div className="big">10%</div>
            <div style={{ fontSize: 13, color: '#c7d3e8' }}>
              عمولة على كل مبيعة. بلا رسوم اشتراك. وإذا زاد سعر القطعة عن 50 000 دج تنخفض إلى 6%.
            </div>
          </div>
          <div>
            <div className="big">أنت</div>
            <div style={{ fontSize: 13, color: '#c7d3e8' }}>من يحدّد السعر.</div>
          </div>
          <div>
            <div className="big">نحن</div>
            <div style={{ fontSize: 13, color: '#c7d3e8' }}>
              من يتحمّل التكلفة إن رفض المشتري استلام القطعة بدون سبب.
            </div>
          </div>
        </div>

        <h2 className="h1" style={{ fontSize: 20 }}>
          كيف يعمل
        </h2>
        <div className="how">
          {[
            ['01', 'إذا توفّرت لديك القطعة قدّم عرضك.'],
            ['02', 'إن اختير عرضك، وثّق القطعة وتغليفها بفيديو واحد متواصل.'],
            ['03', 'بعد تأكيد المشتري، سلّم الطرد لشركة التوصيل وعليه الكود وعبارة «MT AUTO».'],
            ['04', 'المشتري يعاين أمام الفيديو، يدفع، وتقبض.'],
          ].map(([n, t]) => (
            <div className="card card-pad" key={n}>
              <div className="n">{n}</div>
              <div style={{ marginTop: 6, fontWeight: 700, color: 'var(--navy-850)' }}>{t}</div>
            </div>
          ))}
        </div>

        {/* sign-in card */}
        <div id="signin" className="auth-card" style={{ margin: '26px auto 0' }}>
          <div className="eyebrow">ابدأ الآن</div>
          <h2 className="h1" style={{ fontSize: 22, marginTop: 6 }}>
            تسجيل الدخول
          </h2>
          <form onSubmit={send} style={{ marginTop: 16 }} noValidate>
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
              {loading ? <Spinner /> : 'إرسال الرمز'}
            </button>
          </form>
          <p className="hint" style={{ marginTop: 14, textAlign: 'center' }}>
            وضع التجربة — الرمز <b>123456</b>. جرّب <Ltr>owner@alamine-parts.dz</Ltr> (نشط) — أو أي بريد آخر
            للانتقال إلى نموذج طلب الانضمام.
          </p>
        </div>

        <footer style={{ textAlign: 'center', marginTop: 34, color: 'var(--faint)', fontSize: 12.5 }}>
          © MT AUTO VIP 2026 — الحجّار، ولاية عنابة.
        </footer>
      </div>

      <a className="fab-wa" href="https://wa.me/213659401338" target="_blank" rel="noreferrer" aria-label="واتساب">
        ✆
      </a>
    </div>
  )
}
