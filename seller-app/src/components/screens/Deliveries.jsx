import { useEffect, useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { Ltr, Pill, Spinner } from '../ui/bits.jsx'
import Stepper from '../ui/Stepper.jsx'
import Modal from '../ui/Modal.jsx'
import VideoModal from '../modals/VideoModal.jsx'
import { api } from '../../api/index.js'

const STEPS = ['تجهيز', 'استلمها الناقل', 'في الطريق', 'سُلّمت', 'مؤكَّد']
const STAGE_INDEX = { video: -1, handover: 0, transit: 2, done: 3 }
const STAGE_PILL = {
  video: { tone: 'amber', label: 'بانتظار الإثبات' },
  handover: { tone: 'amber', label: 'سلّم الطرد للناقل' },
  transit: { tone: 'navy', label: 'في الطريق' },
  done: { tone: 'green', label: 'سُلّمت' },
}

export default function Deliveries({ onData }) {
  const { toast } = useApp()
  const [orders, setOrders] = useState(null)
  const [videoOrder, setVideoOrder] = useState(null)
  const [handoverOrder, setHandoverOrder] = useState(null)

  async function load() {
    setOrders(await api.getOrders())
  }
  useEffect(() => {
    load()
  }, [])

  if (orders === null) return <div className="card card-pad muted">جارٍ التحميل…</div>

  return (
    <>
      <h1 className="h1">التسليمات</h1>
      <p className="sub">
        تتبّع شحناتك بعد تأكيد الطلب — من تسليم الطرد لشركة التوصيل إلى المعاينة والدفع. لا تظهر أي عناوين —
        الطرد يحمل رمز الملصق وعبارة «MT AUTO» فقط.
      </p>

      <div className="cards-grid" style={{ marginTop: 16 }}>
        {orders.map((o) => {
          const pill = STAGE_PILL[o.stage] || STAGE_PILL.transit
          return (
            <div className="card card-pad" key={o.id}>
              <div className="row between center">
                <b>{o.partName}</b>
                <Pill tone={pill.tone} dot>
                  {pill.label}
                </Pill>
              </div>
              <div className="faint" style={{ fontSize: 12.5, marginTop: 2 }}>
                {o.car}
              </div>
              <div style={{ marginTop: 8 }}>
                <span className="ref-chip">
                  <span className="ref-lbl">الكود</span>
                  <Ltr mono>{o.labelCode || o.id}</Ltr>
                </span>
              </div>

              <Stepper steps={STEPS} current={STAGE_INDEX[o.stage]} />

              {o.stage === 'video' && (
                <>
                  <div className="strip strip-amber" style={{ marginTop: 8, fontSize: 12.5 }}>
                    صوّر القطعة وتغليفها في فيديو واحد متواصل قبل الشحن.
                  </div>
                  <button className="btn btn-primary btn-block" style={{ marginTop: 10 }} onClick={() => setVideoOrder(o)}>
                    صوّر القطعة
                  </button>
                </>
              )}

              {o.stage === 'handover' && (
                <>
                  <div className="strip strip-navy" style={{ marginTop: 8, fontSize: 12.5 }}>
                    سلّم الطرد للناقل مع ذكر الرمز <Ltr mono>{o.labelCode}</Ltr> وعبارة «MT AUTO». لا تكتب أي
                    عنوان على الطرد.
                  </div>
                  <button className="btn btn-primary btn-block" style={{ marginTop: 10 }} onClick={() => setHandoverOrder(o)}>
                    سلّمت الطرد للناقل
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>

      {videoOrder && (
        <VideoModal order={videoOrder} onClose={() => setVideoOrder(null)} onDone={() => (load(), onData?.())} />
      )}
      {handoverOrder && (
        <HandoverModal
          order={handoverOrder}
          onClose={() => setHandoverOrder(null)}
          onDone={() => {
            load()
            onData?.()
            toast('تم تسجيل تسليم الطرد للناقل.', 'ok')
          }}
        />
      )}
    </>
  )
}

function HandoverModal({ order, onClose, onDone }) {
  const [ack, setAck] = useState(false)
  const [busy, setBusy] = useState(false)
  async function confirm() {
    setBusy(true)
    try {
      await api.markHandover(order.id)
      onDone?.()
      onClose()
    } finally {
      setBusy(false)
    }
  }
  return (
    <Modal
      onClose={onClose}
      maxWidth={460}
      tag="خطوة أخيرة"
      title="تأكيد تسليم الطرد"
      sub="القطعة التي تشحنها الآن هي نفسها التي ظهرت في الفيديو، ويعاينها المشتري عند الاستلام."
      footer={
        <button className="btn btn-primary btn-block" onClick={confirm} disabled={busy || !ack}>
          {busy ? <Spinner /> : 'أؤكد تسليم القطعة لشركة الشحن'}
        </button>
      }
    >
      <div className="strip strip-navy" style={{ marginBottom: 12 }}>
        الرمز على الطرد: <Ltr mono>{order.labelCode}</Ltr> · وعبارة «MT AUTO».
      </div>
      <label className="check">
        <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
        أؤكّد أنني سلّمت نفس القطعة التي صوّرتها سابقاً.
      </label>
    </Modal>
  )
}
