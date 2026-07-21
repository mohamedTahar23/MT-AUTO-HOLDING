import { useEffect, useState } from 'react'
import { useApp } from '../../state/store.jsx'

// إعلانات MT — read-only announcements.
export default function Feed() {
  const { api } = useApp()
  const [items, setItems] = useState([])

  useEffect(() => {
    api.getAnnouncements().then(setItems)
  }, [api])

  return (
    <>
      <h1 className="h1">إعلانات MT</h1>
      <p className="sub">تحديثات ومعلومات من فريق MT AUTO.</p>

      <div className="stack" style={{ marginTop: 16 }}>
        {items.map((a) => (
          <div className="card card-pad" key={a.id}>
            <div style={{ fontWeight: 800, color: 'var(--navy-850)' }}>{a.title}</div>
            <p className="sub" style={{ marginTop: 6 }}>
              {a.body}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
