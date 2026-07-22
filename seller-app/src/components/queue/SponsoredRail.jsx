import { useEffect, useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { Ltr } from '../ui/bits.jsx'
import { ageLabel } from '../../lib/format.js'

const ROTATE_MS = 4500

/** 4:5 sponsored ad carousel — crossfades slides (RTL-safe), auto-advances. */
function AdCarousel({ ads, onCta }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (ads.length < 2) return undefined
    const id = setInterval(() => setI((n) => (n + 1) % ads.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [ads.length])

  if (!ads.length) return null

  return (
    <div>
      <div className="ad-card" data-testid="ad-carousel">
        {ads.map((ad, n) => (
          <div
            key={ad.id}
            className={`ad-slide ${n === i ? 'on' : ''}`}
            style={{ background: `linear-gradient(150deg, ${ad.hue}, #0A1830)` }}
            aria-hidden={n !== i}
          >
            <div className="ad-brand">{ad.brand}</div>
            <div className="ad-body">
              <span className="ad-eyebrow">{ad.eyebrow}</span>
              <div className="ad-title" style={{ marginTop: 8 }}>
                {ad.title}
              </div>
              <div className="ad-sub">{ad.sub}</div>
              {ad.cta && (
                <button className="ad-cta" onClick={() => onCta?.(ad)} tabIndex={n === i ? 0 : -1}>
                  {ad.cta}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {ads.length > 1 && (
        <div className="ad-dots">
          {ads.map((ad, n) => (
            <button
              key={ad.id}
              type="button"
              className={`ad-dot ${n === i ? 'on' : ''}`}
              onClick={() => setI(n)}
              aria-label={`إعلان ${n + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Right rail: a "مموّل" (sponsored) ad carousel and a live feed of the newest
 * open requests. `tasks` is the already-loaded queue list (no extra fetch).
 */
export default function SponsoredRail({ tasks }) {
  const { api, toast } = useApp()
  const [ads, setAds] = useState([])

  useEffect(() => {
    let alive = true
    api.getAds().then((a) => alive && setAds(a))
    return () => {
      alive = false
    }
  }, [api])

  const feed = (tasks || []).slice(0, 4)

  return (
    <aside className="queue-rail" aria-label="محتوى مموّل وطلبات واردة">
      <div className="rail-spon">مموّل</div>
      <AdCarousel ads={ads} onCta={() => toast('سنوافيك بتفاصيل العرض قريباً — شكراً لاهتمامك.', 'ok')} />

      {feed.length > 0 && (
        <div className="live-feed card card-pad">
          <div className="live-title">
            <span className="live-pulse" /> طلبات واردة الآن
          </div>
          {feed.map((t) => (
            <div className="live-row" key={t.id}>
              <div>
                <div className="live-part">{t.part.name}</div>
                <div className="live-meta">
                  {t.car.make} {t.car.model} · <Ltr mono>{t.id}</Ltr>
                </div>
              </div>
              <span className="live-meta">{ageLabel(t.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}
