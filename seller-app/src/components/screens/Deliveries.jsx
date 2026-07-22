import { useEffect, useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { Ltr } from '../ui/bits.jsx'
import { api } from '../../api/index.js'

// Tracking-only: handover is confirmed from the My Offers won row, not here.
const STEP_ORDER = ['picked', 'transit', 'delivered', 'paid']
const STEP_LABELS = ['تم تسليم القطعة لشركة الشحن', 'في الطريق', 'معاينة', 'دفع']
const STATUS_PILL = {
  pack: { tone: 'amber', label: 'بانتظار التسليم' },
  picked: { tone: 'grey', label: 'سُلّمت للشركة' },
  transit: { tone: 'grey', label: 'في الطريق' },
  delivered: { tone: 'grey', label: 'في المعاينة' },
  dispute: { tone: 'grey', label: 'قيد النزاع' },
  paid: { tone: 'grey', label: 'مدفوع' },
}

export default function Deliveries() {
  const { isOwner } = useApp()
  const [deliveries, setDeliveries] = useState(null)

  useEffect(() => {
    api.getDeliveries().then(setDeliveries)
  }, [])

  if (deliveries === null) return <div className="card card-pad muted">جارٍ التحميل…</div>

  return (
    <>
      <h1 className="h1">التسليمات</h1>
      <p className="sub" style={{ fontSize: 13.5 }}>
        تتبّع شحناتك بعد تأكيد الطلب — من تسليم الطرد لشركة التوصيل إلى المعاينة والدفع.
      </p>

      <div className="dl-masonry">
        {deliveries.map((o) => (
          <DeliveryCard key={o.id} order={o} isOwner={isOwner} />
        ))}
      </div>
    </>
  )
}

function DeliveryCard({ order: o, isOwner }) {
  const s = o.deliveryStatus
  const pill = STATUS_PILL[s] || STATUS_PILL.pack
  const idx = s === 'dispute' ? STEP_ORDER.indexOf('delivered') : STEP_ORDER.indexOf(s)
  const pct = idx <= 0 ? '0%' : Math.round((idx / 3) * 100) + '%'

  return (
    <div className="card card-pad" data-testid={`delivery-${o.id}`}>
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div>
          <b style={{ color: 'var(--navy-850)', fontSize: 15, fontWeight: 700 }}>
            {o.partName} · {o.car}
          </b>
          <div style={{ marginTop: 6 }}>
            <span className="ref-chip">
              <span className="ref-lbl">الكود</span>
              <Ltr mono>{o.labelCode || o.id}</Ltr>
            </span>
          </div>
        </div>
        <span className={`pill pill-${pill.tone}`} data-testid={`status-${o.id}`}>
          {pill.label}
        </span>
      </div>

      <div className="dtrack" dir="ltr">
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

      {s === 'dispute' && (
        <div className="dispute-note" data-testid={`dispute-${o.id}`}>
          {isOwner ? (
            <>
              النزاع يُحلّ عبر واتساب — الفيديو الذي ارسلته هو المرجع.{' '}
              <a
                className="dispute-wa"
                data-testid={`dispute-wa-${o.id}`}
                href="https://wa.me/213659401338"
                target="_blank"
                rel="noreferrer"
              >
                ✆ متابعة النزاع عبر واتساب
              </a>
            </>
          ) : (
            <>القطعة في نزاع — يُحلّ النزاع داخل المنصة. الفيديو الذي أرسلته عبر المنصة هو المرجع.</>
          )}
        </div>
      )}
    </div>
  )
}
