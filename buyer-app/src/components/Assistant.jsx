import { useEffect, useRef } from 'react'
import { WHATSAPP } from '../data.js'
import { SUGGESTIONS } from '../App.jsx'
import { IBot, IClose, IWhatsApp, ISend } from '../icons.jsx'

export default function Assistant({ app }) {
  const { s, vm, toggleChat, onChatInput, sendChat } = app
  const bodyRef = useRef(null)
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [s.chatMessages, s.chatSending])

  if (!s.chatOpen) {
    return (
      <button type="button" className="mysr-fab" onClick={toggleChat} aria-label="افتح مساعد الميسر">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><rect x="4" y="8" width="16" height="11.5" rx="3.2" stroke="#fff" strokeWidth="1.7" /><path d="M12 4.4V8" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" /><circle cx="12" cy="3.7" r="1.5" fill="#fff" /><circle cx="9.4" cy="13.3" r="1.5" fill="#FF8A1F" /><circle cx="14.6" cy="13.3" r="1.5" fill="#FF8A1F" /><path d="M9.6 16.7h4.8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /><path d="M2.4 12.4v2.6M21.6 12.4v2.6" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" /></svg>
      </button>
    )
  }

  return (
    <div className="mysr-panel" data-screen-label="مساعد الميسر">
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', background: 'var(--navy-850)', color: '#fff' }}>
        <span style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,.12)', display: 'grid', placeItems: 'center', flex: 'none', color: 'var(--amber)' }}><IBot style={{ width: 23, height: 23 }} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15.5, fontWeight: 800, lineHeight: 1.2 }}>الميسر</div>
          <div style={{ fontSize: 11.5, color: '#B9C6DA', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3FCF8E', display: 'inline-block' }}></span>مساعد ذكي — متصل</div>
        </div>
        <a className="mysr-hwa" href={WHATSAPP} target="_blank" rel="noopener" aria-label="تواصل مع الدعم البشري عبر واتساب" title="الدعم البشري عبر واتساب"><IWhatsApp style={{ width: 20, height: 20 }} /></a>
        <button type="button" onClick={toggleChat} aria-label="إغلاق" style={{ width: 34, height: 34, borderRadius: 9, border: 'none', background: 'rgba(255,255,255,.1)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', flex: 'none' }}><IClose style={{ width: 20, height: 20 }} /></button>
      </div>

      <div className="mysr-body" ref={bodyRef}>
        {s.chatMessages.map((m, i) => (
          <div key={i} className={'mysr-b ' + (m.role === 'assistant' ? 'a' : 'u')}>{m.text}</div>
        ))}
        {s.chatSending && <div className="mysr-b a mysr-dots"><span></span><span></span><span></span></div>}
        {vm.showSuggestions && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2 }}>
            {SUGGESTIONS.map((t, i) => (
              <button key={i} type="button" className="mysr-chip" onClick={() => sendChat(t)}>{t}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--line)', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input className="inp" style={{ flex: 1, margin: 0 }} placeholder="اكتب سؤالك…" value={s.chatInput} onChange={onChatInput} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() } }} />
          <button type="button" className="mysr-send" onClick={() => sendChat()} disabled={vm.chatSendDisabled} aria-label="إرسال"><ISend style={{ width: 20, height: 20 }} /></button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 9, fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>
          <span>تحتاج إلى شخص؟</span>
          <a className="mysr-sup" href={WHATSAPP} target="_blank" rel="noopener"><IWhatsApp style={{ width: 15, height: 15 }} />الدعم البشري عبر واتساب</a>
        </div>
        <div style={{ fontSize: 10, color: 'var(--faint)', textAlign: 'center', marginTop: 5, fontWeight: 700 }}>الميسر مساعد آلي — للمساعدة والتوجيه فقط</div>
      </div>
    </div>
  )
}
