import { useEffect, useState } from 'react'
import { useApp } from '../../state/store.jsx'
import { Ltr, Spinner } from '../ui/bits.jsx'

// الفريق والصلاحيات — owner-only popup section: invite card + team list with
// expandable per-seat permission switches. Whatever the owner doesn't grant
// simply never appears in the employee's account.

const PERMS = [
  { key: 'pricing', label: 'التسعير', desc: 'تقديم العروض وسحبها من طابور التسعير' },
  { key: 'media', label: 'الوسائط', desc: 'تصوير ورفع فيديو الإثبات للطلبات' },
  { key: 'payout', label: 'الأرباح', desc: 'الاطلاع على المدفوعات وتأكيد استلامها' },
  { key: 'team', label: 'الفريق', desc: 'دعوة موظفين وإدارة صلاحياتهم' },
]

export default function TeamSection() {
  const { api, toast } = useApp()
  const [users, setUsers] = useState(null)
  const [email, setEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [expanded, setExpanded] = useState(null) // seat (user) id

  useEffect(() => {
    api.getShopUsers().then(setUsers)
  }, [api])

  const invite = async (e) => {
    e.preventDefault()
    if (!email.trim() || inviting) return
    setInviting(true)
    try {
      await api.inviteTeamMember(email)
      setUsers(await api.getShopUsers())
      toast(`تم إرسال الدعوة إلى ${email.trim()}`, 'ok')
      setEmail('')
    } catch (err) {
      toast(err.message || 'تعذّر إرسال الدعوة', 'err')
    } finally {
      setInviting(false)
    }
  }

  const togglePerm = async (u, key) => {
    const next = { ...u.perms, [key]: !u.perms[key] }
    // Optimistic flip — reverted from the server list if the RPC refuses.
    setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, perms: next } : x)))
    try {
      await api.updateUserPerms(u.id, next)
    } catch (err) {
      toast(err.message || 'تعذّر تعديل الصلاحية', 'err')
      setUsers(await api.getShopUsers())
    }
  }

  if (users === null) return <div className="card card-pad muted">جارٍ التحميل…</div>

  return (
    <div className="acct-stack">
      {/* دعوة موظف */}
      <section className="card card-pad">
        <h3 className="acct-sec-title">دعوة موظف جديد</h3>
        <form className="invite-row" onSubmit={invite}>
          <input
            className="input ltr"
            type="email"
            inputMode="email"
            placeholder="employee@shop.dz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="team-invite-email"
          />
          <button className="btn btn-navy" type="submit" disabled={!email.trim() || inviting} data-testid="team-invite-send">
            {inviting ? <Spinner /> : '+ إرسال الدعوة'}
          </button>
        </form>
        <p className="hint">
          يدخل الموظف ببريده الخاص، ويرى فقط ما تمنحه من صلاحيات — وكل إجراء يقوم به يُنسَب إليه في سجل النشاط.
        </p>
      </section>

      {/* قائمة الفريق */}
      <section className="card card-pad" data-testid="team-list">
        <h3 className="acct-sec-title">
          مقاعد الفريق <span className="pill pill-grey">{users.length}</span>
        </h3>
        <div className="stack" style={{ marginTop: 12 }}>
          {users.map((u) => {
            const owner = u.role === 'owner'
            const open = expanded === u.id
            const granted = PERMS.filter((p) => u.perms?.[p.key]).length
            return (
              <div className="team-seat" key={u.id} data-testid={`team-row-${u.id}`}>
                <button
                  type="button"
                  className="seat-head"
                  onClick={() => !owner && setExpanded(open ? null : u.id)}
                  aria-expanded={owner ? undefined : open}
                  disabled={owner}
                  data-testid={`team-expand-${u.id}`}
                >
                  <span className={`avatar ${owner ? '' : 'staff'}`} aria-hidden>
                    {(u.name || '?').trim().charAt(0)}
                  </span>
                  <span className="seat-id">
                    <b>{u.name}</b>
                    {u.email && (
                      <small>
                        <Ltr>{u.email}</Ltr>
                      </small>
                    )}
                  </span>
                  {u.status === 'invited' && <span className="pill pill-amber">بانتظار القبول</span>}
                  {owner ? (
                    <span className="pill pill-navy">المالك — كل الصلاحيات</span>
                  ) : (
                    <>
                      <span className="pill pill-grey">
                        {granted}/{PERMS.length} صلاحيات
                      </span>
                      <span className={`seat-chev ${open ? 'open' : ''}`} aria-hidden>
                        ▾
                      </span>
                    </>
                  )}
                </button>

                {open && !owner && (
                  <div className="seat-perms">
                    {PERMS.map((p) => (
                      <button
                        type="button"
                        key={p.key}
                        className={`perm-switch ${u.perms?.[p.key] ? 'on' : ''}`}
                        role="switch"
                        aria-checked={Boolean(u.perms?.[p.key])}
                        onClick={() => togglePerm(u, p.key)}
                        data-testid={`perm-${p.key}-${u.id}`}
                      >
                        <span>
                          <b>{p.label}</b>
                          <small>{p.desc}</small>
                        </span>
                        <span className="perm-track" aria-hidden>
                          <span className="perm-knob" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
