import { WHATSAPP } from '../data.js'
import { IClose, IPlus, IEdit, ICar } from '../icons.jsx'

export function ContactModal({ app }) {
  const { s, closeContact } = app
  return (
    <div className={'modal' + (s.contactOpen ? ' open' : '')} role="dialog" aria-modal="true" aria-label="تواصل معنا">
      <div className="scrim" onClick={closeContact}></div>
      <div className="mbox">
        <div className="mhead">
          <div>
            <h3>تواصل معنا</h3>
            <span style={{ display: 'block', marginTop: 3, fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>نحن هنا لمساعدتك في إيجاد قطعتك</span>
          </div>
          <button className="x" type="button" onClick={closeContact} aria-label="إغلاق"><IClose /></button>
        </div>
        <div className="mbody">
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 15px', background: 'linear-gradient(155deg,var(--navy-tint),var(--card) 88%)', border: '1px solid var(--navy-line)', borderRadius: 'var(--r-lg)', marginBottom: 13 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b style={{ display: 'block', fontSize: 14.5, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.35 }}>محل محمد الطاهر لقطع الغيار</b>
              <span style={{ display: 'block', fontSize: 12.5, color: 'var(--muted)', fontWeight: 600, marginTop: 2 }}>الحجار، ولاية عنابة</span>
            </div>
            <span style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, padding: '5px 10px', borderRadius: 999, background: 'var(--green-soft)', color: 'var(--green-text)', border: '1px solid var(--green-line)', whiteSpace: 'nowrap' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)' }}></span>مفتوح · 24/7</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginBottom: 13 }}>
            <a href="tel:0659401338" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14, borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', background: 'var(--card)', textDecoration: 'none' }}>
              <span style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--navy-tint)', color: 'var(--navy-700)', display: 'grid', placeItems: 'center' }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V18a2 2 0 0 1-2 2A14 14 0 0 1 5 6a2 2 0 0 1 0-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg></span>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)' }}>اتصل بنا</span>
              <bdi className="num" dir="ltr" style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ink)', letterSpacing: '.5px' }}>0659 40 13 38</bdi>
            </a>
          </div>
        </div>
        <div className="mfoot">
          <a className="btn btn-wa btn-block" href={WHATSAPP} target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none"><path d="M4 20l1.4-4.2A8 8 0 1 1 12 20a8 8 0 0 1-3.8-1L4 20z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" /></svg> راسلنا على واتساب</a>
        </div>
      </div>
    </div>
  )
}

export function TermsModal({ app }) {
  const { s, closeTerms, agreeFromTerms } = app
  return (
    <div className={'modal' + (s.termsOpen ? ' open' : '')} role="dialog" aria-modal="true" aria-label="الشروط والأحكام">
      <div className="scrim" onClick={closeTerms}></div>
      <div className="mbox" style={{ borderRadius: 24, overflow: 'hidden' }}>
        <div className="mhead">
          <h3>الشروط والأحكام</h3>
          <button className="x" type="button" onClick={closeTerms} aria-label="إغلاق"><IClose /></button>
        </div>
        <div className="mbody">
          <div className="ph-terms" style={{ marginTop: 0, border: 'none', padding: 0 }}>
            <h4>1. توضيح</h4>
            <p>هذه خدمة من «محل محمد الطاهر لبيع قطع غيار السيارات»، موجَّهة للمشغولين، وللبعيدين عن الأسواق، ولمن بحث عن قطعة ولم يجدها. نبحث لك عن القطعة ونقدّم لك العروض مع تفاصيل دقيقة لها. والخدمة مخصّصة للطلبات الجادّة فقط.</p>
            <h4>2. دقة البيانات ومسؤوليتك</h4>
            <p>نبحث عن القطعة المطابقة بناءً على ما تُدخله. أي خطأ في رقم الهيكل (<span dir="ltr">VIN</span>) أو في تفاصيل سيارتك يقع على عاتقك وحدك. تأكّد من بياناتك قبل التأكيد — فدقّتها وحدها تضمن وصول القطعة الصحيحة.</p>
            <h4>3. جدّية الطلب والتزامك</h4>
            <p>تقديم الطلب مجاني وغير مُلزِم. لكن بعد اطّلاعك على العرض وطلب فيديو للقطعة وتأكيدك للطلب، نجهّز القطعة خصيصًا لك ونتحمّل مسؤوليتها — لذلك رفضُ استلام قطعة مطابقة دون سبب وجيه يُلحق خسارةً بنا. الدفع نقدًا عند الاستلام بعد فحص القطعة.</p>
          </div>
        </div>
        <div className="mfoot">
          <button className="btn btn-primary btn-block" type="button" onClick={agreeFromTerms} style={{ borderRadius: 999 }}>قرأتُ وأوافق على الشروط</button>
        </div>
      </div>
    </div>
  )
}

export function AccountModal({ app }) {
  const { s, vm, closeAcct, addVehicle, editProfile, logout } = app
  return (
    <div className={'modal' + (s.acctOpen ? ' open' : '')} role="dialog" aria-modal="true" aria-label="حسابي">
      <div className="scrim" onClick={closeAcct}></div>
      <div className="mbox">
        <div className="mhead">
          <h3>حسابي</h3>
          <button className="x" type="button" onClick={closeAcct} aria-label="إغلاق"><IClose /></button>
        </div>
        <div className="mbody" style={{ background: 'var(--bg)' }}>
          <div style={{ background: 'linear-gradient(150deg,var(--navy-850),var(--navy-700))', borderRadius: 'var(--r-xl)', padding: 20, margin: '6px 0 22px', color: '#fff', boxShadow: 'var(--sh-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(150deg,var(--amber),#FFB35C)', color: 'var(--navy-900)', display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 800, flex: 'none', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.25)' }}>{vm.acctInitial}</span>
              <div style={{ flex: 1, minWidth: 0 }}><b style={{ fontSize: 17, fontWeight: 800, display: 'block' }}>{vm.acctName}</b><span className="num" dir="ltr" style={{ fontSize: 12.5, color: '#B9C6DA' }}>{vm.acctPhone}</span></div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 800, background: 'rgba(63,207,142,.18)', color: '#7EE0B0', border: '1px solid rgba(63,207,142,.35)', borderRadius: 'var(--pill)', padding: '4px 9px', flex: 'none' }}><svg viewBox="0 0 24 24" width="13" height="13" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg> مؤكّد</span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,.08)', borderRadius: 12, padding: '11px 13px' }}><div className="num" dir="ltr" style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{vm.ordersCount}</div><div style={{ fontSize: 11.5, color: '#B9C6DA', fontWeight: 600, marginTop: 3 }}>إجمالي الطلبات</div></div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,.08)', borderRadius: 12, padding: '11px 13px' }}><div className="num" dir="ltr" style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{vm.vehiclesCount}</div><div style={{ fontSize: 11.5, color: '#B9C6DA', fontWeight: 600, marginTop: 3 }}>مركباتي</div></div>
            </div>
          </div>

          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>مركباتي</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
            {vm.vehicles.map((v, i) => (
              <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '14px 16px', boxShadow: 'var(--sh-sm)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--navy-tint)', color: 'var(--navy-700)', display: 'grid', placeItems: 'center', flex: 'none' }}><ICar style={{ width: 20, height: 20 }} /></span>
                <div style={{ flex: 1 }}><b style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{v.title}</b><div className="num" style={{ fontSize: 12, color: 'var(--muted)' }} dir="ltr">{v.sub}</div></div>
              </div>
            ))}
          </div>
          <button className="btn btn-out btn-block" type="button" onClick={addVehicle} style={{ borderStyle: 'dashed', marginBottom: 24 }}><IPlus style={{ width: 17, height: 17, verticalAlign: -3 }} /> إضافة مركبة</button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>بياناتي</h3>
            <button type="button" onClick={editProfile} style={{ background: 'none', border: 'none', color: 'var(--amber-text)', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}><IEdit style={{ width: 14, height: 14 }} /> تعديل</button>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-sm)', overflow: 'hidden' }}>
            {vm.profileRows.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 17px', borderBottom: '1px solid var(--line-2)' }}><span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 700 }}>{r.k}</span><span style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 700 }}>{r.v}</span></div>
            ))}
          </div>
        </div>
        <div className="mfoot">
          <button className="btn btn-out btn-block" type="button" onClick={logout}>تسجيل الخروج</button>
        </div>
      </div>
    </div>
  )
}

export function EditProfileModal({ app }) {
  const { s, closeEdit, saveProfile, set, WILAYAS } = app
  return (
    <div className={'modal' + (s.editOpen ? ' open' : '')} role="dialog" aria-modal="true" aria-label="تعديل بياناتي">
      <div className="scrim" onClick={closeEdit}></div>
      <div className="mbox">
        <div className="mhead">
          <h3>تعديل بياناتي</h3>
          <button className="x" type="button" onClick={closeEdit} aria-label="إغلاق"><IClose /></button>
        </div>
        <div className="mbody" style={{ background: 'var(--bg)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field"><label>الاسم</label><input className="inp" value={s.cFirst} onChange={set('cFirst')} placeholder="الاسم" /></div>
            <div className="field"><label>اللقب</label><input className="inp" value={s.cLast} onChange={set('cLast')} placeholder="اللقب" /></div>
          </div>
          <div className="field"><label>الهاتف</label><input className="inp num" dir="ltr" value={s.cPhone || s.loginPhone} disabled /><div className="hint">رقمك مؤكّد ولا يمكن تغييره من هنا.</div></div>
          <div className="field"><label>الولاية</label><select className="sel" value={s.cWilaya} onChange={set('cWilaya')}><option value="">اختر ولايتك…</option>{WILAYAS.map((w) => <option key={w.n} value={w.n}>{w.n}</option>)}</select></div>
          <div className="field" style={{ marginBottom: 0 }}><label>البلدية</label><input className="inp" value={s.cCommune} onChange={set('cCommune')} placeholder="البلدية" /></div>
        </div>
        <div className="mfoot" style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-out" type="button" onClick={closeEdit} style={{ flex: '0 0 auto' }}>إلغاء</button>
          <button className="btn btn-primary" type="button" onClick={saveProfile} style={{ flex: 1 }}>حفظ التغييرات</button>
        </div>
      </div>
    </div>
  )
}
