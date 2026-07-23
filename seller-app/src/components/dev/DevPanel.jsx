import { useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { useDevMode } from '../../lib/devmode.js'

// Sits above every product layer (modals/mobile-nav top out at z-index 120).
const Z = 2147483000

const panel = {
  position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: Z,
  width: 340, maxWidth: 'calc(100vw - 24px)', maxHeight: '72vh', overflowY: 'auto',
  background: 'var(--navy-900)', color: '#fff', border: '1px solid var(--navy-700)',
  borderRadius: 16, boxShadow: '0 24px 60px rgba(8,16,30,.5)', padding: 14,
  fontFamily: 'inherit', direction: 'rtl',
}
// Collapsed launcher — pinned to the inline-start edge, vertically centred, so
// it stays clear of the bottom-anchored nav/CTAs (and the e2e clicks).
const launcher = {
  position: 'fixed', top: '50%', insetInlineStart: 8, transform: 'translateY(-50%)', zIndex: Z,
  display: 'inline-flex', alignItems: 'center', gap: 7, cursor: 'pointer',
  background: 'var(--navy-900)', color: '#fff', border: '1px solid var(--navy-700)',
  borderRadius: 999, padding: '9px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 800,
  boxShadow: '0 12px 30px rgba(8,16,30,.42)',
}
const secTitle = { fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,.55)', margin: '12px 2px 7px', letterSpacing: '.3px' }
const rowStyle = { display: 'flex', flexWrap: 'wrap', gap: 7 }
const iconBtn = { border: 'none', background: 'rgba(255,255,255,.14)', color: '#fff', width: 26, height: 26, borderRadius: 8, cursor: 'pointer', fontSize: 15, lineHeight: 1, fontFamily: 'inherit' }

function Btn({ active, disabled, onClick, children, primary }) {
  const base = {
    border: '1px solid transparent', borderRadius: 9, padding: '8px 11px',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
    fontFamily: 'inherit', fontSize: 12.5, fontWeight: 800, flex: '1 1 auto', minWidth: 92, textAlign: 'center',
  }
  const style = active
    ? { ...base, background: 'var(--amber)', color: 'var(--navy-900)' }
    : primary
      ? { ...base, background: 'rgba(255,138,31,.16)', color: 'var(--amber)', borderColor: 'rgba(255,138,31,.4)' }
      : { ...base, background: 'rgba(255,255,255,.1)', color: '#fff' }
  return <button type="button" disabled={disabled} onClick={onClick} style={style}>{children}</button>
}

const SCREENS = [
  { name: 'queue', label: 'طابور التسعير' },
  { name: 'quotes', label: 'عروضي' },
  { name: 'deliveries', label: 'التسليمات' },
  { name: 'payouts', label: 'الأرباح' },
  { name: 'performance', label: 'الأداء' },
  { name: 'messages', label: 'الرسائل' },
]

/**
 * Floating navigator. The launcher is ALWAYS visible so dev mode is reachable
 * with one click — no `?dev` / shortcut needed. Clicking it switches dev mode on;
 * the shortcut and `?dev` param still work too. Drives the store's own navigate /
 * mode / account-modal actions, plus the mock `_devSignIn` helper so you land in
 * the shell without the auth flow.
 */
export default function DevPanel() {
  const [dev, toggleDev] = useDevMode()
  const [open, setOpen] = useState(false)
  const { api, session, route, navigate, isOwner, openAccountModal, mode, setMode, signIn, signOut, refreshShop, shop } = useApp()

  const canDevSignIn = typeof api._devSignIn === 'function'

  async function devSignIn(userId) {
    if (!canDevSignIn) return
    const res = await api._devSignIn(userId)
    signIn(res.session) // syncs React state + routes to the queue; store loads the shop
  }
  async function toggleR2() {
    await api._debugSetR2(!shop?.r2?.active)
    await refreshShop()
  }

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
        تنقّل بحرية بين كل الشاشات دون المرور بتسجيل الدخول.
      </p>

      <div style={secTitle}>الدخول</div>
      <div style={rowStyle}>
        {canDevSignIn && <Btn primary active={session && isOwner} onClick={() => devSignIn('u_owner')}>دخول كمالك</Btn>}
        {canDevSignIn && <Btn primary active={session && !isOwner} onClick={() => devSignIn('u_emp_1')}>دخول كموظف</Btn>}
        {session && <Btn onClick={signOut}>تسجيل الخروج</Btn>}
      </div>

      <div style={secTitle}>الشاشات</div>
      <div style={rowStyle}>
        {SCREENS.map((sc) => (
          <Btn key={sc.name} disabled={!session} active={mode === 'sell' && route.name === sc.name} onClick={() => { setMode('sell'); navigate(sc.name) }}>
            {sc.label}
          </Btn>
        ))}
      </div>

      <div style={secTitle}>حساب المالك</div>
      <div style={rowStyle}>
        <Btn disabled={!session || !isOwner} onClick={() => openAccountModal('settings')}>الإعدادات</Btn>
        <Btn disabled={!session || !isOwner} onClick={() => openAccountModal('team')}>الفريق</Btn>
        <Btn disabled={!session || !isOwner} onClick={() => openAccountModal('activity')}>سجل النشاط</Btn>
      </div>

      <div style={secTitle}>الوضع والحالة</div>
      <div style={rowStyle}>
        <Btn disabled={!session} active={mode === 'buy'} onClick={() => setMode(mode === 'buy' ? 'sell' : 'buy')}>
          {mode === 'buy' ? 'وضع الشراء ✓' : 'وضع الشراء'}
        </Btn>
        <Btn disabled={!session} active={Boolean(shop?.r2?.active)} onClick={toggleR2}>
          {shop?.r2?.active ? 'القيد R2 مفعّل' : 'تفعيل القيد R2'}
        </Btn>
      </div>
    </div>
  )
}
