/** §3 — full-bleed navy band: 10% / أنت / نحن. */
export default function StatBand() {
  return (
    <section className="land-band">
      <div className="wrap stat-band">
        <div>
          <div className="big">10%</div>
          <p>عمولة على كل مبيعة. بلا رسوم اشتراك. وإذا زاد سعر القطعة عن 50 000 دج تنخفض إلى 6%.</p>
        </div>
        <div>
          <div className="big">أنت</div>
          <p>من يحدّد السعر.</p>
        </div>
        <div>
          <div className="big">نحن</div>
          <p>من يتحمّل التكلفة إن رفض المشتري استلام القطعة بدون سبب.</p>
        </div>
      </div>
    </section>
  )
}
