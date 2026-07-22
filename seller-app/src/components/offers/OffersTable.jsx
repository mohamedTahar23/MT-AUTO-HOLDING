import { RefChip, Ltr, Pill } from '../ui/bits.jsx'
import { money, rateLabel, netEarnings, commissionAmount } from '../../lib/format.js'
import { countLabel } from './derive.js'
import DeliverToggle from './DeliverToggle.jsx'

/**
 * Offers table, grouped by request — a seller may hold several brand-offers on
 * one request. Layout is a flex "table" (not <table>) because each offer row
 * carries a summary strip directly beneath it.
 */
export default function OffersTable({
  groups,
  tasksById,
  locked,
  delivered,
  onToggleDelivered,
  onWithdraw,
  onFilm,
  onAddBrand,
}) {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* column headers */}
      <div className="ot-head">
        <span className="ot-c1">القطعة · العلامة</span>
        <span className="ot-c2">المرجع</span>
        <span className="ot-c3">سعرك</span>
        <span className="ot-c4">الحالة</span>
        <span className="ot-c5">إجراء</span>
      </div>

      {groups.map((g) => {
        const openTask = tasksById.get(g.taskId)
        const addable = !!openTask && !locked
        const first = g.offers[0]
        return (
          <div className="ot-group" key={g.taskId}>
            {/* group header — one line per request */}
            <div className="ot-group-head">
              <b className="ot-part">{first.partName}</b>
              <span className="ot-car">{first.car}</span>
              {g.offers.length > 1 && (
                <span className="pill pill-amber" data-testid={`group-count-${g.taskId}`}>
                  {countLabel(g.offers.length)}
                </span>
              )}
              <span className="grow" />
              {addable && (
                <button
                  type="button"
                  className="ot-addbrand"
                  onClick={() => onAddBrand(openTask)}
                  data-testid={`add-brand-${g.taskId}`}
                >
                  + عرض لعلامة أخرى
                </button>
              )}
              <span className="faint" style={{ fontSize: 12 }}>
                <Ltr mono>{g.taskId}</Ltr>
              </span>
            </div>

            {g.offers.map((o) => (
              <OfferRow
                key={o.id}
                offer={o}
                locked={locked}
                delivered={delivered}
                onToggleDelivered={onToggleDelivered}
                onWithdraw={onWithdraw}
                onFilm={onFilm}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

function OfferRow({ offer: o, locked, delivered, onToggleDelivered, onWithdraw, onFilm }) {
  return (
    <>
      <div className="ot-row">
        <span className="ot-c1">
          <span className="chip-brand">
            <Ltr>{o.brand}</Ltr>
          </span>
        </span>
        <span className="ot-c2">{o.ref ? <RefChip value={o.ref} /> : null}</span>
        <span className="ot-c3">
          <Ltr mono>{money(o.price)}</Ltr>
        </span>
        <span className="ot-c4" data-testid={`status-${o.id}`}>
          <StatusBadge derived={o.derived} />
        </span>
        <span className="ot-c5">
          <Action
            offer={o}
            locked={locked}
            delivered={delivered}
            onToggleDelivered={onToggleDelivered}
            onWithdraw={onWithdraw}
            onFilm={onFilm}
          />
        </span>
      </div>

      {/* per-offer summary strip */}
      <div className="offer-summary" data-testid={`summary-${o.id}`}>
        <Ltr mono>{o.id}</Ltr>
        <span>
          سعرك <Ltr mono>{money(o.price)}</Ltr>
        </span>
        <span>
          عمولة MT AUTO {rateLabel(o.price)} <Ltr mono>−{money(commissionAmount(o.price))}</Ltr>
        </span>
        <span className="grow" />
        <span className="os-net">
          صافي أرباحك <Ltr mono>{money(netEarnings(o.price))}</Ltr>
        </span>
      </div>
    </>
  )
}

function StatusBadge({ derived }) {
  if (derived === 'video')
    return (
      <Pill tone="amber" dot>
        مطلوب فيديو
      </Pill>
    )
  if (derived === 'submitted')
    return (
      <Pill tone="grey" dot>
        قيد المراجعة
      </Pill>
    )
  if (derived === 'lost') return <Pill tone="grey">✕ لم يُختَر</Pill>
  if (derived === 'withdrawn') return <Pill tone="red">مسحوب</Pill>
  return null // 'won' — the badge lives in the won banner
}

function Action({ offer: o, locked, delivered, onToggleDelivered, onWithdraw, onFilm }) {
  if (o.derived === 'video')
    return (
      <button className="btn btn-primary btn-sm" onClick={() => onFilm(o)} data-testid={`film-${o.id}`}>
        صوّر القطعة
      </button>
    )
  if (o.derived === 'won')
    return <DeliverToggle offerId={o.id} on={delivered.has(o.id)} onToggle={() => onToggleDelivered(o.id)} />
  if (o.derived === 'submitted') {
    if (locked)
      return (
        <span className="faint" style={{ fontSize: 12 }}>
          التسعير موقوف
        </span>
      )
    return (
      <button className="btn btn-danger btn-sm" onClick={() => onWithdraw(o)} data-testid={`withdraw-${o.id}`}>
        سحب العرض
      </button>
    )
  }
  // lost / withdrawn
  return (
    <span className="faint" style={{ fontSize: 12 }}>
      مغلق
    </span>
  )
}
