import { useApp } from '../../state/store.jsx'

// "حسابك قيد المراجعة" — post-application pending state.
export default function UnderReview() {
  const { signOut } = useApp()
  return (
    <div className="auth-wrap">
      <div className="auth-card" style={{ maxWidth: 500, textAlign: 'center' }}>
        <div className="brand" style={{ justifyContent: 'center', marginBottom: 16 }}>
          <span className="logo">MT</span> MT AUTO
        </div>
        <div className="pulse-clock" aria-hidden>
          ⏳
        </div>
        <div style={{ marginTop: 16 }}>
          <span className="pill pill-amber">
            <span className="dot" /> قيد المراجعة
          </span>
        </div>
        <h1 className="h1" style={{ marginTop: 12 }}>
          حسابك قيد المراجعة
        </h1>
        <p className="sub">
          استلمنا طلب انضمامك، وفريق MT AUTO يراجع بياناتك الآن وسيتصل بك في أقرب وقت.
        </p>

        <div className="card card-pad timeline" style={{ textAlign: 'start', marginTop: 18 }}>
          <div className="step">
            <span className="b">✓</span>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--navy-850)' }}>استلمنا طلبك</div>
              <div className="faint" style={{ fontSize: 12.5 }}>
                تم الإرسال بنجاح
              </div>
            </div>
          </div>
          <div className="step active">
            <span className="b">•</span>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--navy-850)' }}>قيد المراجعة الآن</div>
              <div className="faint" style={{ fontSize: 12.5 }}>
                عادةً خلال 24–48 ساعة
              </div>
            </div>
          </div>
        </div>

        <div className="strip strip-navy" style={{ marginTop: 14 }}>
          سنُعلمك عبر البريد الإلكتروني وواتساب فور تفعيل حسابك.
        </div>

        <p className="sub" style={{ marginTop: 16 }}>
          لديك سؤال؟{' '}
          <a href="mailto:support@mtauto.cloud">تواصل مع الدعم</a>
        </p>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={signOut}>
          تسجيل الخروج
        </button>
      </div>
    </div>
  )
}
