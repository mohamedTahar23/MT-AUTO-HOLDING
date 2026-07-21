import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import { Ltr, Spinner } from '../ui/bits.jsx'
import { useApp } from '../../state/store.jsx'
import { api } from '../../api/index.js'
import { WITHDRAW_WINDOW_MS } from '../../lib/format.js'

// Withdraw confirmation. Free within 15 min of submitting; after, warns + counts,
// and the 3rd late withdrawal triggers R2 (blocks quoting).
export default function WithdrawModal({ offer, warns, onClose, onDone }) {
  const { toast, refreshShop } = useApp()
  const [busy, setBusy] = useState(false)

  const free = Date.now() - new Date(offer.submittedAt).getTime() < WITHDRAW_WINDOW_MS
  const willBeStrike = warns + 1 // strike number if this late-withdraw counts
  const isFinal = !free && willBeStrike >= 3

  async function confirm() {
    setBusy(true)
    try {
      const res = await api.withdrawOffer(offer.id)
      await refreshShop()
      if (res.late && res.r2Triggered) toast('أوقفنا التسعير مؤقتاً — تواصل مع الدعم.', 'err')
      else if (res.late) toast('تم سحب عرضك.', 'info')
      else toast('تم سحب عرضك — لم يُحتسب (نافذة التصحيح).', 'ok')
      onDone?.()
      onClose()
    } catch (e) {
      toast(e.message, 'err')
      setBusy(false)
    }
  }

  return (
    <Modal
      testid="withdraw-modal"
      onClose={onClose}
      maxWidth={460}
      title="سحب هذا العرض؟"
      sub="يمكنك سحب عرضك ما دام المشتري لم يختره بعد."
      footer={
        <>
          <button className="btn btn-ghost grow" onClick={onClose}>
            تراجع
          </button>
          <button
            className={`btn grow ${isFinal ? 'btn-danger' : 'btn-navy'}`}
            onClick={confirm}
            disabled={busy}
            data-testid="withdraw-confirm"
          >
            {busy ? <Spinner dark /> : isFinal ? 'سحب وإيقاف تقديم العروض' : 'تأكيد السحب'}
          </button>
        </>
      }
    >
      <div className="card card-pad" style={{ background: '#f7f8fa', marginBottom: 12 }}>
        <div style={{ fontWeight: 800 }}>{offer.partName}</div>
        <div className="faint" style={{ fontSize: 13 }}>
          {offer.brand} · <Ltr mono>{offer.price} دج</Ltr>
        </div>
      </div>

      {free ? (
        <div className="strip" style={{ background: 'var(--green-soft)', border: '1px solid var(--green-line)', color: 'var(--green-text)' }}>
          أنت ضمن نافذة التصحيح (15 دقيقة) — هذا السحب لن يُحتسب.
        </div>
      ) : isFinal ? (
        <div className="strip strip-red">
          هذه ثالث عملية سحب بعد مرور 15د على تقديم العرض — سيتم منعك من تقديم العروض فوراً حتى يراجع الدعم
          حسابك.
        </div>
      ) : (
        <div className="strip strip-amber">
          {willBeStrike === 1
            ? 'هذه أوّل عملية سحب بعد مرور 15د على تقديم العرض. لديك سحبتان قبل منعك من تقديم العروض.'
            : 'هذه ثاني عملية سحب بعد مرور 15د على تقديم العرض. السحب التالي يمنعك من تقديم العروض.'}
        </div>
      )}
    </Modal>
  )
}
