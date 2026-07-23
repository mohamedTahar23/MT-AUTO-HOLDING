import { useState } from 'react'
import { useApp } from '../../state/store.jsx'

export default function Header() {
  const { shop, session, isOwner, signOut, navigate, mode, setMode } = useApp()
  const [open, setOpen] = useState(false)
  const name = shop?.name || 'المحل'
  const initial = name.trim().charAt(0)
  const permCount = Object.values(session?.user?.perms || {}).filter(Boolean).length

  return (
    <header className="shell-head">
      <div className="brand">
        <span className="logo">MT</span> MT AUTO
      </div>

      {/* Sell ⇄ Buy mode — switches the whole app; choice persists (store). */}
      <div className="mode-seg" role="group" aria-label="وضع اللوحة">
        <button
          type="button"
          className={mode === 'sell' ? 'on' : ''}
          data-testid="mode-toggle-sell"
          onClick={() => setMode('sell')}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12.6 3.5H19a1.5 1.5 0 0 1 1.5 1.5v6.4a2 2 0 0 1-.59 1.42l-7.09 7.09a2 2 0 0 1-2.83 0l-4.9-4.9a2 2 0 0 1 0-2.83l7.09-7.09a2 2 0 0 1 1.42-.59z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <circle cx="15.8" cy="8.2" r="1.4" fill="currentColor" />
          </svg>
          البيع
        </button>
        <button
          type="button"
          className={mode === 'buy' ? 'on' : ''}
          data-testid="mode-toggle-buy"
          onClick={() => setMode('buy')}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 4h2l2.4 11.2a1.5 1.5 0 0 0 1.47 1.19h7.6a1.5 1.5 0 0 0 1.46-1.15L20.5 8H7"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10.5" cy="20" r="1.4" fill="currentColor" />
            <circle cx="17.5" cy="20" r="1.4" fill="currentColor" />
          </svg>
          الشراء
        </button>
      </div>

      <div className="acct">
        <button className="acct-btn" onClick={() => setOpen((o) => !o)}>
          <span className={`avatar ${isOwner ? '' : 'staff'}`}>{initial}</span>
          <span style={{ textAlign: 'start', lineHeight: 1.25 }}>
            <span style={{ display: 'block', fontWeight: 800, fontSize: 13.5, color: 'var(--navy-850)' }}>
              {isOwner ? name : session?.user?.name}
            </span>
            <span style={{ display: 'block', fontSize: 11.5, color: 'var(--faint)' }}>
              {isOwner ? shop?.wilaya : `موظف — ${name}`}
            </span>
          </span>
          <span aria-hidden style={{ color: 'var(--faint)' }}>
            ▾
          </span>
        </button>

        {open && (
          <div className="acct-menu" onMouseLeave={() => setOpen(false)}>
            {isOwner ? (
              <>
                <button onClick={() => (setMode('sell'), navigate('settings'), setOpen(false))}>
                  إعدادات الحساب<small>بيانات المحل والوثائق</small>
                </button>
                <button onClick={() => (setMode('sell'), navigate('team'), setOpen(false))}>
                  الفريق والصلاحيات<small>دعوة الموظفين والتحكم في صلاحياتهم</small>
                </button>
                <button onClick={() => (setMode('sell'), navigate('activity'), setOpen(false))}>
                  سجل نشاط الموظفين<small>من فعل ماذا ومتى</small>
                </button>
              </>
            ) : (
              <button style={{ cursor: 'default' }}>
                صلاحياتك ({permCount})
                <small>ما لم يمنحه لك المالك لا يظهر في حسابك. لتعديل صلاحياتك تواصل مع صاحب المحل.</small>
              </button>
            )}
            <div className="hr" style={{ margin: '6px 0' }} />
            <button className="danger" onClick={signOut}>
              تسجيل الخروج
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
