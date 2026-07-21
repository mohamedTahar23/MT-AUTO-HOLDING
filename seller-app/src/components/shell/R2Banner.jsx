// R2 restricted-state notice. Shown while shops.r2.active — quoting + queue are
// blocked server-side AND hidden client-side; the only path is contacting support.
export default function R2Banner({ reason }) {
  return (
    <div className="strip strip-red" style={{ marginBottom: 18 }} role="alert">
      <div style={{ fontWeight: 900, marginBottom: 4 }}>التسعير موقوف مؤقتاً · بانتظار مراجعة الدعم</div>
      <div>
        أوقفنا التسعير بعد 3 عمليات سحب متأخرة (بعد 15د من تقديم العرض).
        {reason ? ` السبب: ${reason}.` : ''} تواصل مع الدعم لإعادة التفعيل — الرفع يدوي من طرف الفريق.
      </div>
      <a
        className="btn btn-wa btn-sm"
        style={{ marginTop: 10 }}
        href="https://wa.me/213659401338?text=مرحبًا،%20تم%20إيقاف%20التسعير%20في%20حسابي%20وأرغب%20في%20مراجعته."
        target="_blank"
        rel="noreferrer"
      >
        ✆ تواصل مع الدعم
      </a>
    </div>
  )
}
