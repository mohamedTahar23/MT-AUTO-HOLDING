import { scrollToSignin } from './bits.jsx'

const STEPS = [
  ['01', 'إذا توفّرت لديك القطعة قدّم عرضك.'],
  ['02', 'إن اختير عرضك، وثّق القطعة وتغليفها بفيديو واحد متواصل.'],
  ['03', 'بعد تأكيد المشتري، سلّم الطرد لشركة التوصيل وعليه الكود وعبارة «MT AUTO».'],
  ['04', 'المشتري يعاين أمام الفيديو، يدفع، وتقبض.'],
]

/** §4 — the four numbered "كيف يعمل" cards; the last one carries its own sign-in CTA. */
export default function HowItWorks() {
  return (
    <section className="land-sec" id="how">
      <div className="wrap">
        <div className="sec-k start">كيف يعمل</div>
        <div className="how">
          {STEPS.map(([n, t], i) => (
            <div className="card card-pad" key={n}>
              <div className="n">{n}</div>
              <div style={{ marginTop: 6, fontWeight: 700, color: 'var(--navy-850)' }}>{t}</div>
              {i === STEPS.length - 1 && (
                <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={scrollToSignin}>
                  تسجيل الدخول
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
