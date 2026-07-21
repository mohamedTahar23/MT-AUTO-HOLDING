import { useEffect, useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { Ltr, Pill, Tile } from '../ui/bits.jsx'
import Stepper from '../ui/Stepper.jsx'
import { money } from '../../lib/format.js'

const PAY_STEPS = ['بانتظار التحصيل', 'تم التحصيل', 'الدفع']
const PILL = {
  مجمّد: { tone: 'grey', step: 0 },
  مستحق: { tone: 'amber', step: 1 },
  تم: { tone: 'green', step: 2 },
}

export default function Payouts() {
  const { api } = useApp()
  const [rows, setRows] = useState(null)

  useEffect(() => {
    api.getPayouts().then(setRows)
  }, [api])

  if (rows === null) return <div className="card card-pad muted">جارٍ التحميل…</div>

  const received = rows.filter((r) => r.status === 'تم').reduce((s, r) => s + r.net, 0)
  const pending = rows.filter((r) => r.status !== 'تم').reduce((s, r) => s + r.net, 0)

  return (
    <>
      <h1 className="h1">الأرباح</h1>
      <p className="sub">
        تظهر الطلبات هنا بعد تسليمها للمشتري ومعالجة الدفع — وتُسجَّل مبالغها حتى تحويلها إليك. الدفع عند
        الاستلام (COD) تُحصّله MT، لا المحل.
      </p>

      <div className="tiles" style={{ margin: '16px 0' }}>
        <Tile label="قيد الانتظار" value={<Ltr mono>{money(pending)}</Ltr>} dotTone="var(--amber)" />
        <Tile label="إجمالي المدفوعات المستلمة" value={<Ltr mono>{money(received)}</Ltr>} navy />
      </div>

      <div className="cards-grid">
        {rows.map((p) => {
          const meta = PILL[p.status] || PILL['مجمّد']
          return (
            <div className="card card-pad" key={p.orderId}>
              <div className="row between center">
                <b>{p.partName}</b>
                <Pill tone={meta.tone} dot>
                  {p.status === 'مجمّد' ? 'مجمّد — قيد الانتظار' : p.status === 'مستحق' ? 'مستحق' : 'مدفوع'}
                </Pill>
              </div>
              <div className="faint" style={{ fontSize: 12 }}>
                <Ltr mono>REF {p.orderId}</Ltr>
              </div>
              <div className="mono" style={{ fontSize: 22, fontWeight: 900, color: 'var(--navy-850)', margin: '8px 0' }}>
                <Ltr mono>{money(p.net)}</Ltr>
              </div>
              <Stepper steps={PAY_STEPS} current={meta.step} />
              {p.status === 'تم' && (
                <div className="strip strip-navy" style={{ marginTop: 8, fontSize: 12.5 }}>
                  حُوِّلت إليك.
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
