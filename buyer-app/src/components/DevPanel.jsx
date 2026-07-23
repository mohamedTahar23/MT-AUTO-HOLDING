import { useState } from 'react'
import { useDevMode } from '../devmode.js'

// Sits above every product layer (modals top out at z-index 96 in extra.css).
const Z = 2147483000

const panel = {
  position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: Z,
  width: 340, maxWidth: 'calc(100vw - 24px)', maxHeight: '72vh', overflowY: 'auto',
  background: 'var(--navy-900)', color: '#fff', border: '1px solid var(--navy-700)',
  borderRadius: 16, boxShadow: '0 24px 60px rgba(8,16,30,.5)', padding: 14,
  fontFamily: 'inherit', direction: 'rtl',
}
// Collapsed launcher — pinned to the inline-start edge, vertically centred, so
// it stays clear of the bottom-anchored product CTAs (and the e2e clicks).
const launcher = {
  position: 'fixed', top: '50%', insetInlineStart: 8, transform: 'translateY(-50%)', zIndex: Z,
  display: 'inline-flex', alignItems: 'center', gap: 7, cursor: 'pointer',
  background: 'var(--navy-900)', color: '#fff', border: '1px solid var(--navy-700)',
  borderRadius: 999, padding: '9px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 800,
  boxShadow: '0 12px 30px rgba(8,16,30,.42)',
}
const secTitle = { fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,.55)', margin: '12px 2px 7px', letterSpacing: '.3px' }
const row = { display: 'flex', flexWrap: 'wrap', gap: 7 }
const iconBtn = { border: 'none', background: 'rgba(255,255,255,.14)', color: '#fff', width: 26, height: 26, borderRadius: 8, cursor: 'pointer', fontSize: 15, lineHeight: 1, fontFamily: 'inherit' }

function Btn({ active, onClick, children, primary }) {
  const base = {
    border: '1px solid transparent', borderRadius: 9, padding: '8px 11px', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 12.5, fontWeight: 800, flex: '1 1 auto', minWidth: 92, textAlign: 'center',
  }
  const style = active
    ? { ...base, background: 'var(--amber)', color: 'var(--navy-900)' }
    : primary
      ? { ...base, background: 'rgba(255,138,31,.16)', color: 'var(--amber)', borderColor: 'rgba(255,138,31,.4)' }
      : { ...base, background: 'rgba(255,255,255,.1)', color: '#fff' }
  return <button type="button" onClick={onClick} style={style}>{children}</button>
}

/**
 * Floating navigator. The launcher is ALWAYS visible so dev mode is reachable
 * with one click — no `?dev` / shortcut needed. Clicking it switches dev mode on
 * (which auto-logs-in and drops the wizard gates via App.jsx); the shortcut and
 * `?dev` param still work too. It drives the app through the same handlers the
 * product uses (`app` prop bag), so nothing here is a parallel code path.
 */
export default function DevPanel({ app }) {
  const [dev, toggleDev] = useDevMode()
  const [open, setOpen] = useState(false)

  const { s, devLogin, devGo, logout, openContact, openTerms, openAcct, openHub, toggleChat } = app

  // Collapsed pill — shown before dev mode is on, and whenever the panel is
  // closed. Clicking it turns dev mode on (if needed) and opens the panel.
  if (!dev || !open) {
    return (
      <button type="button" style={launcher} onClick={() => { if (!dev) toggleDev(); setOpen(true) }} title="وضع المطوّر — التنقّل الحر (Ctrl/⌘+Shift+D)">
        🛠️ وضع المطوّر
      </button>
    )
  }

  return (
    <div style={panel} role="dialog" aria-label="لوحة المطوّر">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <b style={{ fontSize: 13.5, fontWeight: 800, flex: 1 }}>🛠️ وضع المطوّر</b>
        <button type="button" style={iconBtn} title="طيّ اللوحة" onClick={() => setOpen(false)}>–</button>
        <button type="button" style={iconBtn} title="إيقاف وضع المطوّر" onClick={() => { toggleDev(); setOpen(false) }}>×</button>
      </div>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', margin: '0 2px 2px', lineHeight: 1.6 }}>
        التحقّق من الحقول معطّل — تنقّل بحرية بين كل الصفحات.
      </p>

      <div style={secTitle}>الحساب</div>
      <div style={row}>
        {!s.loggedIn
          ? <Btn primary onClick={devLogin}>دخول تجريبي</Btn>
          : <Btn onClick={logout}>تسجيل الخروج</Btn>}
      </div>

      <div style={secTitle}>خطوات الطلب</div>
      <div style={row}>
        <Btn active={s.loggedIn && s.step === 'vehicle'} onClick={() => devGo('vehicle')}>١· السيارة</Btn>
        <Btn active={s.loggedIn && s.step === 'part'} onClick={() => devGo('part')}>٢· القطعة</Btn>
        <Btn active={s.loggedIn && s.step === 'details'} onClick={() => devGo('details')}>٣· الإرسال</Btn>
        <Btn active={s.loggedIn && s.step === 'sent'} onClick={() => devGo('sent')}>تم الإرسال</Btn>
      </div>

      <div style={secTitle}>النوافذ والصفحات</div>
      <div style={row}>
        <Btn onClick={openHub}>طلباتي</Btn>
        <Btn onClick={openAcct}>حسابي</Btn>
        <Btn onClick={openContact}>تواصل</Btn>
        <Btn onClick={openTerms}>الشروط</Btn>
        <Btn onClick={toggleChat}>المساعد</Btn>
      </div>
    </div>
  )
}
