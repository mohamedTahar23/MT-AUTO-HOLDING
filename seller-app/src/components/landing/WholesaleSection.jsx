import { Ltr } from '../ui/bits.jsx'
import { Ticks, scrollToSignin } from './bits.jsx'

const CHIPS = ['24410-2M803', '2M810', '2R-2M803', 'TEN CH SPO']

/** §6 — سوق الجملة (قريباً): real-wholesale buying + the parts-search-engine example card. */
export default function WholesaleSection() {
  return (
    <section className="land-sec" id="wholesale">
      <div className="wrap split">
        <div className="split-copy">
          <div className="sec-k start">
            سوق الجملة <span className="pill pill-amber">قريباً</span>
          </div>
          <h2>اشترِ بسعر الجملة الحقيقي.</h2>
          <p style={{ fontWeight: 800, color: 'var(--navy-850)' }}>
            أكبر محرك بحث لقطع غيار السيارات بالجملة — متخصص حالياً في السيارات الكورية.
          </p>
          <p className="muted">نشتري بالسعر الحقيقي للجملة — لا وسيط يرفع الهامش، ولا سعر تجزئة مقنّع.</p>
          <Ticks
            items={[
              'مخزون عدد كبير من تجار الجملة بين يديك.',
              'اشترِ كل ما يحتاجه محلك من مكان واحد وبأفضل الأسعار.',
              'لا حاجة لكثرة المكالمات للبحث عن التوفر ومعرفة الأسعار.',
            ]}
          />
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={scrollToSignin}>
            تسجيل الدخول
          </button>
        </div>

        {/* Parts-search-engine example */}
        <div className="card ws-card">
          <div className="row between center">
            <strong>محرك بحث الجملة</strong>
            <span className="chip chip-static">مثال توضيحي</span>
          </div>

          <div className="ws-search">
            <button className="btn btn-primary btn-sm" type="button" tabIndex={-1}>
              بحث
            </button>
            <span className="ws-input">
              <Ltr mono>24410-2M803</Ltr>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          <div className="ws-chips">
            {CHIPS.map((c, i) => (
              <span className={`chip chip-static ${i === 0 ? 'chip-navy' : ''}`} key={c}>
                <Ltr mono>{c}</Ltr>
              </span>
            ))}
          </div>

          <div className="ws-match">
            <span className="ok" aria-hidden>
              ✓
            </span>
            الرقم الرسمي <Ltr mono>24410-2M803</Ltr> يطابق هذه القطعة
          </div>

          <div className="ws-part">
            <div>
              <div style={{ fontWeight: 800, color: 'var(--navy-850)' }}>
                <Ltr>Tendeur de chaîne</Ltr>
              </div>
              <div className="faint" style={{ fontSize: 12.5 }}>
                يركّب على <Ltr>Sportage 5 · Tucson · Seltos</Ltr>
              </div>
            </div>
            <span className="ws-gear" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
                <path
                  d="M12 4l.9 2.1 2.2-.6 1.1 2 2.2.4-.3 2.3 1.9 1.3-1.3 1.9.9 2.1-2.1.9-.1 2.3-2.3-.1-1.4 1.8-1.9-1.3-2.1.9-1-2.1-2.3-.2.2-2.3-1.8-1.4L5 12l-.9-2.1 2-1.1.2-2.3 2.3.2L10 4.8 12 4z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <div className="ws-price">
            <span>
              <b>Mobis</b> <span className="faint">كوريا الأصلية</span>
            </span>
            <Ltr mono>9,250 — 18,500 دج</Ltr>
          </div>
          <div className="ws-price">
            <span>
              <b>KFM</b> <span className="faint">كوريا النوعية</span>
            </span>
            <Ltr mono>6,200 — 7,400 دج</Ltr>
          </div>

          <div className="faint" style={{ fontSize: 11.5, textAlign: 'center', marginTop: 12 }}>
            الأرقام والأسعار أمثلة توضيحية — السوق يفتح قريباً.
          </div>
        </div>
      </div>
    </section>
  )
}
