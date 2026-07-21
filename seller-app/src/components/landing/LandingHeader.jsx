import { scrollToSignin } from './bits.jsx'

/** §1 — top bar: brand, FR|AR language toggle (AR active), sign-in button. */
export default function LandingHeader() {
  return (
    <header className="land-head">
      <div className="wrap">
        <div className="brand">
          <span className="logo">MT</span> MT AUTO
        </div>
        <span style={{ marginInlineStart: 'auto' }} />
        <div className="lang-toggle" role="group" aria-label="اللغة">
          {/* AR is the only language shipped in the design bundle — FR is pending content. */}
          <button type="button" className="on" aria-pressed="true">
            AR
          </button>
          <button type="button" aria-pressed="false" title="Français — قريباً">
            FR
          </button>
        </div>
        <button className="btn btn-amber-line btn-sm" onClick={scrollToSignin}>
          تسجيل الدخول
        </button>
      </div>
    </header>
  )
}
