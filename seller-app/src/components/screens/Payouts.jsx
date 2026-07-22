import { useEffect, useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { Ltr, Spinner } from '../ui/bits.jsx'
import Modal from '../ui/Modal.jsx'
import { grouped } from '../../lib/format.js'

// Payment tracker vocabulary. Stored statuses are never renamed — labels/tones
// are derived at render. dispute rows never reach this screen (frozen money
// lives under التسليمات as «قيد النزاع»).
const STEP_ORDER = ['delivered', 'collected', 'paid']
const STEP_LABELS = ['بانتظار التحصيل', 'تم التحصيل', 'الدفع']
const STATUS_PILL = {
  delivered: { tone: 'grey', label: 'بانتظار التحصيل' },
  collected: { tone: 'grey', label: 'تم التحصيل' },
  paid: { tone: 'green', label: 'مدفوع' },
}

/** Amount in the shared money format: LTR mono figure + muted دج suffix. */
function Amount({ value, className }) {
  return (
    <div className={className}>
      <Ltr mono>{grouped(value)}</Ltr> <span className="dj">دج</span>
    </div>
  )
}

export default function Payouts() {
  const { api, toast } = useApp()
  const [data, setData] = useState(null)
  const [received, setReceived] = useState(() => new Set())
  const [modalRef, setModalRef] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api.getPayouts().then(({ baseline, rows }) => {
      setData({ baseline, rows })
      setReceived(new Set(rows.filter((r) => r.received).map((r) => r.ref)))
    })
  }, [api])

  if (data === null) return <div className="card card-pad muted">جارٍ التحميل…</div>

  const rows = data.rows.filter((r) => r.status !== 'dispute')
  const isReceived = (r) => r.status === 'paid' && received.has(r.ref)
  const pendingTotal = rows.filter((r) => !isReceived(r)).reduce((s, r) => s + r.amount, 0)
  const totalReceived = data.baseline + rows.filter(isReceived).reduce((s, r) => s + r.amount, 0)
  const modalRow = modalRef ? rows.find((r) => r.ref === modalRef) : null

  async function confirmReceipt() {
    setBusy(true)
    try {
      await api.confirmPayoutReceipt(modalRef)
      setReceived((prev) => new Set(prev).add(modalRef))
      setModalRef(null)
      toast('تم تأكيد استلام الدفعة — أُضيف المبلغ إلى إجمالي المدفوعات المستلمة.', 'ok')
    } catch (e) {
      toast(e.message, 'err')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <h1 className="h1">الأرباح</h1>
      <p className="sub" style={{ fontSize: 13.5 }}>
        تظهر الطلبات هنا بعد تسليمها للمشتري ومعالجة الدفع — وتُسجَّل مبالغها حتى تحويلها إليك.
      </p>

      <div className="pay-sums">
        <div className="pay-sum" data-testid="pending-total">
          <div className="lbl">قيد الانتظار</div>
          <Amount className="n" value={pendingTotal} />
        </div>
        <div className="pay-sum navy" data-testid="received-total">
          <div className="lbl">إجمالي المدفوعات المستلمة</div>
          <Amount className="n" value={totalReceived} />
        </div>
      </div>

      <div className="dl-masonry">
        {rows.map((r) => (
          <PayoutCard key={r.ref} row={r} received={received.has(r.ref)} onConfirm={() => setModalRef(r.ref)} />
        ))}
      </div>

      {modalRow && (
        <Modal
          testid="receipt-modal"
          onClose={() => setModalRef(null)}
          maxWidth={460}
          title="تأكيد استلام الدفعة"
          sub="أكّد أن مبلغ هذه الدفعة وصل فعلاً إلى حسابك — بعد التأكيد يُحتسب ضمن إجمالي المدفوعات المستلمة."
          footer={
            <>
              <button className="btn btn-ghost grow" onClick={() => setModalRef(null)}>
                تراجع
              </button>
              <button className="btn btn-navy grow" onClick={confirmReceipt} disabled={busy} data-testid="receipt-confirm">
                {busy ? <Spinner dark /> : 'نعم، استلمت الدفعة'}
              </button>
            </>
          }
        >
          <div className="card card-pad" style={{ background: '#f7f8fa' }}>
            <div style={{ fontWeight: 800 }}>
              {modalRow.partName} · {modalRow.car}
            </div>
            <div className="faint" style={{ fontSize: 13 }}>
              <Ltr mono>REF {modalRow.ref}</Ltr> · <Ltr mono>{grouped(modalRow.amount)} دج</Ltr>
              {modalRow.paidAt && (
                <>
                  {' '}
                  — حُوِّلت في <Ltr mono>{modalRow.paidAt}</Ltr>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

function PayoutCard({ row: r, received, onConfirm }) {
  const pill = STATUS_PILL[r.status] || STATUS_PILL.delivered
  const idx = STEP_ORDER.indexOf(r.status)
  const pct = idx <= 0 ? '0%' : Math.round((idx / 2) * 100) + '%'

  return (
    <div className="card card-pad" data-testid={`payout-${r.ref}`}>
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div>
          <b style={{ color: 'var(--navy-850)', fontSize: 15, fontWeight: 700 }}>
            {r.partName} · {r.car}
          </b>
          <div className="pay-ref">
            <Ltr mono>
              <span className="lbl">REF</span> {r.ref}
            </Ltr>
          </div>
        </div>
        <span className={`pill pill-${pill.tone}`} data-testid={`status-${r.ref}`}>
          {pill.label}
        </span>
      </div>

      <Amount className="pay-amount" value={r.amount} />

      <div className="dtrack steps-3" dir="ltr">
        <span className="dtrack-line">
          <span className="dtrack-fill" style={{ width: pct }} />
        </span>
        {STEP_LABELS.map((cap, i) => (
          <span className="dstep" key={cap}>
            <span className={'ddot' + (i <= idx ? ' on' : '')} />
            <span className={'dcap' + (i <= idx ? ' on' : '')}>{cap}</span>
          </span>
        ))}
      </div>

      {r.status === 'paid' && r.paidAt && (
        <div className="pay-date">
          حُوِّلت إليك في <Ltr mono>{r.paidAt}</Ltr>
        </div>
      )}

      {r.status === 'paid' && (
        <button
          type="button"
          className={'pay-toggle' + (received ? ' on' : '')}
          data-testid={`receipt-toggle-${r.ref}`}
          aria-pressed={received}
          onClick={received ? undefined : onConfirm}
        >
          <span>{received ? 'تم تأكيد الاستلام' : 'أكّد استلام دفعتك'}</span>
          <span className="pay-track" aria-hidden>
            <span className="pay-knob" />
          </span>
        </button>
      )}
    </div>
  )
}
