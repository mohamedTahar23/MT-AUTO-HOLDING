import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { Pill, Ltr } from '../ui/bits.jsx'
import OfferModal from '../modals/OfferModal.jsx'
import VideoModal from '../modals/VideoModal.jsx'
import BrandFilter from '../queue/BrandFilter.jsx'
import RequestCard from '../queue/RequestCard.jsx'
import SponsoredRail from '../queue/SponsoredRail.jsx'

export default function Queue({ onData }) {
  const { api, shop, perms, isOwner } = useApp()
  const [tasks, setTasks] = useState(null)
  const [videoOrder, setVideoOrder] = useState(null)
  const [quoteTask, setQuoteTask] = useState(null)
  const [showVideo, setShowVideo] = useState(false)
  const [quoted, setQuoted] = useState(new Set())
  const [brands, setBrands] = useState(new Set())

  const canPrice = isOwner || perms.pricing
  const locked = shop?.r2?.active
  const brandGroups = api.getMeta().carBrandGroups

  async function load() {
    const [t, orders, offers] = await Promise.all([api.getTasks(), api.getOrders(), api.getOffers()])
    setTasks(t)
    setVideoOrder(orders.find((o) => o.proofStatus === 'بانتظار') || null)
    // A task already carrying a live (sent) offer shows as already priced.
    setQuoted(new Set(offers.filter((o) => o.status === 'sent').map((o) => o.taskId)))
  }
  useEffect(() => {
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Brand filter narrows the grid by car make; empty selection = show all.
  const filtered = useMemo(
    () => (brands.size && tasks ? tasks.filter((t) => brands.has(t.car.make)) : tasks),
    [brands, tasks],
  )
  const toggleBrand = (b) =>
    setBrands((prev) => {
      const next = new Set(prev)
      if (next.has(b)) next.delete(b)
      else next.add(b)
      return next
    })
  // Country heading = bulk toggle: if every brand in the group is already
  // selected, clear the whole group; otherwise select all of it.
  const toggleCountry = (list) =>
    setBrands((prev) => {
      const next = new Set(prev)
      const allOn = list.every((b) => next.has(b))
      list.forEach((b) => (allOn ? next.delete(b) : next.add(b)))
      return next
    })

  if (tasks === null) return <Loading />

  return (
    <div className="queue-cols">
      <div className="queue-main">
        <div className="row between center wrap">
          <div>
            <h1 className="h1">طابور التسعير</h1>
            <p className="sub">طلبات مجهّلة الهوية — بلا أي بيانات عن المشتري.</p>
          </div>
          <span className="queue-updated">آخر تحديث الآن</span>
        </div>

        {/* priority video strip — only while a won request awaits its proof video */}
        {videoOrder && (
          <div
            className="card card-pad"
            style={{ borderInlineStart: '3px solid var(--amber)', margin: '16px 0', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}
          >
            <Pill tone="amber" dot>
              مطلوب فيديو
            </Pill>
            {/* min-width forces a real wrap on phones — flex:1 alone would let
                the text column squeeze to a sliver beside the CTA instead. */}
            <div className="grow" style={{ minWidth: 200 }}>
              <div className="row center wrap" style={{ gap: 8 }}>
                <b>{videoOrder.partName}</b>
                <span style={{ fontWeight: 800, color: 'var(--navy-850)' }}>
                  <Ltr mono>{videoOrder.id}</Ltr>
                </span>
              </div>
              <div className="faint" style={{ fontSize: 13 }}>
                {videoOrder.car} · ثبّت المشتري عرضك — صوّر القطعة لتأكيد الالتزام.
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowVideo(true)}>
              صوّر القطعة
            </button>
          </div>
        )}

        <div className="row between center wrap" style={{ margin: '18px 0 10px', gap: 10 }}>
          <h2 className="h1" style={{ fontSize: 16, margin: 0 }}>
            طلبات مفتوحة للتسعير
          </h2>
          <BrandFilter groups={brandGroups} selected={brands} onToggle={toggleBrand} onToggleCountry={toggleCountry} onClear={() => setBrands(new Set())} />
        </div>

        {tasks.length === 0 ? (
          <div className="card card-pad muted">لا توجد طلبات مفتوحة حالياً.</div>
        ) : filtered.length === 0 ? (
          <div className="card card-pad muted" data-testid="queue-empty">
            لا توجد طلبات لهذه الماركات.
          </div>
        ) : (
          <div className="queue-grid">
            {filtered.map((t) => (
              <RequestCard
                key={t.id}
                task={t}
                quoted={quoted.has(t.id)}
                locked={locked}
                canPrice={canPrice}
                onQuote={setQuoteTask}
              />
            ))}
          </div>
        )}
      </div>

      <SponsoredRail tasks={tasks} />

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
    </div>
  )
}

function Loading() {
  return <div className="card card-pad muted">جارٍ التحميل…</div>
}
