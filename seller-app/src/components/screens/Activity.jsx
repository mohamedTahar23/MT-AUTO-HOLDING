import { useEffect, useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { Ltr } from '../ui/bits.jsx'

// سجل نشاط الموظفين — owner-only audit list. Every row is a STAFF action
// (owner actions are never listed); the status dot encodes the action kind
// (quote/message/delivery/withdraw/other), colors mapped in app.css.
export default function Activity() {
  const { api } = useApp()
  const [rows, setRows] = useState(null)

  useEffect(() => {
    api.getActivityLog().then(setRows)
  }, [api])

  if (rows === null) return <div className="card card-pad muted">جارٍ التحميل…</div>

  return (
    <div data-testid="activity-screen">
      <h1 className="h1">سجل نشاط الموظفين</h1>
      <p className="sub">كل إجراء يقوم به موظفوك يُنسَب إلى صاحبه — للمالك وحده.</p>

      <div className="act-card">
        <div className="act-head">
          <span className="act-main">الموظف والإجراء</span>
          <span className="act-time">الوقت</span>
        </div>

        {rows.map((r) => (
          <div className="act-row" key={r.id} data-testid="activity-row">
            <span className="act-avatar" aria-hidden>
              {r.initial}
            </span>
            <div className="act-main">
              <div className="act-line">
                <Ltr>
                  <b>{r.who}</b>
                </Ltr>{' '}
                <span className="act-verb">{r.act}</span>{' '}
                <Ltr>
                  <b>{r.target}</b>
                </Ltr>
              </div>
              {r.meta && (
                <div className="act-meta">
                  <Ltr>{r.meta}</Ltr>
                </div>
              )}
            </div>
            <span className={`act-dot ${r.kind}`} aria-hidden />
            <span className="act-time">{r.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
