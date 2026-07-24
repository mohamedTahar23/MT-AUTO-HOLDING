import { useState } from 'react'
import { api } from '../../api/index.js'
import { Ltr, Spinner } from '../ui/bits.jsx'
import LocationPicker from './LocationPicker.jsx'

const { brandChips, wilayas } = api.getMeta()

// The store location is picked on a map; persist it as a maps URL so the shop's
// existing `mapsUrl` field (settings, seed) keeps working unchanged.
const geoToMapsUrl = (g) => (g ? `https://www.google.com/maps?q=${g.lat},${g.lng}` : '')

// Shop join request (SELLER-2 enrollment payload).
export default function ApplyForm({ email, onSubmit, onBack }) {
  const [f, setF] = useState({
    gShopName: '',
    gWilaya: 'عنابة',
    gPhone1: '',
    gPhone2: '',
    gAddress: '',
    gOwner: '',
    gChips: [],
    gGeo: null,
  })
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const toggleChip = (c) =>
    setF((p) => ({ ...p, gChips: p.gChips.includes(c) ? p.gChips.filter((x) => x !== c) : [...p.gChips, c] }))

  const required = ['gShopName', 'gPhone1', 'gAddress', 'gOwner']
  const missing = (k) => touched && required.includes(k) && !f[k].trim()

  function fillDemo() {
    setF({
      gShopName: 'محل الأطلس لقطع الغيار',
      gWilaya: 'عنابة',
      gPhone1: '0555 55 55 55',
      gPhone2: '',
      gAddress: 'حي المنظر الجميل، الشارع الرئيسي، عنابة',
      gOwner: 'محمد الأطلسي',
      gChips: ['Volkswagen', 'Peugeot', 'Renault'],
      gGeo: { lat: 36.8055, lng: 7.7346 },
    })
  }

  async function submit(e) {
    e.preventDefault()
    setTouched(true)
    if (required.some((k) => !f[k].trim())) return
    setBusy(true)
    try {
      await onSubmit({ ...f, gMapsUrl: geoToMapsUrl(f.gGeo) })
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
          </div>

          <h3 style={sec}>2 · التخصّص والموقع</h3>
          <div className="field">
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
            <label>موقع المحل على الخريطة (اختياري)</label>
            <div className="hint" style={{ marginBottom: 8 }}>
              حدِّد موقع محلك على الخريطة ليصل إليه المشترون بسهولة — اضغط «حدّد موقعي» أو انقر على الخريطة واسحب الدبوس.
            </div>
            <LocationPicker value={f.gGeo} onChange={(geo) => set('gGeo', geo)} />
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
