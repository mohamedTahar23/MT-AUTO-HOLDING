export default function Landing({ app, children }) {
  const { openContact } = app
  return (
    <>
      <section className="req-hero">
        <div className="wrap">
          <span className="badge">
            <i></i> «بيع قطع غيار السيارات عند محمد الطاهر» —{' '}
            <button className="badge-shop" type="button" onClick={openContact}>محل في الحجار، ولاية عنابة</button>
          </span>
          <h1>صِف القطعة التي تحتاجها سيّارتك — ونحن <span className="hl">نتكفّل بالباقي.</span></h1>
          <p className="lede">إن لم يكن لديك وقت للبحث، أو كنت بعيداً عن محلّات بيع قطع غيار السيارات، أو بحثت طويلاً ولم تجد — فأنت في المكان الصحيح.</p>
          <div className="req-tiles">
            <span className="rt-tile"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" /></svg> الدفع عند الاستلام</span>
            <span className="rt-tile"><svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.8" /><circle cx="18" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="17" r="2.4" stroke="currentColor" strokeWidth="1.8" /><path d="M8 8.5l3 6.5M16 8.5l-3 6.5" stroke="currentColor" strokeWidth="1.6" /></svg> نجد ما يصعب إيجاده</span>
            <span className="rt-tile"><svg viewBox="0 0 24 24" fill="none"><path d="M8.5 3.2 L9.8 2.5 L11.4 1.6 L13.3 1.4 L15.5 1.7 L17.2 1.1 L18.5 1 L18.7 2.9 L18 3.9 L18.5 5.6 L18 7.5 L20 10.2 L19.9 13.8 L21.3 17 L14.2 22.4 L13.3 23 L1.8 13.8 L4.8 11.2 L7 8.5 L6.2 7.5 L8.1 5.1 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg> عروض أسعار من كل أنحاء الجزائر</span>
          </div>
        </div>
      </section>

      {children}

      <section className="section" id="how">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-k">كيف نعمل</div>
            <h2>أربع خطوات، بدون مخاطرة</h2>
          </div>
          <div className="how-flow">
            {HOW.map((h, i) => (
              <div className="how-step" key={i}>
                <div className="how-node" style={h.node}>{h.n}</div>
                <div className="how-card" style={h.card}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 12, marginBottom: 11, ...h.ic }}>{h.icon}</span>
                  <b>{h.t}</b>
                  <p>{h.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="wrap">
          <div className="sec-head"><div className="sec-k">الأسئلة الشائعة</div></div>
          <div className="faq-inline">
            {FAQ.map((q, i) => (
              <details className="qa" key={i}>
                <summary>{q.q} <svg className="qchev" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></summary>
                <div className="qa-a">{q.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="visit">
        <div className="wrap">
          <div className="sec-head"><div className="sec-k">زورونا في المحل</div><h2>تفضّل بزيارة محلّنا</h2></div>
          <div className="visit-grid">
            <div className="map-embed map-embed--lg">
              <iframe title="موقع MT AUTO على خرائط Google" src="https://www.google.com/maps?q=36.8050261,7.7346175&z=16&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
            </div>
            <div className="visit-info">
              <div className="crow"><span className="ci"><svg viewBox="0 0 24 24" fill="none"><path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" /></svg></span><div><b>العنوان</b><span>الحجار، ولاية عنابة — «محل محمد الطاهر لبيع قطع غيار السيارات»</span></div></div>
              <div className="crow"><span className="ci"><svg viewBox="0 0 24 24" fill="none"><path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V18a2 2 0 0 1-2 2A14 14 0 0 1 5 6a2 2 0 0 1 0-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg></span><div><b>الهاتف</b><a href="tel:0659401338" className="num" style={{ color: 'var(--blue)', fontWeight: 800, fontSize: 14, letterSpacing: '.5px' }} dir="ltr">0659 40 13 38</a></div></div>
              <div className="crow"><span className="ci"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span><div><b>الطلب عبر المنصّة</b><span>على مدار الساعة · 7/7</span></div></div>
              <a className="btn btn-primary btn-block" href="https://maps.app.goo.gl/n7Zxd7ayvok8PNaZ6" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' }}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" style={{ flex: 'none' }}><path d="M3 11l18-7-7 18-2.6-7.4L3 11z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>احصل على الاتجاهات</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

const AMBER_NODE = { background: 'linear-gradient(150deg,var(--amber),#FFB35C)', color: 'var(--navy-900)' }
const NAVY_NODE = { background: 'linear-gradient(150deg,var(--navy-800),var(--navy-700))', color: 'var(--amber)' }
const AMBER_IC = { background: 'var(--amber-soft)', color: 'var(--amber-text)' }
const NAVY_IC = { background: 'var(--navy-tint)', color: 'var(--navy-700)' }

const HOW = [
  { n: '1', node: AMBER_NODE, ic: AMBER_IC, t: 'اطلب قطعتك في دقيقة', p: 'صوّر القطعة أو اكتب اسمها، وأكّد رقمك برمز تحقّق.', icon: <svg viewBox="0 0 24 24" width="21" height="21" fill="none"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h1.7l1-1.6h5.6l1 1.6h1.7A1.5 1.5 0 0 1 19 8.5v8A1.5 1.5 0 0 1 17.5 18h-11A1.5 1.5 0 0 1 5 16.5v-8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><circle cx="12" cy="12" r="3.1" stroke="currentColor" strokeWidth="1.7" /></svg> },
  { n: '2', node: NAVY_NODE, ic: NAVY_IC, t: 'تصلك العروض، وتختار الأنسب', p: 'نعرض طلبك على شبكة محلّاتنا، فيصلك أفضل سعر على واتساب.', icon: <svg viewBox="0 0 24 24" width="21" height="21" fill="none"><path d="M4 12.4V5.6A1.6 1.6 0 0 1 5.6 4h6.8a1.6 1.6 0 0 1 1.13.47l6.1 6.1a1.6 1.6 0 0 1 0 2.26l-6.8 6.8a1.6 1.6 0 0 1-2.26 0l-6.1-6.1A1.6 1.6 0 0 1 4 12.4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><circle cx="8.4" cy="8.4" r="1.4" fill="currentColor" /></svg> },
  { n: '3', node: AMBER_NODE, ic: AMBER_IC, t: 'تعاين القطعة بالفيديو', p: 'فيديو حقيقي للقطعة قبل الشحن، لتتأكّد أنها المطابقة لسيّارتك.', icon: <svg viewBox="0 0 24 24" width="21" height="21" fill="none"><rect x="3" y="6" width="13" height="12" rx="2.2" stroke="currentColor" strokeWidth="1.7" /><path d="M16 10.2l4.2-2.4a.6.6 0 0 1 .9.52v7.36a.6.6 0 0 1-.9.52L16 13.8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg> },
  { n: <svg viewBox="0 0 24 24" width="24" height="24" fill="none"><path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>, node: { ...AMBER_NODE, boxShadow: '0 8px 20px rgba(255,138,31,.32)' }, ic: { background: '#fff', color: 'var(--amber-text)', border: '1px solid var(--amber-line)' }, card: { background: 'linear-gradient(155deg,#FFF3E2,var(--card) 78%)', borderColor: 'var(--amber-line)' }, t: 'تستلم، تفحص، ثم تدفع', p: 'تصل إلى بابك، تفحصها أمامك، وتدفع نقداً عند الاستلام.', icon: <svg viewBox="0 0 24 24" width="21" height="21" fill="none"><rect x="3" y="6.5" width="18" height="11" rx="2.2" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.7" /><path d="M6 9.5h.01M18 14.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> },
]

const FAQ = [
  { q: 'ما هي منصة MT AUTO؟', a: 'خدمة من «محل محمد الطاهر لبيع قطع غيار السيارات» — تطلب قطعتك من هنا، نؤكّد رقمك برمز تحقّق، ثم تصلك العروض فتختار الأنسب، ويصلك فيديو للقطعة قبل أن تؤكّد الطلب، ثم نشحنها إليك والدفع نقداً عند الاستلام.' },
  { q: 'من أين تحصلون على القطع؟', a: 'من مخزون المحل، ومن تجّار آخرين.' },
  { q: 'لماذا تطلبون رمز تحقق؟', a: 'لنتأكّد أن رقم هاتفك صحيح ويعمل قبل أن نبدأ البحث — هذا يحمي طلبك ويضمن وصول العرض إليك.' },
  { q: 'كيف أعرف أن القطعة مطابقة قبل أن تصل؟', a: 'يصلك عرض بتفاصيل القطعة، ويمكنك طلب «فيديو للقطعة» لتراها بنفسك قبل أن تؤكّد طلبك.' },
  { q: 'كيف أدفع؟', a: 'نقداً عند الاستلام بعد فحص القطعة.' },
  { q: 'ماذا لو كانت القطعة غير مطابقة؟', a: 'تفحص القطعة عند الباب قبل الدفع. فإن لم تطابق سيارتك أو ما اتّفقنا عليه، لا تدفع شيئاً وتُعاد دون أيّ تكلفة عليك — فالضمان هو الفحص قبل الدفع.' },
]
