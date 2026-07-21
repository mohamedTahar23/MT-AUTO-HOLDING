import { useState } from 'react'
import { api } from '../../api/index.js'
import { Ltr, Spinner } from '../ui/bits.jsx'

const MAPS_RE = /^https?:\/\/(maps\.google\.[a-z.]+|goo\.gl\/maps|maps\.app\.goo\.gl|www\.google\.[a-z.]+\/maps)\//i
const { brandChips, wilayas } = api.getMeta()

// Shop join request (SELLER-2 enrollment payload).
export default function ApplyForm({ email, onSubmit, onBack }) {
  const [f, setF] = useState({
    gShopName: '',
    gWilaya: 'عنابة',
    gPhone1: '',
    gPhone2: '',
    gAddress: '',
    gOwner: '',
    gNif: '',
    gRc: '',
    gChips: [],
    gMapsUrl: '',
  })
  const [touched, setTouched] = useState(false)
  const [mapsOk, setMapsOk] = useState(false)
  const [mapsErr, setMapsErr] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const toggleChip = (c) =>
    setF((p) => ({ ...p, gChips: p.gChips.includes(c) ? p.gChips.filter((x) => x !== c) : [...p.gChips, c] }))

  const required = ['gShopName', 'gPhone1', 'gAddress', 'gOwner']
  const missing = (k) => touched && required.includes(k) && !f[k].trim()

  function verifyMaps() {
    if (MAPS_RE.test(f.gMapsUrl.trim())) {
      setMapsOk(true)
      setMapsErr('')
    } else {
      setMapsOk(false)
      setMapsErr('الرابط غير صالح — ألصق رابط موقعك على خرائط Google.')
    }
  }

  function fillDemo() {
    setF({
      gShopName: 'محل الأطلس لقطع الغيار',
      gWilaya: 'عنابة',
      gPhone1: '0555 55 55 55',
      gPhone2: '',
      gAddress: 'حي المنظر الجميل، الشارع الرئيسي، عنابة',
      gOwner: 'محمد الأطلسي',
      gNif: '',
      gRc: '',
      gChips: ['Volkswagen', 'Peugeot', 'Renault'],
      gMapsUrl: 'https://maps.google.com/?q=Atlas+Auto+Annaba',
    })
    setMapsOk(true)
  }

  async function submit(e) {
    e.preventDefault()
    setTouched(true)
    if (required.some((k) => !f[k].trim()) || !MAPS_RE.test(f.gMapsUrl.trim())) {
      if (!MAPS_RE.test(f.gMapsUrl.trim())) setMapsErr('الرابط غير صالح — ألصق رابط موقعك على خرائط Google.')
      return
    }
    setBusy(true)
    try {
      await onSubmit(f)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card auth-wide">
        <button className="linklike" onClick={onBack} style={{ ...link, marginBottom: 10 }}>
          ‹ تسجيل الدخول
        </button>
        <div className="row between center wrap" style={{ gap: 8 }}>
          <div>
            <h1 className="h1">طلب الانضمام كبائع</h1>
            <p className="sub">يراجع فريق MT AUTO طلبك ويتواصل معك لتأكيد انضمامك كبائع.</p>
          </div>
          <span className="pill pill-grey">
            تتقدّم بصفة <Ltr>{email}</Ltr>
          </span>
        </div>

        <form onSubmit={submit} style={{ marginTop: 18 }} noValidate>
          <h3 style={sec}>1 · معلومات المحل</h3>
          <div className="field">
            <label>
              اسم المحل <span className="req">*</span>
            </label>
            <input
              className={`input ${missing('gShopName') ? 'err' : ''}`}
              placeholder="مثال: محل الأطلس لقطع الغيار"
              value={f.gShopName}
              onChange={(e) => set('gShopName', e.target.value)}
            />
            {missing('gShopName') && <div className="err-text">هذا الحقل مطلوب</div>}
          </div>
          <div className="row wrap">
            <div className="field grow">
              <label>
                الولاية <span className="req">*</span>
              </label>
              <select className="select" value={f.gWilaya} onChange={(e) => set('gWilaya', e.target.value)}>
                {wilayas.map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
            </div>
            <div className="field grow">
              <label>
                هاتف المحل <span className="req">*</span>{' '}
                <span className="pill pill-green" style={{ fontSize: 10 }}>
                  مرتبط بواتساب
                </span>
              </label>
              <input
                className={`input ltr ${missing('gPhone1') ? 'err' : ''}`}
                placeholder="+213 5 55 55 55 55"
                value={f.gPhone1}
                onChange={(e) => set('gPhone1', e.target.value)}
              />
              <div className="hint">نتواصل معك على هذا الرقم عبر واتساب.</div>
            </div>
          </div>
          <div className="row wrap">
            <div className="field grow">
              <label>هاتف آخر (اختياري)</label>
              <input
                className="input ltr"
                placeholder="+213 6 66 66 66 66"
                value={f.gPhone2}
                onChange={(e) => set('gPhone2', e.target.value)}
              />
            </div>
            <div className="field grow">
              <label>
                عنوان المحل <span className="req">*</span>
              </label>
              <input
                className={`input ${missing('gAddress') ? 'err' : ''}`}
                placeholder="الحي، الشارع، البلدية"
                value={f.gAddress}
                onChange={(e) => set('gAddress', e.target.value)}
              />
            </div>
          </div>
          <div className="row wrap">
            <div className="field grow">
              <label>
                اسم صاحب المحل <span className="req">*</span>
              </label>
              <input
                className={`input ${missing('gOwner') ? 'err' : ''}`}
                placeholder="الاسم الكامل"
                value={f.gOwner}
                onChange={(e) => set('gOwner', e.target.value)}
              />
            </div>
            <div className="field grow">
              <label>NIF / RC (اختياري)</label>
              <input className="input ltr" value={f.gNif} onChange={(e) => set('gNif', e.target.value)} />
            </div>
          </div>

          <h3 style={sec}>2 · التخصّص والموقع</h3>
          <div className="field">
            <label>الماركات والسيارات التي تخدمها</label>
            <div className="row wrap" style={{ gap: 8 }}>
              {brandChips.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`chip ${f.gChips.includes(c) ? 'on' : ''}`}
                  onClick={() => toggleChip(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>
              رابط خرائط Google <span className="req">*</span>{' '}
              <span className="pill pill-amber" style={{ fontSize: 10 }}>
                من الأفضل
              </span>
            </label>
            <div className="hint" style={{ marginBottom: 6 }}>
              من الأفضل أن يكون محلك مسجّلاً على خرائط Google — ألصق رابط المحل.
            </div>
            <div className="row" style={{ gap: 8 }}>
              <input
                className={`input ltr grow ${mapsErr ? 'err' : ''}`}
                placeholder="https://maps.google.com/..."
                value={f.gMapsUrl}
                onChange={(e) => {
                  set('gMapsUrl', e.target.value)
                  setMapsOk(false)
                  setMapsErr('')
                }}
              />
              <button type="button" className="btn btn-ghost" onClick={verifyMaps}>
                تحقّق
              </button>
            </div>
            {mapsOk && <div className="err-text" style={{ color: 'var(--green-text)' }}>✓ تم التحقق من الرابط</div>}
            {mapsErr && <div className="err-text">{mapsErr}</div>}
          </div>

          <div className="row between center wrap" style={{ marginTop: 16, gap: 10 }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={fillDemo}>
              ملء الحقول تلقائياً (تجربة)
            </button>
            <button className="btn btn-primary" type="submit" disabled={busy} data-testid="submit-apply">
              {busy ? <Spinner /> : 'إرسال الطلب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const sec = { fontSize: 14, fontWeight: 800, color: 'var(--navy-850)', margin: '18px 0 10px' }
const link = { border: 0, background: 'transparent', color: 'var(--amber-text)', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }
