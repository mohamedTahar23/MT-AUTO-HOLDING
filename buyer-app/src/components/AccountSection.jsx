import { IOrders } from '../icons.jsx'

export default function AccountSection({ app }) {
  const { s } = app
  return (
    <section id="account" data-screen-label="حسابي" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        {!s.loggedIn ? <LoginCard app={app} /> : <Wizard app={app} />}
      </div>
    </section>
  )
}

function LoginCard({ app }) {
  const { s, vm, onLoginPhone, sendLoginCode, onLoginInput, loginVerify, backLoginPhone } = app
  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 0 8px', borderTop: '1px solid var(--line-2)' }}>
      <div className="form-card">
        {s.loginStage === 'phone' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 20 }}>
              <b style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)' }}>تسجيل الدخول</b>
              <span style={{ marginTop: 5, fontSize: 13.5, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 300 }}>ادخل لمتابعة طلباتك وعروض الأسعار في مكانٍ واحد.</span>
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label htmlFor="lg_phone">رقم الهاتف</label>
              <input id="lg_phone" className="inp num" dir="ltr" inputMode="tel" maxLength={10} placeholder="06xxxxxxxx" value={s.loginPhone} onChange={onLoginPhone} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 13px', borderRadius: 12, background: 'var(--green-soft)', border: '1px solid var(--green-line)', color: 'var(--green-text)', fontSize: 12.5, fontWeight: 700, lineHeight: 1.55 }}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" style={{ flex: 'none' }}><path d="M4 20l1.4-4.2A8 8 0 1 1 12 20a8 8 0 0 1-3.8-1L4 20z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
              سنرسل رمز الدخول عبر واتساب إلى هذا الرقم.
            </div>
            <div className="form-actions" style={{ marginTop: 16 }}>
              <button className="btn btn-primary btn-block" type="button" disabled={vm.loginSendDisabled} onClick={sendLoginCode}>أرسِل رمز الدخول</button>
            </div>
            <a href="#faq" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, fontSize: 13, fontWeight: 800, color: 'var(--navy-700)', textDecoration: 'none' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" style={{ flex: 'none' }}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><path d="M9.6 9.4a2.4 2.4 0 0 1 3.9 1.7c0 1.6-2.4 1.7-2.4 2.9M12 17h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg> لديك سؤال؟ الأسئلة الشائعة
            </a>
          </>
        )}

        {s.loginStage === 'otp' && (
          <div className="otp-block on" style={{ borderTop: 'none', paddingTop: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(150deg,#1FA855,#0E6B45)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 10px 24px rgba(14,107,69,.32)', marginBottom: 14 }}>
                <svg viewBox="0 0 24 24" width="30" height="30" fill="none"><path d="M4 20l1.4-4.2A8 8 0 1 1 12 20a8 8 0 0 1-3.8-1L4 20z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" /></svg>
              </span>
              <b style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)' }}>تأكيد الرمز</b>
              <span style={{ marginTop: 6, fontSize: 13.5, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 320 }}>أرسلنا رمزاً من 6 أرقام عبر واتساب إلى</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 10, background: 'var(--navy-tint)', border: '1px solid var(--navy-line)', borderRadius: 999, padding: '5px 6px 5px 14px' }}>
                <bdi className="num" dir="ltr" style={{ fontSize: 14, fontWeight: 800, color: 'var(--navy-800)', letterSpacing: '.5px' }}>{s.loginPhone}</bdi>
                <button type="button" onClick={backLoginPhone} style={{ border: 'none', background: 'var(--card)', color: 'var(--navy-700)', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 800, borderRadius: 999, padding: '4px 12px', cursor: 'pointer' }}>تغيير</button>
              </span>
            </div>
            <div className="field" style={{ marginTop: 18 }}>
              <input className="inp num" dir="ltr" inputMode="numeric" maxLength={6} autoComplete="one-time-code" placeholder="••••••" style={{ textAlign: 'center', letterSpacing: 14, textIndent: 14, fontSize: 26, fontWeight: 800, height: 60 }} value={s.loginInput} onChange={onLoginInput} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 12, padding: '9px 12px', border: '1px dashed var(--amber-line)', background: 'var(--amber-soft)', borderRadius: 12, fontSize: 12, fontWeight: 700, color: 'var(--amber-text)' }}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" style={{ flex: 'none' }}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>
              للتجربة فقط — رمزك هو <b dir="ltr" style={{ letterSpacing: 1 }}>{s.loginCode}</b>
            </div>
            <button className="btn btn-primary btn-block" type="button" disabled={vm.loginVerifyDisabled} onClick={loginVerify} style={{ marginTop: 16 }}>دخول إلى حسابي</button>
            <div style={{ textAlign: 'center', marginTop: 13, fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>
              لم يصلك الرمز؟ <button type="button" onClick={backLoginPhone} style={{ border: 'none', background: 'none', color: 'var(--navy-700)', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 800, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>أعد المحاولة</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const SEC_HDR = { display: 'flex', alignItems: 'center', gap: 8, margin: '20px 0 12px' }
const SEC_TITLE = { fontSize: 14.5, fontWeight: 800, color: 'var(--ink)' }

function Wizard({ app }) {
  const { s, vm, go, goOrder, startSubmit, goToOrders } = app
  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 0 12px', borderTop: '1px solid var(--line-2)' }}>
      <div className="vn-card" style={{ marginBottom: 22 }}>
        <span className="vn-eyebrow"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>قبل أن تبدأ طلبك</span>
        <h2>طلبك يمرّ بعملية بحث حقيقية قبل أن نرسل لك العروض.</h2>
        <div className="vn-exclude"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" style={{ verticalAlign: -4, marginInlineEnd: 7 }}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 3.6 10.8c-.6.5-1 1.1-1.1 1.9H9.5c-.1-.8-.5-1.4-1.1-1.9A6 6 0 0 1 12 3z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>من فضلك، إذا كانت القطعة التي تحتاجها متوفّرة في المحلّات القريبة منك ويسهل الحصول عليها، <span className="vn-x-key">فهذه الخدمة ليست لك.</span></div>
      </div>

      <div className="oflow-inline" style={{ borderTop: '1px solid var(--line-2)', marginTop: 6, paddingTop: 26 }}>
        <div className="oflow-steps">
          <span className={vm.carStepCls}><span className="n">1</span> السيارة</span>
          <span className="oflow-line"></span>
          <span className={vm.partStepCls}><span className="n">2</span> القطعة</span>
          <span className="oflow-line"></span>
          <span className={vm.detStepCls}><span className="n">3</span> الإرسال</span>
        </div>

        {vm.isVehicleStep && <VehicleStep app={app} />}
        {vm.isPartStep && <PartStep app={app} />}
        {vm.isDetailsStep && <DetailsStep app={app} />}
        {vm.isSent && (
          <div className="form-card" style={{ textAlign: 'center' }}>
            <span style={{ width: 74, height: 74, borderRadius: '50%', background: 'var(--green-soft)', color: 'var(--green)', display: 'grid', placeItems: 'center', margin: '2px auto 16px', border: '1px solid var(--green-line)' }}><svg viewBox="0 0 24 24" width="38" height="38" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            <h2 className="oflow-title" style={{ textAlign: 'center' }}>تم استلام طلبك</h2>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '0 0 4px' }}>رقم الطلب <bdi className="num" dir="ltr" style={{ color: 'var(--navy-700)', fontWeight: 800 }}>{s.orderNum}</bdi></p>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.85, margin: '0 auto', maxWidth: 380 }}>يمكنك متابعة حالة طلبك من صفحة «طلباتي»، وسنراسلك على واتساب فور وصول العروض.</p>
            <div className="form-actions" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
              <button className="btn btn-primary btn-block" type="button" onClick={goToOrders}><IOrders style={{ width: 19, height: 19, verticalAlign: -3 }} /> تابع الطلب في «طلباتي»</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AddDetailsHeading() {
  return (
    <div style={SEC_HDR}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" style={{ color: 'var(--navy-700)' }}><path d="M4 8h8M18 8h2M4 16h2M12 16h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><circle cx="15" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.7" /><circle cx="9" cy="16" r="2.2" stroke="currentColor" strokeWidth="1.7" /></svg>
      <b style={SEC_TITLE}>تفاصيل إضافية <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>— اختيارية</span></b>
    </div>
  )
}

function VehicleStep({ app }) {
  const { s, vm, set, setVin, setYear, toggleVinConfirm, scanCG, go } = app
  return (
    <>
      <h2 className="oflow-title">ما هي سيارتك؟</h2>
      <p className="oflow-sub">ارفع صورة البطاقة الرمادية ونقرأها تلقائياً لملء البيانات — راجعها قبل المتابعة، أو أدخلها يدوياً.</p>

      {vm.hasSavedVehicles && (
        <>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--muted)', marginBottom: 9 }}>اختر سيارتك</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {vm.savedVehicles.map((v, i) => (
              <button key={i} type="button" onClick={v.pick} style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', borderRadius: 14, padding: '13px 15px', fontFamily: 'inherit', cursor: 'pointer', textAlign: 'start', transition: 'border-color .12s,background .12s', ...(v.on ? { border: '1.5px solid var(--navy-700)', background: 'var(--navy-tint)' } : { border: '1px solid var(--line)', background: 'var(--card)' }) }}>
                <span style={{ width: 40, height: 40, borderRadius: 11, background: '#fff', color: 'var(--navy-700)', display: 'grid', placeItems: 'center', flex: 'none', boxShadow: 'var(--sh-sm)' }}><svg viewBox="0 0 24 24" width="21" height="21" fill="none"><path d="M3 13l2-5a3 3 0 0 1 2.8-2h8.4A3 3 0 0 1 19 8l2 5M5 13h14v4H5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><circle cx="8" cy="17" r="1.3" fill="currentColor" /><circle cx="16" cy="17" r="1.3" fill="currentColor" /></svg></span>
                <span style={{ flex: 1, minWidth: 0, textAlign: 'start' }}><b style={{ display: 'block', fontSize: 14.5, fontWeight: 800, color: 'var(--ink)' }}>{v.title}</b><span style={{ fontSize: 12, color: 'var(--muted)' }}>{v.sub}</span></span>
                <span style={{ width: 22, height: 22, borderRadius: '50%', flex: 'none', display: 'grid', placeItems: 'center', ...(v.on ? { background: 'var(--navy-700)', color: '#fff' } : { border: '2px solid var(--line)', color: 'transparent' }) }}><svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--faint)', fontSize: 12, fontWeight: 800, margin: '16px 0' }}><span style={{ flex: 1, height: 1, background: 'var(--line)' }}></span>أو أدخل سيارة أخرى<span style={{ flex: 1, height: 1, background: 'var(--line)' }}></span></div>
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--green-soft)', border: '1px solid var(--green-line)', color: 'var(--green-text)', borderRadius: 12, padding: '12px 14px', fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" style={{ flex: 'none', marginTop: 1 }}><path d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span>نطلب رقم الهيكل (VIN) أو البطاقة الرمادية لنجد لك القطعة الصحيحة تماماً — دون أخطاء.</span>
      </div>

      <div className="form-card">
        <button type="button" onClick={scanCG} disabled={s.scanning} style={{ width: '100%', border: '1.5px dashed var(--navy-line)', background: 'var(--navy-tint)', borderRadius: 14, padding: '22px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', textAlign: 'center', marginBottom: 14 }}>
          <span style={{ width: 52, height: 52, borderRadius: 14, background: '#fff', color: 'var(--navy-700)', display: 'grid', placeItems: 'center', boxShadow: 'var(--sh-sm)', marginBottom: 2 }}><svg viewBox="0 0 24 24" width="26" height="26" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" /><circle cx="8" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.5" /><path d="M13 9h5M13 12h5M6 15h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></span>
          {vm.showIdle && <><span style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>ارفع صورة البطاقة الرمادية</span><span style={{ fontSize: 12.5, color: 'var(--muted)' }}>التقط صورة أو اخترها من المعرض · تُرفق مع طلبك</span></>}
          {vm.showScan && <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--navy-700)' }}>جارٍ قراءة البطاقة…</span>}
          {vm.showFilled && <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--green-text)' }}>تم استخراج البيانات ✓ — راجعها بالأسفل</span>}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--faint)', fontSize: 12, fontWeight: 800, margin: '2px 0 14px' }}><span style={{ flex: 1, height: 1, background: 'var(--line)' }}></span>أو أدخل البيانات يدوياً<span style={{ flex: 1, height: 1, background: 'var(--line)' }}></span></div>
        <div className="field"><label>رقم الهيكل (VIN) — أو ارفع البطاقة الرمادية أعلاه</label><input className="inp num" dir="ltr" value={s.vin} onChange={setVin} placeholder="مثل 17 خانة — KNAB1511AJT123456" /></div>
        {vm.vinHasValue && <label className="agree-row" style={{ marginTop: -6 }}><input type="checkbox" checked={s.vinConfirm} onChange={toggleVinConfirm} /><span>أؤكّد أن رقم الهيكل صحيح ومطابق لسيارتي.</span></label>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field"><label>الصنع</label><input className="inp" value={s.make} onChange={set('make')} placeholder="كيا، هيونداي…" /></div>
          <div className="field"><label>الطراز</label><input className="inp" value={s.model} onChange={set('model')} placeholder="Picanto…" /></div>
          <div className="field"><label>سنة الصنع</label><input className="inp num" dir="ltr" inputMode="numeric" value={s.year} onChange={setYear} placeholder="2018" /></div>
          <div className="field"><label>الوقود</label><select className="sel" value={s.fuel} onChange={set('fuel')}><option value="">اختر…</option><option value="بنزين">بنزين</option><option value="مازوت">مازوت</option><option value="غاز">غاز (GPL)</option></select></div>
        </div>
      </div>

      <AddDetailsHeading />
      <div className="form-card">
        <div className="field"><label>رمز المحرك</label><input className="inp" dir="ltr" value={s.engine} onChange={set('engine')} placeholder="إن كنت تعرفه" /></div>
        <div className="field" style={{ marginBottom: 0 }}><label>ملاحظة عن سيارتك</label><textarea className="inp" rows={2} value={s.carNote} onChange={set('carNote')} placeholder="أي تفاصيل تساعد على المطابقة — مثل نوع علبة السرعات أو تجهيزات خاصة." style={{ minHeight: 78, height: 'auto', resize: 'vertical', paddingTop: 10, lineHeight: 1.7 }} /></div>
      </div>
      <div className="form-actions"><button className="btn btn-primary btn-block" type="button" onClick={() => go('part')} disabled={vm.vehDisabled}>تابع — تفاصيل القطعة</button></div>
    </>
  )
}

function PartStep({ app }) {
  const { s, vm, set, setQty, addPhoto, rmPhoto, addPart, rmPart, go } = app
  return (
    <>
      <h2 className="oflow-title">ما القطعة التي تحتاجها؟</h2>
      <p className="oflow-sub">صِف القطعة وأرفق صوراً إن أمكن — كلما زادت التفاصيل، دقّت المطابقة.</p>
      <div className="form-card">
        <div className="field"><label>اسم القطعة</label><input className="inp" value={s.pName} onChange={set('pName')} placeholder="Disque de frein · أو بالعربية/الدارجة" /><div className="hint">لا تقلق إن لم تعرف الاسم الدقيق — الصورة والوصف يكفيان.</div></div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, margin: '-4px 0 14px', fontSize: 12, fontWeight: 700, color: 'var(--amber-text)', background: 'var(--amber-soft)', border: '1px solid var(--amber-line)', borderRadius: 10, padding: '9px 12px' }}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" style={{ flex: 'none', marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg><span>لا نوفّر حالياً كمبيوتر السيارة (ECU) ووحدات الذاكرة.</span></div>
        <div className="field" style={{ marginBottom: 0 }}><label>صور القطعة القديمة — الأفضل للمطابقة</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {Array.from({ length: s.pPhotos }).map((_, i) => (
              <div key={i} style={{ position: 'relative', width: 72, height: 72, borderRadius: 10, background: 'var(--navy-tint)', border: '1px solid var(--navy-line)', display: 'grid', placeItems: 'center', color: 'var(--navy-700)' }}><svg viewBox="0 0 24 24" width="24" height="24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" /><circle cx="8.5" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.5" /><path d="M5 18l5-5 4 3 3-2 2 2" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg><button type="button" onClick={rmPhoto} aria-label="حذف" style={{ position: 'absolute', top: -7, insetInlineStart: -7, width: 20, height: 20, borderRadius: '50%', border: 'none', background: 'var(--ink)', color: '#fff', cursor: 'pointer', fontSize: 13, lineHeight: 1 }}>×</button></div>
            ))}
            {vm.canAddPhoto && <button type="button" onClick={addPhoto} aria-label="أضف صورة" style={{ width: 72, height: 72, borderRadius: 10, border: '1.5px dashed var(--navy-line)', background: 'var(--card)', color: 'var(--navy-700)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--amber-soft)', border: '1px solid var(--amber-line)', color: 'var(--amber-text)', borderRadius: 12, padding: '12px 14px', fontSize: 12.5, fontWeight: 700, marginTop: 12 }}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" style={{ flex: 'none', marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" /></svg><span>صوّر القطعة واضحة، مع أي أرقام مكتوبة عليها — تساعدنا على المطابقة الدقيقة. حتى 4 صور.</span></div>
        </div>
      </div>

      <AddDetailsHeading />
      <div className="form-card">
        <div className="field"><label>رقم القطعة — إن كان مكتوباً على القطعة القديمة</label><input className="inp num" dir="ltr" value={s.pRef} onChange={set('pRef')} placeholder="مثال: 51712-1Y000" /><div className="hint">إن وجدت رقماً على القطعة أو غلافها، انسخه — يجعل المطابقة مؤكّدة.</div></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field"><label>العلامة المفضّلة</label><input className="inp" value={s.pBrand} onChange={set('pBrand')} placeholder="Valeo، Bosch…" /></div>
          <div className="field"><label>علامة بديلة مقبولة</label><input className="inp" value={s.pBrandAlt} onChange={set('pBrandAlt')} placeholder="نقبل البديل" /></div>
        </div>
        <div className="field" style={{ maxWidth: 150 }}><label>الكمية</label><input className="inp num" dir="ltr" inputMode="numeric" value={s.pQty} onChange={setQty} placeholder="1" /></div>
        <div className="field" style={{ marginBottom: 0 }}><label>ملاحظة</label><textarea className="inp ta" value={s.pNote} onChange={set('pNote')} placeholder="مثال: القطعة لي عندي راهي 3 سورتي مش 2 سورتي · لي عندي راهي دوزيام كوبي · الكرتونة" /></div>
      </div>

      <button type="button" className="btn btn-out btn-block" onClick={addPart} disabled={vm.addPartDisabled} style={{ borderStyle: 'dashed', margin: '14px 0' }}>+ أضف قطعة أخرى لنفس السيارة</button>
      {s.parts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {s.parts.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--navy-tint)', border: '1px solid var(--navy-line)', borderRadius: 10, padding: '10px 13px' }}><span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>{p.name}</span><button type="button" onClick={() => rmPart(i)} style={{ background: 'none', border: 'none', color: 'var(--amber-text)', fontWeight: 800, fontSize: 12.5, cursor: 'pointer' }}>حذف</button></div>
          ))}
        </div>
      )}
      <div className="form-actions" style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-out" type="button" onClick={() => go('vehicle')} style={{ flex: '0 0 auto' }}>رجوع</button>
        <button className="btn btn-primary" type="button" onClick={() => go('details')} disabled={vm.partNextDisabled} style={{ flex: 1 }}>تابع — الإرسال والتأكيد</button>
      </div>
    </>
  )
}

function DetailsStep({ app }) {
  const { s, vm, set, geoDetect, go, startSubmit, WILAYAS } = app
  const summaryRow = (label, value, muted, onEdit) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: '1px solid var(--line-2)' }}>
      <span style={{ flex: 'none', width: 34, height: 34, borderRadius: 10, background: 'var(--navy-tint)', color: 'var(--navy-700)', display: 'grid', placeItems: 'center' }}>{label.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}><span style={{ display: 'block', fontSize: 11.5, color: 'var(--muted)', fontWeight: 700 }}>{label.k}</span><span style={{ display: 'block', fontSize: 13.5, color: muted ? 'var(--muted)' : 'var(--ink)', fontWeight: muted ? 700 : 800, marginTop: 2 }}>{value}</span></div>
      <button type="button" onClick={onEdit} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', flex: 'none', fontFamily: 'inherit' }}>تعديل</button>
    </div>
  )
  return (
    <>
      <h2 className="oflow-title">أرسل طلبك</h2>
      <p className="oflow-sub">هذه مراجعة أخيرة — أكمل بيانات التوصيل ثم أرسِل طلبك.</p>

      <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-sm)', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 16px', background: 'var(--navy-tint)', borderBottom: '1px solid var(--navy-line)' }}><svg viewBox="0 0 24 24" width="17" height="17" fill="none" style={{ color: 'var(--navy-700)' }}><rect x="5" y="5" width="14" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M9 5V4h6v1M8.5 10h7M8.5 14h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg><b style={{ fontSize: 13, fontWeight: 800, color: 'var(--navy-800)' }}>ملخّص طلبك</b></div>
        {summaryRow({ k: 'السيارة', icon: <svg viewBox="0 0 24 24" width="19" height="19" fill="none"><path d="M5 11l1.5-4A2 2 0 0 1 8.4 5.6h7.2A2 2 0 0 1 17.5 7L19 11M5 11h14v5H5zM7.5 16v1.6M16.5 16v1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg> }, vm.sumV, false, () => go('vehicle'))}
        {summaryRow({ k: 'القطعة', icon: <svg viewBox="0 0 24 24" width="19" height="19" fill="none"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5M12 12v9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg> }, vm.sumP, false, () => go('part'))}
        {summaryRow({ k: 'الصور', icon: <svg viewBox="0 0 24 24" width="19" height="19" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" /><circle cx="8.5" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.5" /><path d="M5 18l5-5 4 3 3-2 2 2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg> }, vm.sumPhotos, true, () => go('part'))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 12px' }}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" style={{ color: 'var(--navy-700)' }}><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="7" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.6" /><circle cx="17" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.6" /></svg><b style={SEC_TITLE}>بيانات التوصيل</b></div>
      <div className="form-card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field"><label>الاسم *</label><input className="inp" value={s.cFirst} onChange={set('cFirst')} placeholder="الاسم" /></div>
          <div className="field"><label>اللقب *</label><input className="inp" value={s.cLast} onChange={set('cLast')} placeholder="اللقب" /></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, margin: '2px 0 12px' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>عنوان التوصيل</span>
          <button type="button" onClick={geoDetect} disabled={s.geoState === 'locating'} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--navy-tint)', border: '1px solid var(--navy-line)', color: 'var(--navy-700)', borderRadius: 'var(--pill)', padding: '7px 13px', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 800, cursor: 'pointer' }}><svg viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.8" /></svg> {vm.geoLabel}</button>
        </div>
        <div className="field"><label>الولاية *</label><select className="sel" value={s.cWilaya} onChange={set('cWilaya')}><option value="">اختر ولايتك…</option>{WILAYAS.map((w) => <option key={w.n} value={w.n}>{w.n}</option>)}</select></div>
        <div className="field" style={{ marginBottom: 0 }}><label>البلدية</label><input className="inp" value={s.cCommune} onChange={set('cCommune')} placeholder="البلدية" /></div>
      </div>

      <div className="form-actions" style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-out" type="button" onClick={() => go('part')} style={{ flex: '0 0 auto' }}>رجوع</button>
        <button className="btn btn-primary" type="button" onClick={startSubmit} disabled={vm.reviewDisabled} style={{ flex: 1 }}>مراجعة الطلب وإرساله</button>
      </div>
    </>
  )
}
