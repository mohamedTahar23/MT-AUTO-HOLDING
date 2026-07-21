import { useEffect, useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { RefChip, Ltr, Pill } from '../ui/bits.jsx'
import { ageLabel } from '../../lib/format.js'
import OfferModal from '../modals/OfferModal.jsx'
import VideoModal from '../modals/VideoModal.jsx'

export default function Queue({ onData }) {
  const { api, shop, perms, isOwner } = useApp()
  const [tasks, setTasks] = useState(null)
  const [videoOrder, setVideoOrder] = useState(null)
  const [quoteTask, setQuoteTask] = useState(null)
  const [showVideo, setShowVideo] = useState(false)
  const [quoted, setQuoted] = useState(new Set())

  const canPrice = isOwner || perms.pricing
  const locked = shop?.r2?.active

  async function load() {
    const [t, orders] = await Promise.all([api.getTasks(), api.getOrders()])
    setTasks(t)
    setVideoOrder(orders.find((o) => o.proofStatus === 'بانتظار') || null)
  }
  useEffect(() => {
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (tasks === null) return <Loading />

  return (
    <>
      <div className="row between center wrap">
        <div>
          <h1 className="h1">طابور التسعير</h1>
          <p className="sub">آخر تحديث الآن · طلبات مجهّلة الهوية — بلا أي بيانات عن المشتري.</p>
        </div>
      </div>

      {/* priority video strip */}
      {videoOrder && (
        <div
          className="card card-pad"
          style={{ borderInlineStart: '4px solid var(--amber)', margin: '16px 0', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Pill tone="amber" dot>
            مطلوب فيديو
          </Pill>
          <div className="grow">
            <b>{videoOrder.partName}</b>
            <div className="faint" style={{ fontSize: 13 }}>
              {videoOrder.car} · ثبّت المشتري عرضك — صوّر القطعة لتأكيد الالتزام. <Ltr mono>{videoOrder.id}</Ltr>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowVideo(true)}>
            صوّر القطعة
          </button>
        </div>
      )}

      <h2 className="h1" style={{ fontSize: 16, margin: '18px 0 10px' }}>
        طلبات مفتوحة للتسعير
      </h2>

      {locked ? (
        <div className="strip strip-red">التسعير موقوف حالياً — الطابور غير متاح حتى مراجعة الدعم.</div>
      ) : tasks.length === 0 ? (
        <div className="card card-pad muted">لا توجد طلبات مفتوحة حالياً.</div>
      ) : (
        <div className="cards-grid">
          {tasks.map((t) => {
            const isQuoted = quoted.has(t.id)
            return (
              <div className="card card-pad" key={t.id}>
                <div className="row between center">
                  <Ltr mono style={{ fontWeight: 800, color: 'var(--navy-850)' }}>
                    {t.id}
                  </Ltr>
                  <span className="faint" style={{ fontSize: 12 }}>
                    {ageLabel(t.createdAt)}
                  </span>
                </div>
                <div style={{ fontWeight: 800, marginTop: 8 }}>{t.part.name}</div>
                <div className="faint" style={{ fontSize: 13 }}>
                  {t.car.make} {t.car.model} {t.car.year} · {t.car.engine}
                </div>
                <div style={{ margin: '10px 0' }}>
                  <RefChip value={t.part.ref} />
                </div>
                <div className="row wrap" style={{ gap: 6 }}>
                  <span className="pill pill-navy">الماركة المفضّلة · {t.prefBrand}</span>
                  <span className="pill pill-grey">{t.altOk ? 'بديل مقبول' : 'أصلي فقط'}</span>
                </div>
                {t.note && (
                  <div className="strip strip-navy" style={{ marginTop: 10, fontSize: 12.5 }}>
                    ملاحظة المشتري: {t.note}
                  </div>
                )}
                <button
                  className="btn btn-primary btn-block"
                  style={{ marginTop: 12 }}
                  disabled={!canPrice || isQuoted}
                  onClick={() => setQuoteTask(t)}
                  data-testid={`quote-${t.id}`}
                >
                  {isQuoted ? '✓ تم تقديم عرضك' : !canPrice ? 'لا تملك صلاحية التسعير' : 'قدّم عرضك'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {quoteTask && (
        <OfferModal
          task={quoteTask}
          onClose={() => setQuoteTask(null)}
          onSubmitted={() => {
            setQuoted((s) => new Set(s).add(quoteTask.id))
            onData?.()
          }}
        />
      )}
      {showVideo && videoOrder && (
        <VideoModal order={videoOrder} onClose={() => setShowVideo(false)} onDone={() => (load(), onData?.())} />
      )}
    </>
  )
}

function Loading() {
  return <div className="card card-pad muted">جارٍ التحميل…</div>
}
