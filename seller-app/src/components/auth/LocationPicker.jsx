import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Default view — الحجار / عنابة (the shop's home area) until the seller picks.
const DEFAULT_CENTER = [36.8055, 7.7346]
const DEFAULT_ZOOM = 13

// Navy tear-drop pin as a divIcon. Using an inline SVG sidesteps Leaflet's
// broken default marker-image paths under bundlers and matches the navy scale.
const PIN = L.divIcon({
  className: 'loc-pin',
  html:
    '<svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">' +
    '<path d="M12 2a7 7 0 0 0-7 7c0 5.1 7 13 7 13s7-7.9 7-13a7 7 0 0 0-7-7z" fill="#0E2042" stroke="#fff" stroke-width="1.4"/>' +
    '<circle cx="12" cy="9" r="2.7" fill="#fff"/></svg>',
  iconSize: [32, 32],
  iconAnchor: [16, 30],
})

const round = (n) => Math.round(n * 1e6) / 1e6
const same = (a, b) => !!a && !!b && Math.abs(a.lat - b.lat) < 1e-6 && Math.abs(a.lng - b.lng) < 1e-6

/**
 * Store-location picker — click or drag the pin to place a point, or «حدّد موقعي»
 * to jump to the device's GPS. Controlled: `value` is `{ lat, lng } | null` and
 * `onChange` receives the new point (or null on clear). OpenStreetMap tiles.
 */
export default function LocationPicker({ value, onChange }) {
  const boxRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const [geoErr, setGeoErr] = useState('')
  const [busy, setBusy] = useState(false)

  const placeMarker = (lat, lng) => {
    const map = mapRef.current
    if (!map) return
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
    } else {
      const m = L.marker([lat, lng], { draggable: true, icon: PIN, keyboard: false }).addTo(map)
      m.on('dragend', () => {
        const p = m.getLatLng()
        onChange({ lat: round(p.lat), lng: round(p.lng) })
      })
      markerRef.current = m
    }
  }

  // Build the map once, on mount.
  useEffect(() => {
    if (!boxRef.current || mapRef.current) return
    const map = L.map(boxRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      scrollWheelZoom: false,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)
    map.on('click', (e) => onChange({ lat: round(e.latlng.lat), lng: round(e.latlng.lng) }))
    mapRef.current = map
    // The container may have been laid out after init — re-measure tiles.
    const t = setTimeout(() => map.invalidateSize(), 60)
    return () => {
      clearTimeout(t)
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the marker in sync with the controlled value (fillDemo, clear, GPS).
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (value) {
      const cur = markerRef.current?.getLatLng()
      if (!same(value, cur && { lat: cur.lat, lng: cur.lng })) {
        placeMarker(value.lat, value.lng)
        map.setView([value.lat, value.lng], Math.max(map.getZoom(), 15))
      }
    } else if (markerRef.current) {
      map.removeLayer(markerRef.current)
      markerRef.current = null
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

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
        onChange({ lat: round(pos.coords.latitude), lng: round(pos.coords.longitude) })
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
            <button type="button" className="loc-clear" onClick={() => onChange(null)} data-testid="loc-clear">
              مسح
            </button>
          </>
        ) : (
          <span className="loc-empty">انقر على الخريطة أو اسحب الدبوس لتحديد الموقع.</span>
        )}
      </div>
      <div ref={boxRef} className="loc-map" data-testid="loc-map" />
      {geoErr && <div className="err-text">{geoErr}</div>}
    </div>
  )
}
