import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import { RefChip, Ltr, Spinner } from '../ui/bits.jsx'
import { useApp } from '../../state/store.jsx'
import { api } from '../../api/index.js'
import { netEarnings, rateLabel, money } from '../../lib/format.js'

const { countries } = api.getMeta()
const EMPTY = { price: '', brand: '', country: '', countryOther: '', note: '', partNo: '', agree: false }

// Offer / quote modal. Supports multi-brand: each brand is a separate competing
// offer on the same request. Validation mirrors submit_offer (3–7 digit price,
// brand + country required, note ≤240, commitment required). After a submit it
// shows a "what happens next" confirmation with add-another / close.
export default function OfferModal({ task, onClose, onSubmitted }) {
  const { toast } = useApp()
  const [f, setF] = useState(EMPTY)
  const [sessionOffers, setSessionOffers] = useState([]) // brands priced this session
  const [showPartNo, setShowPartNo] = useState(false)
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const country = f.country === 'أخرى' ? f.countryOther.trim() : f.country
  const disabled =
    busy ||
    f.price.length < 3 ||
    !f.brand.trim() ||
    !country ||
    (f.country === 'أخرى' && !f.countryOther.trim()) ||
    !f.agree

  async function submit(another) {
    if (disabled) return
    setBusy(true)
    try {
      const offer = await api.submitOffer({
        taskId: task.id,
        price: f.price,
        brand: f.brand,
        country,
        buyer_note: f.note,
        partNo: f.partNo,
        commit_agree: f.agree,
      })
      setSessionOffers((s) => [...s, { brand: offer.brand, price: offer.price }])
      onSubmitted?.()
      if (another) {
        toast('سُجّل عرضك — أضف الآن ماركة أخرى لنفس القطعة.', 'ok')
        resetForm()
      } else {
        setSent(true) // show the confirmation / "what happens next" step
      }
    } catch (e) {
      toast(e.message, 'err')
    } finally {
      setBusy(false)
    }
  }

  function resetForm() {
    setF(EMPTY)
    setShowPartNo(false)
  }
  function addAnother() {
    resetForm()
    setSent(false)
  }

  const net = f.price ? netEarnings(f.price) : 0

  // ---- Confirmation ("what happens next") ---------------------------------
  if (sent) {
    return (
      <Modal
        testid="offer-modal"
        onClose={onClose}
        tag="تم الإرسال"
        title="تم إرسال عرضك"
        maxWidth={520}
        footer={
          <>
            <button className="btn btn-ghost grow" onClick={addAnother} data-testid="offer-add-another">
              إضافة عرض آخر
            </button>
            <button className="btn btn-primary grow" onClick={onClose} data-testid="offer-done">
              تم، إغلاق
            </button>
          </>
        }
      >
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 42, lineHeight: 1 }}>✅</div>
          <p className="sub" style={{ marginTop: 6 }}>
            وصل عرضك إلى المشتري. سنُعلمك فور اختياره — ويمكنك تسعير ماركة أخرى لنفس الطلب.
          </p>
        </div>

        {sessionOffers.length > 0 && (
          <div className="strip strip-navy" style={{ marginBottom: 14 }}>
            <b>عروضك على هذا الطلب:</b>{' '}
            {sessionOffers.map((s, i) => (
              <span className="pill pill-grey" key={i} style={{ marginInlineEnd: 6 }}>
                {s.brand} · <Ltr mono>{money(s.price)}</Ltr>
              </span>
            ))}
          </div>
        )}

        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--faint)', marginBottom: 10 }}>ما الذي يحدث الآن؟</div>
        <div className="commit">
          <div className="item">
            <span className="ico">🔎</span>
            <div>
              <b>يقارن المشتري العروض</b>
              <div className="faint" style={{ fontSize: 12.5 }}>يختار المشتري أفضل عرض من حيث السعر والماركة والتقييم.</div>
            </div>
          </div>
          <div className="item">
            <span className="ico">🎬</span>
            <div>
              <b>عند فوز عرضك تُصوّر القطعة</b>
              <div className="faint" style={{ fontSize: 12.5 }}>فيديو واحد متواصل (القطعة ثم التغليف) قبل الشحن لتأكيد الالتزام.</div>
            </div>
          </div>
          <div className="item">
            <span className="ico">🚚</span>
            <div>
              <b>الشحن عبر MT AUTO</b>
              <div className="faint" style={{ fontSize: 12.5 }}>تُسلّم الطرد للناقل، ويُحرَّر مستحقّك بعد تأكيد التسليم.</div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  // ---- Offer form ---------------------------------------------------------
  return (
    <Modal
      testid="offer-modal"
      onClose={onClose}
      tag="تسعير طلب"
      title="قدّم عرضك"
      sub="سعّر قطعة تملكها فعلاً — ويمكنك تصويرها بعد فوز عرضك واختياره من المشتري."
      footer={
        <>
          <button className="btn btn-ghost grow" onClick={() => submit(true)} disabled={disabled}>
            أرسِل وسعّر ماركة أخرى
          </button>
          <button className="btn btn-primary grow" onClick={() => submit(false)} disabled={disabled} data-testid="offer-submit">
            {busy ? <Spinner /> : 'أرسِل العرض'}
          </button>
        </>
      }
    >
      {/* task summary */}
      <div className="card card-pad" style={{ marginBottom: 14, background: '#f7f8fa' }}>
        <div className="row between center">
          <b style={{ color: 'var(--navy-850)' }}>طلب المشتري</b>
          <Ltr mono>{task.id}</Ltr>
        </div>
        <div style={{ fontWeight: 800, marginTop: 6 }}>{task.part.name}</div>
        <div className="faint" style={{ fontSize: 13 }}>
          {task.car.make} {task.car.model} {task.car.year} · {task.car.engine}
        </div>
        <div style={{ marginTop: 8 }}>
          <RefChip value={task.part.ref} />
        </div>
      </div>

      {sessionOffers.length > 0 && (
        <div className="strip strip-navy" style={{ marginBottom: 14 }}>
          <b>عروض سجّلتها على هذا الطلب:</b>{' '}
          {sessionOffers.map((s, i) => (
            <span className="pill pill-grey" key={i} style={{ marginInlineEnd: 6 }}>
              {s.brand} · <Ltr mono>{money(s.price)}</Ltr>
            </span>
          ))}
        </div>
      )}

      {/* price */}
      <div className="field">
        <label>
          سعرك للمشتري <span className="req">*</span>
        </label>
        <div className="price-wrap">
          <input
            inputMode="numeric"
            placeholder="0"
            value={f.price}
            onChange={(e) => set('price', e.target.value.replace(/\D/g, '').slice(0, 7))}
            data-testid="offer-price"
          />
          <span className="cur">دج</span>
        </div>
        <div className="hint">هذا ما يراه المشتري ويقارنه بالعروض الأخرى.</div>
        {f.price.length >= 3 && (
          <div className="hint">
            عمولة MT AUTO {rateLabel(f.price)} · صافي أرباحك <Ltr mono>{money(net)}</Ltr>
          </div>
        )}
      </div>

      <div className="hr" />
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--faint)', marginBottom: 10 }}>تفاصيل القطعة</div>

      <div className="field">
        <label>
          الماركة <span className="req">*</span>
        </label>
        <input
          className="input"
          placeholder="مثال: Sachs · Valeo · أصلي"
          value={f.brand}
          onChange={(e) => set('brand', e.target.value)}
          data-testid="offer-brand"
        />
        <div className="hint">
          اكتب الماركة الحقيقية للقطعة — نقبل القطع الجديدة فقط (أصلية أو بجودة عالية). القطع المستعملة أو
          الماركة غير الصحيحة تُرفض.
        </div>
      </div>

      <div className="field">
        <label>
          بلد الصنع <span className="req">*</span>
        </label>
        <select className="select" value={f.country} onChange={(e) => set('country', e.target.value)} data-testid="offer-country">
          <option value="">اختر بلد الصنع</option>
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        {f.country === 'أخرى' && (
          <input
            className="input"
            style={{ marginTop: 8 }}
            placeholder="اكتب اسم بلد الصنع"
            value={f.countryOther}
            onChange={(e) => set('countryOther', e.target.value)}
          />
        )}
      </div>

      {/* optional part number */}
      <div className="field">
        <label className="check" style={{ marginBottom: showPartNo ? 8 : 0 }}>
          <input
            type="checkbox"
            checked={showPartNo}
            onChange={(e) => {
              setShowPartNo(e.target.checked)
              if (!e.target.checked) set('partNo', '')
            }}
            data-testid="offer-partno-toggle"
          />
          أضف رقم القطعة (OEM) — اختياري
        </label>
        {showPartNo && (
          <input
            className="input ltr"
            placeholder="مثال: 03L 121 011 P"
            value={f.partNo}
            onChange={(e) => set('partNo', e.target.value)}
            data-testid="offer-partno"
          />
        )}
      </div>

      <div className="field">
        <label>ملاحظة للمشتري (اختياري)</label>
        <textarea
          className="textarea"
          maxLength={240}
          placeholder="مثال: القطعة جديدة في علبتها الأصلية."
          value={f.note}
          onChange={(e) => set('note', e.target.value.slice(0, 240))}
        />
        <div className="hint" style={{ textAlign: 'end' }}>
          <Ltr mono>{f.note.length}/240</Ltr>
        </div>
      </div>

      <div className="hr" />
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--faint)', marginBottom: 10 }}>قبل الإرسال</div>
      <div className="commit">
        <div className="item">
          <span className="ico">✓</span>
          <div>
            <b>القطعة تطابق عرضك</b>
            <div className="faint" style={{ fontSize: 12.5 }}>
              ما تشحنه يطابق ماركتك وسعرك تماماً — والفيديو هو المرجع عند أي خلاف. وأتحمّل تكاليف الإرجاع إن
              كان الخطأ منّي.
            </div>
          </div>
        </div>
        <div className="item">
          <span className="ico">🎬</span>
          <div>
            <b>فيديو إن فاز عرضك</b>
            <div className="faint" style={{ fontSize: 12.5 }}>
              تُصوّر فيديو واحداً متواصلاً (القطعة ثم التغليف) وتُرسله قبل الشحن.
            </div>
          </div>
        </div>
        <label className="check" style={{ marginTop: 12 }}>
          <input type="checkbox" checked={f.agree} onChange={(e) => set('agree', e.target.checked)} data-testid="offer-agree" />
          أوافق على هذه الالتزامات
        </label>
      </div>
    </Modal>
  )
}
