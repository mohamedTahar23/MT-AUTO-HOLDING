import { Ltr } from '../ui/bits.jsx'
import { money, rateLabel, netEarnings, commissionAmount } from '../../lib/format.js'
import DeliverToggle from './DeliverToggle.jsx'

/**
 * Navy hero card(s) for confirmed orders (derived status 'won'): the buyer
 * accepted the offer and the proof video is done — prepare the shipment.
 */
export default function WonBanner({ wonOffers, delivered, onToggleDelivered }) {
  if (!wonOffers.length) return null

  return (
    <section data-testid="won-banner" style={{ margin: '16px 0' }}>
      <div className="row center" style={{ gap: 8, marginBottom: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 9, background: 'var(--amber)' }} />
        <b style={{ fontSize: 13, color: 'var(--navy-850)' }}>طلب مؤكّد</b>
      </div>

      {wonOffers.map((o) => (
        <div className="navy-card" key={o.id} style={{ padding: 18, marginBottom: 12 }}>
          <div className="row between center wrap" style={{ gap: 8 }}>
            <span className="pill pill-amber">
              <span className="dot" />✓ تم تأكيد الطلب
            </span>
            <Ltr mono>{o.taskId}</Ltr>
          </div>

          <div style={{ fontWeight: 800, marginTop: 10, fontSize: 17, color: '#fff' }}>{o.partName}</div>
          <div style={{ color: '#8FA0BE', fontSize: 13 }}>
            {o.car} · أكّد المشتري طلبك — جهّز القطعة للشحن.
          </div>

          <div className="receipt" style={{ marginTop: 12 }}>
            <div className="r">
              <span>سعرك</span>
              <Ltr mono>{money(o.price)}</Ltr>
            </div>
            <div className="r">
              <span>عمولة MT AUTO ({rateLabel(o.price)})</span>
              <Ltr mono>−{money(commissionAmount(o.price))}</Ltr>
            </div>
            <div className="r total">
              <span>صافي أرباحك</span>
              <Ltr mono>{money(netEarnings(o.price))}</Ltr>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <DeliverToggle
              offerId={o.id}
              on={delivered.has(o.id)}
              onToggle={() => onToggleDelivered(o.id)}
              testid={`deliver-banner-${o.id}`}
            />
          </div>
        </div>
      ))}
    </section>
  )
}
