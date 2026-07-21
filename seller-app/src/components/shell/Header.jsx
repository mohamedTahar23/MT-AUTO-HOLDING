import { useState } from 'react'
import { useApp } from '../../state/store.jsx'

export default function Header() {
  const { shop, session, isOwner, signOut, navigate } = useApp()
  const [open, setOpen] = useState(false)
  const name = shop?.name || 'المحل'
  const initial = name.trim().charAt(0)
  const permCount = Object.values(session?.user?.perms || {}).filter(Boolean).length

  return (
    <header className="shell-head">
      <div className="brand">
        <span className="logo">MT</span> MT AUTO
      </div>

      <div className="acct">
        <button className="bell" title="الإشعارات" onClick={() => navigate('feed')}>
          🔔<span className="badge">2</span>
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
                <button onClick={() => (navigate('settings'), setOpen(false))}>
                  إعدادات الحساب<small>بيانات المحل والوثائق</small>
                </button>
                <button onClick={() => (navigate('team'), setOpen(false))}>
                  الفريق والصلاحيات<small>دعوة الموظفين والتحكم في صلاحياتهم</small>
                </button>
                <button onClick={() => (navigate('activity'), setOpen(false))}>
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
