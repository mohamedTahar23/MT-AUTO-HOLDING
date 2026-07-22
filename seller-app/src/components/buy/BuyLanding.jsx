import { useEffect, useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { Ltr } from '../ui/bits.jsx'

// الشراء — the wholesale coming-soon landing (header Buy mode). Everything on
// the page is static marketing content except the demo search, which matches
// the seeded catalog by ref, alias, part name or vehicle name.

/* ---- tiny inline icons (stroke = currentColor, sized by the CSS) ---- */
const icons = {
  search: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  stock: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8.4 12 4l8 4.4v7.2L12 20l-8-4.4V8.4z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M4 8.4 12 12.8l8-4.4M12 12.8V20" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
  store: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.5 9.5 6 4.5h12l1.5 5M4.5 9.5v9a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-9M4.5 9.5h15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9.5 19.5v-5h5v5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
  nocalls: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8.6 4.5c.5 0 1 .3 1.2.8l1 2.4c.2.5.1 1.1-.3 1.5l-1.2 1.2a12.6 12.6 0 0 0 4.3 4.3l1.2-1.2c.4-.4 1-.5 1.5-.3l2.4 1c.5.2.8.7.8 1.2v2.4c0 .8-.7 1.5-1.5 1.5C10.6 19 5 13.4 4.7 6c0-.8.7-1.5 1.5-1.5h2.4z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M19.5 4.5l-15 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  sheet: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4.5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 9.5h16M9.5 9.5v10M4 14.5h16" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  car: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l1.6-4.6A2 2 0 0 1 8.5 7h7a2 2 0 0 1 1.9 1.4L19 13m-14 0h14m-14 0a2 2 0 0 0-1 1.7V18a1 1 0 0 0 1 1h1.4a1 1 0 0 0 1-1v-.9h9.2v.9a1 1 0 0 0 1 1H20a1 1 0 0 0 1-1v-3.3a2 2 0 0 0-1-1.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="14.8" r="1" fill="currentColor" />
      <circle cx="16" cy="14.8" r="1" fill="currentColor" />
    </svg>
  ),
  network: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="5.5" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="5.5" cy="17.5" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18.5" cy="17.5" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10.9 7.4 6.7 15.6m6.4-8.2 4.2 8.2m-9.6 1.9h8.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  ),
  gear: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 4l.9 2.1 2.2-.6 1.1 2 2.2.4-.3 2.3 1.9 1.3-1.3 1.9.9 2.1-2.1.9-.1 2.3-2.3-.1-1.4 1.8-1.9-1.3-2.1.9-1-2.1-2.3-.2.2-2.3-1.8-1.4L5 12l-.9-2.1 2-1.1.2-2.3 2.3.2L10 4.8 12 4z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

const BENEFITS = [
  { icon: 'stock', title: 'مخزون بين يديك', text: 'مخزون عدد كبير من تجار الجملة بين يديك.' },
  { icon: 'store', title: 'كل شيء من مكان واحد', text: 'اشترِ كل ما يحتاجه محلك من مكان واحد وبأفضل الأسعار.' },
  { icon: 'nocalls', title: 'بلا مكالمات', text: 'لا حاجة لكثرة المكالمات للبحث عن التوفّر ومعرفة الأسعار.' },
]

const METHODS = [
  {
    n: 1,
    icon: 'search',
    title: 'ابحث مباشرة في المحرّك',
    text: 'اكتب رقم المرجع (رسمياً أو قديماً أو مختصراً)، أو اسم القطعة، أو اسم المركبة، أو اختصاراً — تظهر القطعة بسعر الجملة فوراً.',
  },
  {
    n: 2,
    icon: 'sheet',
    title: 'أرسل قائمتك — صورة أو جدول',
    text: 'صوّر ورقتك المكتوبة بخط اليد، أو ارفع ملف Excel أو جدولاً — يحوّلها فريق MT إلى طلب منظّم ويعود إليك بأسعار الجملة لكل قطعة.',
  },
  {
    n: 3,
    icon: 'car',
    title: 'ابحث بالمركبة',
    text: 'أدخل اسم سيارتك (مثل Sportage 5) واستعرض كل القطع المتوافقة معها بأسعار الجملة، دون معرفة أرقام المراجع.',
  },
]

const STEPS = [
  { title: 'اختيار القطع وطلب الأسعار', text: 'ابحث عن قطعك وأضفها إلى القائمة، ثم اطلب عرض السعر.' },
  { title: 'تأكيد التوفّر والأسعار النهائية', text: 'يؤكّد فريق MT AUTO توفّر كل قطعة ويعود إليك بالسعر النهائي.' },
  { title: 'تأكيد الطلب', text: 'تراجع الأسعار النهائية وتؤكّد طلبك بضغطة واحدة.' },
  { title: 'شحن الطلب', text: 'نجهّز طلبك من الموردين ونشحنه إلى محلك.' },
  { title: 'الدفع عند الاستلام', text: 'تدفع نقداً عند استلام البضاعة في محلك.' },
]

/** Normalize a query/ref for matching: uppercase, no spaces/dashes/dots,
 *  Arabic-Indic digits (٠-٩ / ۰-۹) mapped to Western so an Arabic keyboard
 *  layout still matches the Latin refs. */
const norm = (s) =>
  String(s || '')
    .toUpperCase()
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\s\-–—_.]/g, '')

/** Find the demo part matching a query by ref, alias, part name or vehicle. */
function findPart(catalog, query) {
  const q = norm(query)
  if (!q) return null
  return (
    catalog.find((p) => {
      const refs = [p.ref, ...(p.aliases || [])].map(norm)
      if (refs.some((r) => r === q || (q.length >= 4 && r.includes(q)))) return true
      if (q.length >= 3 && norm(p.partName).includes(q)) return true
      return (p.vehicles || []).some((v) => {
        const nv = norm(v)
        return nv === q || (q.length >= 3 && nv.includes(q))
      })
    }) || null
  )
}

export default function BuyLanding() {
  const { api } = useApp()
  const [catalog, setCatalog] = useState([])
  const [q, setQ] = useState('')
  const [result, setResult] = useState({ state: 'idle' }) // idle | hit | miss

  useEffect(() => {
    api.getWholesaleDemo().then(setCatalog)
  }, [api])

  async function search(e) {
    e?.preventDefault()
    const query = q.trim()
    if (!query) return setResult({ state: 'idle' })
    // A fast submit can beat the initial fetch — load the catalog on demand.
    let cat = catalog
    if (!cat.length) {
      cat = await api.getWholesaleDemo()
      setCatalog(cat)
    }
    const part = findPart(cat, query)
    setResult(part ? { state: 'hit', part } : { state: 'miss' })
  }

  return (
    <div className="buy-inner">
      {/* 1 — hero + the interactive demo search */}
      <section className="buy-hero">
        <span className="pill buy-soon-pill">
          <span className="dot" /> الإطلاق قريباً جداً
        </span>
        <h1>اشترِ بسعر الجملة الحقيقي</h1>
        <p className="buy-hero-sub">
          للموردين وتجار الجملة من أكبر محرك بحث لقطع غيار المركبات بالجملة في الجزائر — متخصّص حاليًا في
          السيارات الكورية والباقي قريباً.
        </p>

        <div className="card buy-search">
          <div className="buy-search-eyebrow">
            <span className="buy-try muted">
              لتجربة، اكتب <Ltr mono>2M803-24410</Ltr> أو <Ltr mono>TEN CH SPO</Ltr>
            </span>
            <span className="pill pill-amber">مثال توضيحي — تجربة تفاعلية</span>
          </div>

          <form className="buy-search-row" onSubmit={search}>
            <label className="buy-input">
              {icons.search}
              <input
                data-testid="buy-search-input"
                dir={q ? 'ltr' : 'rtl'}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="مثلاً 24410-2M803 أو TEN CH SPO…"
                aria-label="محرك بحث الجملة"
              />
            </label>
            <button type="submit" className="btn btn-primary" data-testid="buy-search-btn">
              بحث
            </button>
          </form>

          <p className="buy-helper">
            {icons.search} محرّك واحد يبحث بالرقم المرجعي — أو باسم القطعة أو باسم المركبة.
          </p>

          {result.state === 'hit' ? (
            <ResultCard part={result.part} />
          ) : (
            <div className="buy-empty" data-testid="buy-result-empty">
              {result.state === 'miss' ? (
                <>
                  لا نتائج — جرّب رقم المرجع <Ltr mono>24410-2M803</Ltr> أو <Ltr mono>TEN CH SPO</Ltr>.
                </>
              ) : (
                'اكتب رقم مرجع أو اسم قطعة أو مركبة — تظهر القطعة وسعر جملتها فوراً.'
              )}
            </div>
          )}
        </div>
      </section>

      {/* 2 — why buy through MT AUTO */}
      <section>
        <div className="buy-sec-head">
          <h2>
            لماذا الشراء عبر <Ltr>MT AUTO</Ltr>
          </h2>
          <span className="eyebrow">مزايا محرّك الجملة لمحلك</span>
        </div>
        <div className="buy-grid">
          {BENEFITS.map((b) => (
            <div className="card buy-card" key={b.title}>
              <span className="buy-ic">{icons[b.icon]}</span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — the three ways to search & buy */}
      <section>
        <div className="buy-sec-head">
          <h2>
            كيف تبحث وتشتري عبر <Ltr>MT</Ltr>
          </h2>
          <span className="eyebrow">ثلاث طرق — اختر الأنسب إليك</span>
        </div>
        <div className="buy-grid">
          {METHODS.map((m) => (
            <div className="card buy-card" key={m.n}>
              <div className="buy-card-top">
                <span className="buy-ic">{icons[m.icon]}</span>
                <span className="buy-num tnum">{m.n}</span>
              </div>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4 — the five buying steps (1 at the start/right, 5 navy at the end) */}
      <section className="card buy-steps">
        <div className="buy-sec-head">
          <h2>خطوات الشراء</h2>
          <span className="eyebrow">من اختيار القطعة إلى الدفع عند الاستلام</span>
        </div>
        <div className="buy-steps-row">
          {STEPS.map((s, i) => (
            <div className={`buy-step ${i === STEPS.length - 1 ? 'navy' : ''}`} key={s.title}>
              <span className="n tnum">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5 — sourcing-network banner */}
      <section className="buy-banner">
        <span className="buy-ic">{icons.network}</span>
        <div>
          <b>نجمع طلبك من شبكة واسعة من تجّار الجملة والموردين.</b>
          <span>أكثر من مصدر لكل قطعة — لنؤمّن لك أفضل سعر جملة وأضمن توفّر.</span>
        </div>
      </section>

      {/* 6 — footer strip */}
      <section className="card buy-foot">
        <span className="buy-ic">{icons.list}</span>
        آلاف الأرقام المرجعية، وتزداد كلّ أسبوع — بما فيها ما لا تجده في مكان آخر.
      </section>
    </div>
  )
}

/** The demo search hit: matched-ref strip, part row, wholesale supplier rows. */
function ResultCard({ part }) {
  return (
    <div className="buy-result" data-testid="buy-result">
      <div className="ws-match">
        <span className="ok" aria-hidden>
          ✓
        </span>
        الرقم <Ltr mono>{part.ref}</Ltr> يطابق هذه القطعة
        <span className="pill pill-green">رقم رسمي</span>
      </div>

      <div className="ws-part">
        <div>
          <div style={{ fontWeight: 800, color: 'var(--navy-850)' }}>
            <Ltr>{part.partName}</Ltr>
          </div>
          <div className="faint" style={{ fontSize: 12.5 }}>
            تُركّب على <Ltr>{part.vehicles.join(' · ')}</Ltr>
          </div>
        </div>
        <span className="ws-gear" aria-hidden>
          {icons.gear}
        </span>
      </div>

      {part.suppliers.map((s) => (
        <div className="ws-price" key={s.brand}>
          <span>
            <b>
              <Ltr>{s.brand}</Ltr>
            </b>{' '}
            <span className="faint">· {s.origin}</span>
          </span>
          <Ltr mono>{s.range}</Ltr>
        </div>
      ))}

      <div className="buy-note faint">الأرقام والأسعار أمثلة توضيحية — الميزة تُطلق قريباً.</div>
    </div>
  )
}
