import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

// Default view — الحجار / عنابة (the shop's home area) until the seller picks.
const DEFAULT_CENTER = { lat: 36.8055, lng: 7.7346 }
const DEFAULT_ZOOM = 13

// Client-side Maps key, injected at build time (Vite). Restrict it by HTTP
// referrer in the Google Cloud console — it ships in the browser bundle.
const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const round = (n) => Math.round(n * 1e6) / 1e6

/**
 * Store-location picker — click or drag the pin to place a point, or «حدّد موقعي»
 * to jump to the device's GPS. Controlled: `value` is `{ lat, lng } | null` and
 * `onChange` receives the new point (or null on clear). Uses Google Maps; if no
 * API key is configured it degrades to geolocation-only so nothing breaks.
 */
export default function LocationPicker({ value, onChange }) {
  const boxRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const MarkerRef = useRef(null) // the google.maps.Marker class, once loaded
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [geoErr, setGeoErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)
  const [mapUnavailable, setMapUnavailable] = useState(!KEY)

  // Load Google Maps and build the map once.
  useEffect(() => {
    if (!KEY || !boxRef.current) return
    let cancelled = false
    const loader = new Loader({ apiKey: KEY })
    Promise.all([loader.importLibrary('maps'), loader.importLibrary('marker')])
      .then(([{ Map }, { Marker }]) => {
        if (cancelled || !boxRef.current) return
        MarkerRef.current = Marker
        const map = new Map(boxRef.current, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
        })
        map.addListener('click', (e) =>
          onChangeRef.current({ lat: round(e.latLng.lat()), lng: round(e.latLng.lng()) }),
        )
        mapRef.current = map
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) setMapUnavailable(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const placeMarker = (lat, lng) => {
    const map = mapRef.current
    const Marker = MarkerRef.current
    if (!map || !Marker) return
    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng })
    } else {
      const m = new Marker({ position: { lat, lng }, map, draggable: true })
      m.addListener('dragend', () => {
        const p = m.getPosition()
        onChangeRef.current({ lat: round(p.lat()), lng: round(p.lng()) })
      })
      markerRef.current = m
    }
  }

  // Keep the marker in sync with the controlled value (fillDemo, clear, GPS).
  useEffect(() => {
    if (!ready) return
    const map = mapRef.current
    if (value) {
      placeMarker(value.lat, value.lng)
      map.panTo(value)
      if (map.getZoom() < 15) map.setZoom(15)
    } else if (markerRef.current) {
      markerRef.current.setMap(null)
      markerRef.current = null
    }
  }, [value, ready]) // eslint-disable-line react-hooks/exhaustive-deps

  const locateMe = () => {
    setGeoErr('')
    if (!navigator.geolocation) {
      setGeoErr('المتصفح لا يدعم تحديد الموقع — ضع الدبوس يدوياً على الخريطة.')
      return
    }
    setBusy(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(false)
        onChangeRef.current({ lat: round(pos.coords.latitude), lng: round(pos.coords.longitude) })
      },
      () => {
        setBusy(false)
        setGeoErr('تعذّر تحديد موقعك — فعّل الإذن أو ضع الدبوس يدوياً على الخريطة.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return (
    <div className="loc-picker">
      <div className="loc-actions">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={locateMe}
          disabled={busy}
          data-testid="loc-detect"
        >
          {busy ? 'جارٍ التحديد…' : '📍 حدّد موقعي'}
        </button>
        {value ? (
          <>
            <span className="loc-coords" dir="ltr">
              {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
            </span>
            <button type="button" className="loc-clear" onClick={() => onChangeRef.current(null)} data-testid="loc-clear">
              مسح
            </button>
          </>
        ) : (
          <span className="loc-empty">
            {mapUnavailable ? 'استخدم زر «حدّد موقعي» لتحديد الموقع.' : 'انقر على الخريطة أو اسحب الدبوس لتحديد الموقع.'}
          </span>
        )}
      </div>
      {mapUnavailable ? (
        <div className="loc-note">
          خريطة Google غير مُهيّأة بعد — يمكنك تحديد موقعك بزر «حدّد موقعي».
        </div>
      ) : (
        <div ref={boxRef} className="loc-map" data-testid="loc-map" />
      )}
      {geoErr && <div className="err-text">{geoErr}</div>}
    </div>
  )
}
