import { useMemo, useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { Ltr } from '../ui/bits.jsx'

// إعدادات الحساب — owner-only popup section: store-info card + map card +
// account/login card. Save/reset live in the MODAL footer (AccountModal owns
// the buttons), so the form state is lifted into this hook.

const FIELDS = ['name', 'wilaya', 'phone', 'address', 'mapsUrl']
const fromShop = (shop) => Object.fromEntries(FIELDS.map((k) => [k, shop?.[k] || '']))

export function useSettingsForm() {
  const { api, shop, setShop, toast } = useApp()
  const [draft, setDraft] = useState(() => fromShop(shop))
  const [saving, setSaving] = useState(false)

  const dirty = useMemo(() => {
    const base = fromShop(shop)
    return FIELDS.some((k) => draft[k] !== base[k])
  }, [draft, shop])

  const setField = (k, v) => setDraft((d) => ({ ...d, [k]: v }))
  const reset = () => setDraft(fromShop(shop))
  const save = async () => {
    setSaving(true)
    try {
      const next = await api.updateShop(draft)
      setShop(next)
      setDraft(fromShop(next))
      toast('تم حفظ إعدادات الحساب', 'ok')
    } catch (err) {
      toast(err.message || 'تعذّر حفظ التغييرات', 'err')
    } finally {
      setSaving(false)
    }
  }

  return { draft, setField, dirty, saving, save, reset }
}

export default function SettingsSection({ form }) {
  const { api, session, shop } = useApp()
  const { draft, setField, saving } = form
  const { wilayas } = api.getMeta()

  // While the save RPC is in flight the fields freeze, so the server echo can
  // never clobber keystrokes typed mid-request.
  return (
    <div className="acct-stack">
      {/* معلومات المتجر */}
      <section className="card card-pad">
        <h3 className="acct-sec-title">معلومات المتجر</h3>
        <div className="set-grid">
          <div className="field">
            <label>
              اسم المحل <span className="req">*</span>
            </label>
            <input
              className="input"
              value={draft.name}
              disabled={saving}
              onChange={(e) => setField('name', e.target.value)}
              data-testid="settings-name"
            />
          </div>
          <div className="field">
            <label>الولاية</label>
            <select
              className="select"
              value={draft.wilaya}
              disabled={saving}
              onChange={(e) => setField('wilaya', e.target.value)}
              data-testid="settings-wilaya"
            >
              {!wilayas.includes(draft.wilaya) && draft.wilaya && <option value={draft.wilaya}>{draft.wilaya}</option>}
              {wilayas.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>هاتف المحل الرسمي</label>
            <input
              className="input ltr"
              inputMode="tel"
              value={draft.phone}
              disabled={saving}
              onChange={(e) => setField('phone', e.target.value)}
              data-testid="settings-phone"
            />
            <p className="hint">هذا الرقم هو خط التواصل الرسمي — أرقام الموظفين الشخصية لا تصل للمشتري.</p>
          </div>
          <div className="field">
            <label>العنوان</label>
            <input
              className="input"
              value={draft.address}
              disabled={saving}
              onChange={(e) => setField('address', e.target.value)}
              data-testid="settings-address"
            />
          </div>
        </div>
      </section>

      {/* موقع المحل على الخريطة */}
      <section className="card card-pad">
        <h3 className="acct-sec-title">موقع المحل على الخريطة</h3>
        <div className="set-grid">
          <div className="field" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
            <label>رابط خرائط Google</label>
            <input
              className="input ltr"
              inputMode="url"
              placeholder="https://maps.google.com/…"
              value={draft.mapsUrl}
              disabled={saving}
              onChange={(e) => setField('mapsUrl', e.target.value)}
              data-testid="settings-maps-url"
            />
            <p className="hint">الموقع الدقيق يسرّع استلام الناقل للطرود من محلك.</p>
          </div>
        </div>
        {draft.mapsUrl ? (
          <a
            className="map-drop"
            style={{ minHeight: 150, marginTop: 12 }}
            href={draft.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            <span>افتح الموقع على خرائط Google</span>
            <small>
              <Ltr>{draft.mapsUrl}</Ltr>
            </small>
          </a>
        ) : (
          <div className="map-drop" style={{ minHeight: 150, marginTop: 12, cursor: 'default' }}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="9" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.6" />
              <path d="M5 18l4.5-4.5 3 3L17 12l3 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            <span>لا يوجد رابط خريطة بعد</span>
            <small>ألصق رابط موقع محلك في الحقل أعلاه</small>
          </div>
        )}
      </section>

      {/* الحساب والدخول */}
      <section className="card card-pad">
        <h3 className="acct-sec-title">الحساب والدخول</h3>
        <div className="set-grid">
          <div className="field" style={{ marginBottom: 0 }}>
            <label>البريد الإلكتروني للمالك</label>
            <input className="input ltr" value={session?.email || '—'} readOnly disabled data-testid="settings-email" />
            <p className="hint">الدخول يتم برمز يُرسل إلى هذا البريد أو عبر Google — لا كلمات مرور.</p>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>حالة الحساب</label>
            <div className="row center" style={{ minHeight: 46, gap: 8 }}>
              <span className="pill pill-green">
                <span className="dot" /> نشط
              </span>
              <span className="pill pill-navy">المالك</span>
              {shop?.rating && (
                <span className="pill pill-amber">
                  ★ <Ltr>{shop.rating}</Ltr>
                </span>
              )}
            </div>
            <p className="hint">لتغيير بريد المالك أو نقل الملكية تواصل مع فريق MT AUTO.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
