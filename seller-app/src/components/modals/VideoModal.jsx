import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import { Spinner, Ltr } from '../ui/bits.jsx'
import { useApp } from '../../state/store.jsx'
import { api } from '../../api/index.js'

// Proof-video task: one continuous take (part → packaging), consent required,
// then upload_proof. Enforced deadline is the order's 24h window (shown elsewhere).
export default function VideoModal({ order, onClose, onDone }) {
  const { toast } = useApp()
  const [recorded, setRecorded] = useState(false)
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit() {
    setBusy(true)
    try {
      await api.uploadProof(order.id)
      toast('تم استلام الفيديو.', 'ok')
      onDone?.()
      onClose()
    } catch (e) {
      toast(e.message, 'err')
      setBusy(false)
    }
  }

  return (
    <Modal
      testid="video-modal"
      onClose={onClose}
      tag="مطلوب فيديو"
      title="توثيق الطلب بالفيديو"
      sub="الفيديو هو الدليل الوحيد المعتمد عند الفحص أو الخلاف — لا يُقبل الطلب دون فيديو واضح للقطعة والتغليف."
      footer={
        <button className="btn btn-primary btn-block" onClick={submit} disabled={busy || !(recorded && consent)} data-testid="video-submit">
          {busy ? <Spinner /> : 'تأكيد ورفع الفيديو'}
        </button>
      }
    >
      <div className="card card-pad" style={{ background: '#f7f8fa', marginBottom: 12 }}>
        <div style={{ fontWeight: 800 }}>{order.partName}</div>
        <div className="faint" style={{ fontSize: 13 }}>
          {order.car} · <Ltr mono>{order.id}</Ltr>
        </div>
      </div>

      <div style={{ fontWeight: 800, marginBottom: 6 }}>في فيديو واحد متواصل، أظهِر بالترتيب:</div>
      <ol style={{ margin: '0 18px 12px', color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.9 }}>
        <li>القطعة من كل الجهات وحالتها الفعلية.</li>
        <li>رقم القطعة أو الملصق (OEM) بوضوح إن وُجد.</li>
        <li>التغليف الأصلي للقطعة بشكل واضح.</li>
      </ol>

      <button
        className={`btn btn-block ${recorded ? 'btn-ghost' : 'btn-navy'}`}
        onClick={() => setRecorded(true)}
        style={{ marginBottom: 12 }}
      >
        {recorded ? '✓ تم تسجيل الفيديو' : '● سجّل / ارفع الفيديو'}
      </button>

      <label className="check">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} data-testid="video-consent" />
        أؤكّد أن الفيديو حقيقي ويُظهر القطعة والتغليف كما سيُشحنان، وأنه مرجع مُلزِم عند الفحص أو النزاع.
      </label>
      {!(recorded && consent) && (
        <div className="hint" style={{ marginTop: 8 }}>
          يلزم تسجيل الفيديو والموافقة على الإقرار أعلاه لتفعيل الزر.
        </div>
      )}
    </Modal>
  )
}
