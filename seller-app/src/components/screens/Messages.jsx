import { useEffect, useState } from 'react'
import { useApp } from '../../state/store.jsx'

// Thread with the MT team only (never with the buyer).
export default function Messages() {
  const { api } = useApp()
  const [msgs, setMsgs] = useState([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api.getMessages().then(setMsgs)
  }, [api])

  async function send(e) {
    e.preventDefault()
    if (!text.trim()) return
    setBusy(true)
    try {
      const msg = await api.sendMessage(text.trim())
      setMsgs((m) => [...m, msg])
      setText('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <h1 className="h1">الرسائل</h1>
      <p className="sub">محادثة مع فريق MT فقط. النزاعات تُدار عبر خط المحل الرسمي.</p>

      <div className="card card-pad" style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.from === 'shop' ? 'flex-start' : 'flex-end',
              maxWidth: '78%',
              background: m.from === 'shop' ? 'var(--amber-soft)' : '#f2f5fa',
              border: `1px solid ${m.from === 'shop' ? 'var(--amber-line)' : 'var(--line)'}`,
              borderRadius: 14,
              padding: '9px 13px',
              fontSize: 14,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--faint)', marginBottom: 2 }}>
              {m.from === 'shop' ? 'المحل' : 'فريق MT'}
            </div>
            {m.text}
          </div>
        ))}
      </div>

      <form className="row" style={{ marginTop: 12 }} onSubmit={send}>
        <input
          className="input grow"
          placeholder="اكتب رسالتك لفريق MT…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary" disabled={busy || !text.trim()}>
          إرسال
        </button>
      </form>
    </>
  )
}
