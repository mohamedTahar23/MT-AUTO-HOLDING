import { RefChip, Ltr } from '../ui/bits.jsx'
import { ageLabel } from '../../lib/format.js'

/**
 * A single open buyer request in the pricing queue. Anonymised — no buyer
 * identity, only the part/car/reference and pricing preferences.
 * Action states: quote → quoted → locked (pricing suspended) / no-permission.
 */
export default function RequestCard({ task: t, quoted, locked, canPrice, onQuote }) {
  const actionLabel = locked
    ? 'التسعير موقوف'
    : quoted
      ? '✓ تم تقديم عرضك'
      : !canPrice
        ? 'لا تملك صلاحية التسعير'
        : 'قدّم عرضك'

  return (
    <div className="card card-pad">
      <div className="row between center">
        <div className="row center" style={{ gap: 6 }}>
          <span style={{ fontWeight: 800, color: 'var(--navy-850)' }}>
            <Ltr mono>{t.id}</Ltr>
          </span>
          <span className="faint" style={{ fontSize: 12 }}>
            · {ageLabel(t.createdAt)}
          </span>
        </div>
        <span className="q-compete">{t.competingShops} يسعّرون الآن</span>
      </div>

      <div style={{ fontWeight: 800, marginTop: 8, color: 'var(--navy-850)' }}>{t.part.name}</div>
      <div className="faint" style={{ fontSize: 13 }}>
        {t.car.make} {t.car.model} {t.car.year} · {t.car.engine}
      </div>

      <div className="row wrap center" style={{ gap: 8, margin: '10px 0' }}>
        <RefChip value={t.part.ref} />
        {t.buyerPhotoUrl && (
          <span className="buyer-chip">
            <img className="buyer-thumb" src={t.buyerPhotoUrl} alt="صورة القطعة من المشتري" />
            صورة من المشتري
          </span>
        )}
      </div>

      <div className="row wrap" style={{ gap: 6 }}>
        <span className="pill pill-navy">الماركة المفضّلة · {t.prefBrand}</span>
        {t.altOk && t.brandAlt ? (
          <span className="pill pill-grey">بديل مقبول · {t.brandAlt}</span>
        ) : (
          <span className="pill pill-grey">{t.altOk ? 'بديل مقبول' : 'أصلي فقط'}</span>
        )}
      </div>

      {t.note && (
        <div className="strip strip-navy" style={{ marginTop: 10, fontSize: 12.5 }}>
          ملاحظة: {t.note}
        </div>
      )}

      <button
        className="btn btn-primary btn-block"
        style={{ marginTop: 12 }}
        disabled={locked || quoted || !canPrice}
        onClick={() => onQuote(t)}
        data-testid={`quote-${t.id}`}
      >
        {actionLabel}
      </button>
    </div>
  )
}
