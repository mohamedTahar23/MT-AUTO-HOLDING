import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { Tile } from '../ui/bits.jsx'
import WithdrawModal from '../modals/WithdrawModal.jsx'
import OfferModal from '../modals/OfferModal.jsx'
import VideoModal from '../modals/VideoModal.jsx'
import WonBanner from '../offers/WonBanner.jsx'
import OffersTable from '../offers/OffersTable.jsx'
import { groupByRequest } from '../offers/derive.js'

export default function MyOffers({ onData }) {
  const { api, shop, toast } = useApp()
  const [offers, setOffers] = useState(null)
  const [tasks, setTasks] = useState([])
  const [orders, setOrders] = useState([])
  const [withdrawing, setWithdrawing] = useState(null)
  const [addingTask, setAddingTask] = useState(null) // task for "+ عرض لعلامة أخرى"
  const [filming, setFilming] = useState(null) // order for "صوّر القطعة"
  const [delivered, setDelivered] = useState(new Set()) // prepared-shipment toggles

  const locked = shop?.r2?.active

  async function load() {
    const [o, t, ord] = await Promise.all([api.getOffers(), api.getTasks(), api.getOrders()])
    setOffers(o)
    setTasks(t)
    setOrders(ord)
  }
  useEffect(() => {
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const orderByOfferId = useMemo(() => new Map(orders.map((ord) => [ord.offerId, ord])), [orders])
  const tasksById = useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks])

  // The banner, stat tiles, and table all derive from the same offers list.
  const { groups, counts } = useMemo(
    () => groupByRequest(offers || [], orderByOfferId),
    [offers, orderByOfferId],
  )
  const wonOffers = useMemo(
    () => groups.flatMap((g) => g.offers).filter((o) => o.derived === 'won'),
    [groups],
  )

  if (offers === null) return <div className="card card-pad muted">جارٍ التحميل…</div>

  const toggleDelivered = (id) =>
    setDelivered((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  function film(offer) {
    const order = orderByOfferId.get(offer.id)
    if (order) setFilming(order)
    else toast('لا يوجد طلب مرتبط بهذا العرض بعد.', 'info')
  }

  return (
    <>
      <h1 className="h1">عروضي</h1>
      <p className="sub">تقديم العرض لا يضمن الفوز — يقارن المشتري العروض ويختار.</p>

      <WonBanner wonOffers={wonOffers} delivered={delivered} onToggleDelivered={toggleDelivered} />

      <div className="tiles" style={{ margin: '16px 0' }}>
        <div data-testid="stat-video" style={{ display: 'contents' }}>
          <Tile label="بانتظار الفيديو" value={counts.video} dotTone="var(--amber)" />
        </div>
        <div data-testid="stat-review" style={{ display: 'contents' }}>
          <Tile label="قيد المراجعة" value={counts.review} dotTone="#C7CCD5" />
        </div>
        <div data-testid="stat-won" style={{ display: 'contents' }}>
          <Tile label="تم تأكيد الطلب" value={counts.won} navy />
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="card card-pad muted">لا عروض بعد — قدّم عرضك الأول من طابور التسعير.</div>
      ) : (
        <OffersTable
          groups={groups}
          tasksById={tasksById}
          locked={locked}
          delivered={delivered}
          onToggleDelivered={toggleDelivered}
          onWithdraw={setWithdrawing}
          onFilm={film}
          onAddBrand={setAddingTask}
        />
      )}

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
      {addingTask && (
        <OfferModal
          task={addingTask}
          onClose={() => setAddingTask(null)}
          onSubmitted={() => {
            load()
            onData?.()
          }}
        />
      )}
      {filming && (
        <VideoModal
          order={filming}
          onClose={() => setFilming(null)}
          onDone={() => {
            load()
            onData?.()
          }}
        />
      )}
    </>
  )
}
