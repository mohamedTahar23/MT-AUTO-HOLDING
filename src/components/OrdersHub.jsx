import { BSTAT } from '../data.js'
import { IChevronStart, IOrders, IBox } from '../icons.jsx'

export default function OrdersHub({ app }) {
  const { s, vm, closeHub, closeOrderJourney, goOrder } = app
  const order = s.hubOrder
  return (
    <div className="hub" data-screen-label="طلباتي">
      <div className="hub-bar">
        <button className="hub-back" type="button" onClick={closeHub} aria-label="رجوع"><IChevronStart /></button>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
          <b>طلباتي</b>
          <span style={{ fontSize: 11.5, color: '#B9C6DA', fontWeight: 600 }}>تابِع حالة طلباتك وعروضك</span>
        </div>
      </div>
      <div className="hub-body">
        {!order ? (
          <div className="hub-wrap">
            {vm.orders.length > 0 ? (
              <>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--navy-850)', margin: 0, letterSpacing: '-.3px' }}>طلباتك</h2>
                    <span style={{ flex: 'none', fontSize: 12, color: 'var(--navy-700)', fontWeight: 800, background: 'var(--navy-tint)', border: '1px solid var(--navy-line)', borderRadius: 'var(--pill)', padding: '4px 11px' }}><bdi className="num" dir="ltr">{vm.ordersCount}</bdi> طلب</span>
                  </div>
                  <p style={{ margin: '5px 0 0', fontSize: 13, color: 'var(--muted)' }}>تابِع حالة كل طلب، عروضه، ودليل القطعة بالفيديو.</p>
                </div>
                <div className="hub-orders" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {vm.orders.map((o, i) => (
                    <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-sm)', overflow: 'hidden' }}>
                      <div onClick={o.open} role="button" tabIndex={0} style={{ padding: '15px 16px', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 13 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 800, padding: '5px 11px', borderRadius: 'var(--pill)', background: o.stBg, color: o.stFg, border: `1px solid ${o.stLine}`, whiteSpace: 'nowrap' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: o.accent, flex: 'none' }}></span>{o.stL}</span>
                          <span className="num" dir="ltr" style={{ fontSize: 11, fontWeight: 800, color: 'var(--navy-700)', background: 'var(--navy-tint)', borderRadius: 6, padding: '3px 8px' }}>{o.code}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                          <span style={{ flex: 'none', width: 46, height: 46, borderRadius: 13, background: 'var(--navy-tint)', color: 'var(--navy-700)', display: 'grid', placeItems: 'center' }}><IBox style={{ width: 23, height: 23 }} /></span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.2px', lineHeight: 1.25 }}>{o.part}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}><span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{o.car}</span><span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--faint)', flex: 'none' }}></span><span style={{ fontSize: 11.5, color: 'var(--faint)', fontWeight: 700 }}>{o.date}</span></div>
                          </div>
                          <IChevronStart style={{ width: 20, height: 20, color: 'var(--faint)', flex: 'none' }} />
                        </div>
                      </div>
                      {o.done && (
                        <div style={{ display: 'flex', borderTop: '1px solid var(--line-2)' }}>
                          <button type="button" onClick={o.reorder} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'none', border: 'none', padding: 12, fontFamily: 'inherit', fontSize: 13, fontWeight: 800, color: 'var(--navy-700)', cursor: 'pointer' }}><svg viewBox="0 0 24 24" width="17" height="17" fill="none"><path d="M4 12a8 8 0 0 1 13.7-5.7L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.7L4 16M4 20v-4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> اطلب مرة أخرى</button>
                          {o.remind && <a href={o.remindHref} target="_blank" rel="noopener" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, borderInlineStart: '1px solid var(--line-2)', padding: 12, fontFamily: 'inherit', fontSize: 13, fontWeight: 800, color: 'var(--muted)', textDecoration: 'none' }}><svg viewBox="0 0 24 24" width="17" height="17" fill="none"><path d="M18 9a6 6 0 0 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9zM10.5 19.5a1.8 1.8 0 0 0 3 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg> تذكير الصيانة</a>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="hub-empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 6, padding: '52px 26px' }}>
                <span style={{ width: 68, height: 68, borderRadius: 18, background: 'var(--navy-tint)', color: 'var(--navy-700)', display: 'grid', placeItems: 'center', marginBottom: 8 }}><IOrders style={{ width: 32, height: 32 }} /></span>
                <div style={{ fontSize: 16.5, fontWeight: 800, color: 'var(--ink)' }}>لا طلبات بعد</div>
                <div style={{ fontSize: 13.5, color: 'var(--muted)', maxWidth: 280, lineHeight: 1.7 }}>ابدأ بطلب قطعة وستظهر هنا لتتابع حالتها وعروضها.</div>
                <button className="btn btn-primary" type="button" onClick={goOrder} style={{ marginTop: 14 }}>اطلب قطعتك</button>
              </div>
            )}
          </div>
        ) : (
          <OrderJourneyStub order={order} onBack={closeOrderJourney} />
        )}
      </div>
    </div>
  )
}

// The full order-tracking journey (sourcing → quotes → video proof → confirm →
// delivery → complete) is a separate sub-app, stubbed here per the agreed scope.
function OrderJourneyStub({ order, onBack }) {
  const st = BSTAT[order.status] || { l: order.status, c: 'navy' }
  const STAGES = [
    { k: 'sourcing', l: 'قيد المطابقة' }, { k: 'quotes', l: 'عروض جاهزة' }, { k: 'video', l: 'دليل القطعة' },
    { k: 'confirm', l: 'التأكيد' }, { k: 'delivery', l: 'في الطريق' }, { k: 'delivered', l: 'سُلّم' },
  ]
  const curIdx = Math.max(0, STAGES.findIndex((x) => x.k === order.status))
  return (
    <>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '14px 16px 6px' }}>
        <button type="button" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 800, color: 'var(--navy-700)', cursor: 'pointer', padding: '8px 2px' }}><IChevronStart style={{ width: 18, height: 18 }} /> كل الطلبات</button>
      </div>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '4px 16px 48px' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-sm)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '16px 18px', borderBottom: '1px solid var(--line-2)' }}>
            <span style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--navy-tint)', color: 'var(--navy-700)', display: 'grid', placeItems: 'center', flex: 'none' }}><IBox style={{ width: 23, height: 23 }} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)', display: 'block' }}>{order.part}</b>
              <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{order.car} · <bdi className="num" dir="ltr">{order.code}</bdi></span>
            </div>
            <span style={{ flex: 'none', fontSize: 11.5, fontWeight: 800, padding: '5px 11px', borderRadius: 'var(--pill)', background: st.c === 'green' ? 'var(--green-soft)' : st.c === 'amber' ? 'var(--amber-soft)' : 'var(--navy-tint)', color: st.c === 'green' ? 'var(--green-text)' : st.c === 'amber' ? 'var(--amber-text)' : 'var(--navy-700)', border: `1px solid ${st.c === 'green' ? 'var(--green-line)' : st.c === 'amber' ? 'var(--amber-line)' : 'var(--navy-line)'}` }}>{st.l}</span>
          </div>
          <div style={{ padding: '18px' }}>
            <div className="track">
              {STAGES.map((stg, i) => (
                <div key={stg.k} className={'tk' + (i < curIdx ? ' done' : i === curIdx ? ' cur' : '')}>
                  <div className="tk-rail">
                    <div className="dot">{i < curIdx ? <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg> : <span className="num" style={{ fontSize: 13, fontWeight: 800 }}>{i + 1}</span>}</div>
                    <div className="bar"></div>
                  </div>
                  <div className="tk-body"><b>{stg.l}</b></div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--navy-tint)', border: '1px solid var(--navy-line)', color: 'var(--navy-700)', borderRadius: 12, padding: '12px 14px', fontSize: 12.5, fontWeight: 700, marginTop: 8 }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" style={{ flex: 'none', marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>
              <span>ستصلك تنبيهات كل خطوة على واتساب. تفاصيل العروض ودليل القطعة بالفيديو تظهر هنا عند توفّرها.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
