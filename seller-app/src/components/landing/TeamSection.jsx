import { Ltr } from '../ui/bits.jsx'
import { Ticks, scrollToSignin } from './bits.jsx'

const MEMBERS = [
  { email: 'yacine@atlas-pieces.dz', initial: 'Y', status: 'نشط', tone: 'green', perms: 'التسعير · التسليمات', active: true },
  { email: 'samir@atlas-pieces.dz', initial: 'S', status: 'دعوة معلّقة', tone: 'grey', perms: 'الرسائل · الشراء', active: false },
]

/** §5 — فريق المحل: invite employees to price/prepare/hand over on the owner's behalf. */
export default function TeamSection() {
  return (
    <section className="land-sec land-sec--white" id="team">
      <div className="wrap split">
        <div className="split-copy">
          <div className="sec-k start">فريق المحل</div>
          <h2>إذا لم يكن لديك وقت، أضِف موظفيك لتقديم العروض مكانك.</h2>
          <p className="muted">
            لا تدر كل طلب بنفسك. ادعُ موظفيك ليسعّروا ويجهّزوا ويسلّموا نيابة عنك، وكل ذلك تحت سيطرتك.
          </p>
          <Ticks
            items={[
              'كل موظف يدخل بدعوة منك.',
              'امنح أو اسحب أي صلاحية متى شئت من أي موظف.',
              'سجل نشاط يُظهر لك من فعل ماذا ومتى — كل إجراء منسوب لصاحبه.',
            ]}
          />
        </div>

        <div className="card team-card">
          <div className="team-head">
            <strong>فريق المحل</strong>
            <span className="pill pill-amber">٣ موظفين</span>
          </div>
          {MEMBERS.map((m) => (
            <div className="team-row" key={m.email}>
              <span className={`avatar ${m.active ? 'avatar-amber' : 'avatar-navy'}`}>{m.initial}</span>
              <span className="team-mid">
                <span className={`pill pill-${m.tone}`}>{m.status}</span>
                <span className="faint" style={{ fontSize: 12 }}>
                  {m.perms}
                </span>
              </span>
              <span className="team-mail">
                <Ltr mono>{m.email}</Ltr>
              </span>
            </div>
          ))}
          <button className="btn btn-ghost btn-block" style={{ marginTop: 14 }} onClick={scrollToSignin}>
            + دعوة موظف
          </button>
        </div>
      </div>
    </section>
  )
}
