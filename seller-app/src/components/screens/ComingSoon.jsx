import { useApp } from '../../state/store.jsx'

// Placeholder for screens outside the "core seller loop" first build
// (team & permissions, account settings, staff activity log, and the Path-B
// purchasing sub-screens). Each is fully specced in the handoff prototype and
// is a follow-up build. See README §"What's implemented vs. next".
export default function ComingSoon({ title }) {
  const { navigate } = useApp()
  return (
    <>
      <h1 className="h1">{title}</h1>
      <div className="card card-pad" style={{ marginTop: 16, maxWidth: 560 }}>
        <span className="pill pill-amber">
          <span className="dot" /> قيد الإنشاء
        </span>
        <p className="sub" style={{ marginTop: 12 }}>
          هذه الشاشة موثّقة بالكامل في تصميم البائع وستُبنى في المرحلة التالية بعد حلقة البيع الأساسية
          (الطابور · العروض · التسليمات · الأرباح · الأداء).
        </p>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }} onClick={() => navigate('queue')}>
          ← العودة إلى طابور التسعير
        </button>
      </div>
    </>
  )
}
