import { useEffect, useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { RefChip, Ltr, Pill, Tile } from '../ui/bits.jsx'
import { money, rateLabel, netEarnings } from '../../lib/format.js'
import WithdrawModal from '../modals/WithdrawModal.jsx'

const STATUS = {
  sent: { tone: 'grey', label: 'قيد المراجعة' },
  won: { tone: 'navy', label: 'تم تأكيد الطلب' },
  lost: { tone: 'grey', label: 'لم يُختَر' },
  withdrawn: { tone: 'red', label: 'مسحوب' },
}

export default function MyOffers({ onData }) {
  const { api, shop } = useApp()
  const [offers, setOffers] = useState(null)
  const [withdrawing, setWithdrawing] = useState(null)

  async function load() {
    setOffers(await api.getOffers())
  }
  useEffect(() => {
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (offers === null) return <div className="card card-pad muted">جارٍ التحميل…</div>

  const won = offers.find((o) => o.status === 'won')
  const sent = offers.filter((o) => o.status === 'sent')
  const counts = {
    video: 0,
    review: sent.length,
    won: offers.filter((o) => o.status === 'won').length,
  }

  return (
    <>
      <h1 className="h1">عروضي</h1>
      <p className="sub">تقديم العرض لا يضمن الفوز — يقارن المشتري العروض ويختار.</p>

      {won && (
        <div className="navy-card" style={{ padding: 18, margin: '16px 0' }}>
          <div className="row between center">
            <Pill tone="grey">تم تأكيد الطلب</Pill>
            <Ltr mono>{won.taskId}</Ltr>
          </div>
          <div style={{ fontWeight: 800, marginTop: 10, fontSize: 16 }}>{won.partName}</div>
          <div style={{ color: '#b9c6de', fontSize: 13 }}>
            {won.car} · أكّد المشتري طلبك — جهّز القطعة للشحن.
          </div>
          <div className="receipt" style={{ marginTop: 12 }}>
            <div className="r">
              <span>سعرك</span>
              <Ltr mono>{money(won.price)}</Ltr>
            </div>
            <div className="r">
              <span>عمولة MT AUTO ({rateLabel(won.price)})</span>
              <Ltr mono>−{money(won.price - netEarnings(won.price))}</Ltr>
            </div>
            <div className="r total">
              <span>صافي أرباحك</span>
              <Ltr mono>{money(netEarnings(won.price))}</Ltr>
            </div>
          </div>
          <div className="strip strip-amber" style={{ marginTop: 12 }}>
            <b>خطوات الشحن — لازمة</b>
            <ol style={{ margin: '6px 18px 0', lineHeight: 1.9 }}>
              <li>غلّف القطعة جيداً لحمايتها أثناء النقل.</li>
              <li>
                اكتب على الطرد الكود <Ltr mono>{won.taskId}</Ltr> وعبارة «MT AUTO» بخط واضح.
              </li>
              <li>سلّم الطرد لشركة التوصيل.</li>
            </ol>
          </div>
        </div>
      )}

      <div className="tiles" style={{ margin: '16px 0' }}>
        <Tile label="بانتظار الفيديو" value={counts.video} dotTone="var(--amber)" />
        <Tile label="قيد المراجعة" value={counts.review} dotTone="#9aa0ab" />
        <Tile label="تم تأكيد الطلب" value={counts.won} navy />
      </div>

      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th>القطعة · العلامة</th>
              <th>المرجع</th>
              <th>سعرك</th>
              <th>الحالة</th>
              <th>إجراء</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => {
              const st = STATUS[o.status] || STATUS.sent
              const canWithdraw = o.status === 'sent'
              return (
                <tr key={o.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{o.partName}</div>
                    <div className="faint" style={{ fontSize: 12 }}>
                      {o.brand} · {o.car}
                    </div>
                  </td>
                  <td>
                    <Ltr mono>{o.taskId}</Ltr>
                  </td>
                  <td>
                    <Ltr mono>{money(o.price)}</Ltr>
                  </td>
                  <td>
                    <Pill tone={st.tone}>{st.label}</Pill>
                  </td>
                  <td>
                    {canWithdraw ? (
                      <button className="btn btn-danger btn-sm" onClick={() => setWithdrawing(o)} data-testid={`withdraw-${o.id}`}>
                        سحب العرض
                      </button>
                    ) : (
                      <span className="faint" style={{ fontSize: 12 }}>
                        —
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {withdrawing && (
        <WithdrawModal
          offer={withdrawing}
          warns={shop?.withdraw_warns || 0}
          onClose={() => setWithdrawing(null)}
          onDone={() => {
            load()
            onData?.()
          }}
        />
      )}
    </>
  )
}
