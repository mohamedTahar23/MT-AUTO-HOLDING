import { scrollToSignin } from './bits.jsx'

/** §1 — top bar: brand, FR|AR language toggle (AR active), sign-in button. */
export default function LandingHeader() {
  return (
    <header className="land-head">
      <div className="wrap">
        <div className="brand">MT AUTO</div>
        <span style={{ marginInlineStart: 'auto' }} />
        <div className="lang-toggle" role="group" aria-label="اللغة">
          {/* AR is the only language shipped — FR is disabled until French content exists. */}
          <button type="button" className="on" aria-pressed="true">
            AR
          </button>
          <button type="button" disabled title="Français — قريباً">
            FR
            <span className="soon">قريباً</span>
          </button>
        </div>
        <button className="btn btn-amber-line btn-sm" onClick={scrollToSignin}>
          تسجيل الدخول
        </button>
      </div>
    </header>
  )
}
