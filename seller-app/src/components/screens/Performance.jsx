import { useEffect, useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { Ltr, Pill } from '../ui/bits.jsx'

export default function Performance() {
  const { api } = useApp()
  const [p, setP] = useState(null)

  useEffect(() => {
    api.getPerformance().then(setP)
  }, [api])

  if (!p) return <div className="card card-pad muted">جارٍ التحميل…</div>

  const full = Math.round(p.rating)
  return (
    <>
      <h1 className="h1">الأداء والتقييم</h1>
      <p className="sub">كلّما تحسّن أداؤك، حصلت على أولوية أعلى في الطلبات.</p>

      <div className="row wrap" style={{ marginTop: 16 }}>
        <div className="card card-pad" style={{ width: 260, textAlign: 'center' }}>
          <div className="mono" style={{ fontSize: 48, fontWeight: 900, color: 'var(--navy-850)' }}>
            {p.rating.toFixed(1)}
          </div>
          <div style={{ color: 'var(--amber)', fontSize: 22, letterSpacing: 2 }}>
            {'★'.repeat(full)}
            <span style={{ color: '#d5dbe4' }}>{'★'.repeat(5 - full)}</span>
          </div>
          <div className="faint" style={{ fontSize: 13, marginTop: 6 }}>
            من <Ltr mono>{p.reviews}</Ltr> طلب مكتمل
          </div>
          <div style={{ marginTop: 10 }}>
            <Pill tone="green" dot>
              {p.standing}
            </Pill>
          </div>
        </div>

        <div className="grow">
          <div className="tiles">
            {p.metrics.map((m) => (
              <div className="tile" key={m.key}>
                <div className="lbl">{m.label}</div>
                <div className="n">
                  <Ltr mono>
                    {m.value}
                    {m.unit || ''}
                  </Ltr>
                </div>
                {m.sub && (
                  <div className="faint" style={{ fontSize: 11.5 }}>
                    {m.sub}
                  </div>
                )}
              </div>
            ))}
            <div className="tile navy">
              <div className="lbl">طلبات مكتملة</div>
              <div className="n">
                <Ltr mono>{p.delivered}</Ltr>
              </div>
            </div>
            <div className="tile">
              <div className="lbl">عروض فائزة</div>
              <div className="n">
                <Ltr mono>{p.won}</Ltr>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
