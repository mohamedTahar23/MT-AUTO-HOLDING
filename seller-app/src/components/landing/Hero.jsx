import { Ltr } from '../ui/bits.jsx'
import { scrollToSignin } from './bits.jsx'

/** §2 — hero: headline + CTA on the start side, the example pricing card on the end side. */
export default function Hero() {
  return (
    <section className="land-sec land-sec--white">
      <div className="wrap hero">
        <div>
          <div className="eyebrow">طلبات قطع غيار من كل أنحاء الجزائر بين يديك.</div>
          <h1>زد مبيعاتك مع MT AUTO</h1>
          <div style={{ marginTop: 18 }}>
            <button className="btn btn-primary" onClick={scrollToSignin}>
              تسجيل الدخول أو طلب الانضمام
            </button>
          </div>
          <ul className="hero-points">
            <li>بِع واشترِ في مكان واحد</li>
            <li>مهمتك: التسعير والتصوير فقط</li>
          </ul>
        </div>

        {/* Example pricing-request card */}
        <div className="card card-pad hero-card">
          <div className="row between center">
            <span className="row center" style={{ gap: 8 }}>
              <span className="pill pill-amber">
                <span className="dot" /> طلب تسعير · <Ltr mono>MT-14902</Ltr>
              </span>
              <span className="chip chip-static">مثال توضيحي</span>
            </span>
            <span className="faint" style={{ fontSize: 12 }}>
              قبل 3 دقائق
            </span>
          </div>
          <div style={{ fontWeight: 800, color: 'var(--navy-850)', marginTop: 12 }}>
            Alternateur — Hyundai i10 2016
          </div>
          <div className="faint" style={{ fontSize: 12.5, marginBottom: 10 }}>
            <Ltr mono>OEM 37300-03600</Ltr> · الكمية: 1
          </div>
          <div className="hr" />
          <div className="row between center">
            <span className="muted">سعرك</span>
            <span className="price-box">
              <Ltr mono>
                <b>18,500</b> <small>DZD</small>
              </Ltr>
            </span>
          </div>
          <div className="row between center" style={{ marginTop: 10 }}>
            <span className="muted">عمولة MT AUTO</span>
            <Ltr mono>− 10%</Ltr>
          </div>
          <div className="row between center" style={{ fontWeight: 900, color: 'var(--navy-850)', marginTop: 10 }}>
            <span>أرباحك</span>
            <Ltr mono>
              <b>16,650</b> <small style={{ fontWeight: 700, color: 'var(--faint)' }}>DZD</small>
            </Ltr>
          </div>
          <button className="btn btn-ghost btn-block" style={{ marginTop: 14 }} onClick={scrollToSignin}>
            أرسل العرض
          </button>
        </div>
      </div>
    </section>
  )
}
