import { useState, useRef, useMemo, useCallback } from 'react'
import {
  SAVED_VEHICLES, SAVED_PROFILE, ACCT_ORDERS, BSTAT, WILAYAS,
  MAINT_RE, WHATSAPP, phoneOk, onlyDigits, newCode, genOrder,
} from './data.js'
import Header from './components/Header.jsx'
import MobileMenu from './components/MobileMenu.jsx'
import Landing from './components/Landing.jsx'
import AccountSection from './components/AccountSection.jsx'
import Footer from './components/Footer.jsx'
import { ContactModal, TermsModal, AccountModal, EditProfileModal } from './components/Modals.jsx'
import OrdersHub from './components/OrdersHub.jsx'
import Assistant from './components/Assistant.jsx'

const OTP_LEN = 6

const INITIAL = {
  loggedIn: false,
  loginStage: 'phone', loginPhone: '', loginInput: '', loginCode: '',
  step: 'vehicle',
  // vehicle
  vin: '', make: '', model: '', year: '', fuel: '', engine: '', carNote: '',
  vinConfirm: false, autofilled: false, scanning: false, savedVeh: false,
  // parts
  parts: [], pName: '', pRef: '', pBrand: '', pBrandAlt: '', pQty: '1', pNote: '', pPhotos: 0,
  // contact
  cFirst: '', cLast: '', cPhone: '', cWilaya: '', cCommune: '',
  agree: false, geoState: '',
  // orders
  orders: [], orderNum: '',
  // UI
  menuOpen: false, contactOpen: false, acctOpen: false, editOpen: false,
  termsOpen: false, termsGate: false,
  hubOpen: false, hubOrder: null,
  // assistant
  chatOpen: false, chatInput: '', chatSending: false, chatMessages: [],
}

export default function App() {
  const [s, setS] = useState(INITIAL)
  const patch = useCallback((p) => setS((prev) => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) })), [])
  const timers = useRef({})

  // ---------- login ----------
  const onLoginPhone = (e) => patch({ loginPhone: onlyDigits(e.target.value, 10) })
  const sendLoginCode = () => {
    if (!phoneOk(s.loginPhone)) return
    patch({ loginStage: 'otp', loginCode: newCode(OTP_LEN), loginInput: '' })
  }
  const onLoginInput = (e) => patch({ loginInput: onlyDigits(e.target.value, OTP_LEN) })
  const backLoginPhone = () => patch({ loginStage: 'phone', loginInput: '' })
  const loginVerify = () => {
    if ((s.loginInput || '').length < 4) return
    const v = SAVED_VEHICLES[0]
    patch((prev) => ({
      loggedIn: true, step: 'vehicle',
      cPhone: prev.cPhone || prev.loginPhone, cFirst: prev.cFirst || SAVED_PROFILE.first,
      cLast: prev.cLast || SAVED_PROFILE.last, cWilaya: prev.cWilaya || SAVED_PROFILE.wilaya,
      cCommune: prev.cCommune || SAVED_PROFILE.commune,
      savedVeh: true, autofilled: true, make: v.make, model: v.model, year: v.year, fuel: v.fuel,
      orders: prev.orders.length ? prev.orders : ACCT_ORDERS.slice(),
    }))
    scrollToAccount()
  }
  const logout = () => patch({ ...INITIAL })

  // ---------- navigation ----------
  const scrollToAccount = () => setTimeout(() => {
    const el = document.getElementById('account')
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' })
  }, 60)
  const goOrder = () => {
    if (s.loggedIn) { startNewRequest(); return }
    patch({ loginStage: 'phone' }); scrollToAccount()
  }
  const startNewRequest = () => {
    const v = SAVED_VEHICLES[0]
    patch({ step: 'vehicle', savedVeh: true, autofilled: true, vin: '', make: v.make, model: v.model, year: v.year, fuel: v.fuel, parts: [], pName: '', pRef: '', pBrand: '', pQty: '1', pNote: '', pPhotos: 0 })
    scrollToAccount()
  }

  // ---------- vehicle ----------
  const pickVehicle = (v) => patch({ savedVeh: true, autofilled: true, vin: v.vin || '', make: v.make, model: v.model, year: v.year, fuel: v.fuel })
  const setVin = (e) => patch({ vin: (e.target.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17) })
  const set = (k) => (e) => patch({ [k]: e.target.value })
  const setYear = (e) => patch({ year: onlyDigits(e.target.value, 4) })
  const toggleVinConfirm = (e) => patch({ vinConfirm: e.target.checked })
  const scanCG = () => {
    if (s.scanning || s.autofilled) return
    patch({ scanning: true })
    timers.current.scan = setTimeout(() => patch({ scanning: false, autofilled: true, make: 'كيا', model: 'Picanto', year: '2018', fuel: 'بنزين', vin: 'KNAB1511AJT123456', engine: 'G3LA', vinConfirm: true }), 1100)
  }

  // ---------- parts ----------
  const setQty = (e) => patch({ pQty: onlyDigits(e.target.value, 3) })
  const addPhoto = () => patch((p) => (p.pPhotos < 4 ? { pPhotos: p.pPhotos + 1 } : {}))
  const rmPhoto = () => patch((p) => ({ pPhotos: Math.max(0, p.pPhotos - 1) }))
  const addPart = () => {
    if (!s.pName.trim() && s.pPhotos <= 0) return
    const part = { name: s.pName.trim() || 'قطعة (بالصورة)', ref: s.pRef.trim(), qty: s.pQty || '1', photos: s.pPhotos, brand: s.pBrand.trim(), note: s.pNote.trim() }
    patch((p) => ({ parts: [...p.parts, part], pName: '', pRef: '', pBrand: '', pBrandAlt: '', pQty: '1', pNote: '', pPhotos: 0 }))
  }
  const rmPart = (i) => patch((p) => ({ parts: p.parts.filter((_, j) => j !== i) }))

  // ---------- steps ----------
  const go = (step) => { patch({ step }); scrollToAccount() }
  const vehicleOk = () => { if ((s.vin || '').replace(/\D/g, '').length >= 11) return !!s.vinConfirm; return !!(s.make.trim() && s.model.trim() && String(s.year).trim()) }
  const partOk = () => s.parts.length > 0 || !!s.pName.trim() || s.pPhotos > 0
  const detailsOk = () => !!(s.cFirst.trim() && s.cLast.trim() && phoneOk(s.cPhone) && s.cWilaya)

  // ---------- contact ----------
  const geoDetect = () => {
    if (s.geoState === 'locating') return
    patch({ geoState: 'locating' })
    timers.current.geo = setTimeout(() => patch({ geoState: 'done', cWilaya: 'عنابة', cCommune: 'البوني' }), 1000)
  }

  // ---------- submit ----------
  const startSubmit = () => { if (!(detailsOk() && partOk())) return; patch({ termsOpen: true, termsGate: true }) }
  const submitRequest = () => {
    const code = genOrder()
    const part = (s.parts[0] && s.parts[0].name) || s.pName || 'قطعة'
    const car = s.make ? `${s.make} ${s.model} ${s.year}` : 'مركبتي'
    patch((p) => ({
      loggedIn: true, orders: [{ code, part, car, status: 'sourcing', date: 'اليوم' }, ...p.orders],
      step: 'sent', parts: [], pName: '', pRef: '', pPhotos: 0, savedVeh: false, agree: false, orderNum: code,
    }))
    scrollToAccount()
  }
  const agreeFromTerms = () => {
    const gated = s.termsGate
    patch({ termsOpen: false, termsGate: false, agree: true })
    if (gated) setTimeout(submitRequest, 0)
  }

  // ---------- account / hub / modals ----------
  const openAcct = () => patch({ acctOpen: true, menuOpen: false })
  const closeAcct = () => patch({ acctOpen: false })
  const editProfile = () => patch({ editOpen: true, acctOpen: false })
  const closeEdit = () => patch({ editOpen: false, acctOpen: true })
  const saveProfile = () => patch({ editOpen: false, acctOpen: true })
  const addVehicle = () => { patch({ step: 'vehicle', savedVeh: false, autofilled: false, vin: '', make: '', model: '', year: '', fuel: '', acctOpen: false }); scrollToAccount() }
  const openHub = () => { patch({ hubOpen: true, acctOpen: false, menuOpen: false, hubOrder: null }); window.scrollTo({ top: 0 }) }
  const closeHub = () => patch({ hubOpen: false, hubOrder: null })
  const openOrderJourney = (o) => patch({ hubOrder: o })
  const closeOrderJourney = () => patch({ hubOrder: null })
  const goToOrders = () => patch({ hubOpen: true, hubOrder: null })
  const reorderOrder = (o) => {
    const v = SAVED_VEHICLES[0]
    patch({ hubOpen: false, hubOrder: null, step: 'vehicle', savedVeh: true, autofilled: true, vin: '', make: v.make, model: v.model, year: v.year, fuel: v.fuel, parts: [], pName: (o && o.part) || '', pRef: '', pBrand: '', pQty: '1', pNote: '', pPhotos: 0 })
    scrollToAccount()
  }
  const toggleMenu = () => patch((p) => ({ menuOpen: !p.menuOpen }))
  const closeMenu = () => patch({ menuOpen: false })
  const openContact = () => patch({ contactOpen: true, menuOpen: false })
  const closeContact = () => patch({ contactOpen: false })
  const openTerms = () => patch({ termsOpen: true, termsGate: false, menuOpen: false })
  const closeTerms = () => patch({ termsOpen: false })
  const goLogin = () => { patch({ menuOpen: false }); s.loggedIn ? scrollToAccount() : (patch({ loginStage: 'phone' }), scrollToAccount()) }

  // ---------- assistant (mocked replies) ----------
  const toggleChat = () => patch((p) => ({ chatOpen: !p.chatOpen, chatMessages: (!p.chatOpen && p.chatMessages.length === 0) ? [{ role: 'assistant', text: WELCOME }] : p.chatMessages }))
  const onChatInput = (e) => patch({ chatInput: e.target.value })
  const sendChat = (preset) => {
    const text = (typeof preset === 'string' ? preset : s.chatInput).trim()
    if (!text || s.chatSending) return
    patch((p) => ({ chatMessages: [...p.chatMessages, { role: 'user', text }], chatInput: '', chatSending: true }))
    timers.current.chat = setTimeout(() => {
      patch((p) => ({ chatMessages: [...p.chatMessages, { role: 'assistant', text: mockReply(text) }], chatSending: false }))
    }, 850)
  }

  // ---------- view-model (mirrors renderVals) ----------
  const vm = useMemo(() => {
    const dvin = (s.vin || '').replace(/\D/g, '')
    let sumV = '—'
    if (dvin.length >= 11 && !(s.make && s.model)) sumV = s.vin
    else if (s.make || s.model || s.year) sumV = [s.make, s.model, s.year].filter(Boolean).join(' ')
    const curName = s.pName.trim()
    let sumP = '—'
    if (s.parts.length) sumP = s.parts.map((p) => p.name).join('، ') + (curName ? '، ' + curName : '')
    else if (curName) sumP = curName
    else if (s.pPhotos > 0) sumP = 'قطعة (بالصورة)'
    const photoCount = s.parts.reduce((a, p) => a + (p.photos || 0), 0) + s.pPhotos
    const sumPhotos = photoCount > 0 ? photoCount + ' صورة' : 'بدون صور'

    // status chip colors by family (green = done, amber = in progress, navy = neutral)
    const chip = ({ l, c }) => ({
      stL: l,
      stBg: c === 'green' ? 'var(--green-soft)' : c === 'amber' ? 'var(--amber-soft)' : 'var(--navy-tint)',
      stFg: c === 'green' ? 'var(--green-text)' : c === 'amber' ? 'var(--amber-text)' : 'var(--navy-700)',
      stLine: c === 'green' ? 'var(--green-line)' : c === 'amber' ? 'var(--amber-line)' : 'var(--navy-line)',
      accent: c === 'green' ? 'var(--green)' : c === 'amber' ? 'var(--amber)' : 'var(--navy-700)',
    })

    return {
      isVehicleStep: s.step === 'vehicle', isPartStep: s.step === 'part', isDetailsStep: s.step === 'details', isSent: s.step === 'sent',
      carStepCls: 'oflow-step ' + (s.step === 'vehicle' ? 'on' : 'done'),
      partStepCls: 'oflow-step ' + (s.step === 'part' ? 'on' : (s.step === 'details' || s.step === 'sent' ? 'done' : '')),
      detStepCls: 'oflow-step ' + (s.step === 'details' ? 'on' : (s.step === 'sent' ? 'done' : '')),
      vehDisabled: !vehicleOk(), partNextDisabled: !partOk(), reviewDisabled: !(detailsOk() && partOk()),
      addPartDisabled: !s.pName.trim() && s.pPhotos <= 0, canAddPhoto: s.pPhotos < 4, vinHasValue: dvin.length > 0,
      hasSavedVehicles: SAVED_VEHICLES.length > 0,
      savedVehicles: SAVED_VEHICLES.map((v) => {
        const on = s.make === v.make && s.model === v.model && String(s.year) === String(v.year)
        return { ...v, title: `${v.make} ${v.model} · ${v.year}`, sub: v.fuel || '', on, pick: () => pickVehicle(v) }
      }),
      showScan: s.scanning, showFilled: !s.scanning && s.autofilled, showIdle: !s.scanning && !s.autofilled,
      sumV, sumP, sumPhotos,
      acctName: `${s.cFirst || ''} ${s.cLast || ''}`.trim() || 'مرحباً بك',
      acctPhone: s.cPhone || s.loginPhone || '—',
      acctInitial: (s.cFirst || '').trim()[0] || 'ز',
      ordersCount: s.orders.length, vehiclesCount: SAVED_VEHICLES.length,
      vehicles: SAVED_VEHICLES.map((v) => ({ title: `${v.make} ${v.model} ${v.year}`, sub: v.fuel + (v.vin ? ' · ' + v.vin : '') })),
      profileRows: [
        { k: 'الاسم', v: `${s.cFirst || ''} ${s.cLast || ''}`.trim() || '—' },
        { k: 'الهاتف', v: s.cPhone || s.loginPhone || '—' },
        { k: 'الولاية', v: s.cWilaya || '—' },
        { k: 'البلدية', v: s.cCommune || '—' },
      ],
      orders: s.orders.map((o) => {
        const st = BSTAT[o.status] || { l: o.status, c: 'navy' }
        return {
          ...o, ...chip(st),
          done: o.status === 'delivered' || o.status === 'complete',
          remind: MAINT_RE.test(o.part || ''),
          remindHref: WHATSAPP + '&text=' + encodeURIComponent('أرغب بتفعيل تذكير الصيانة لقطعة: ' + o.part + ' — ' + o.car),
          open: () => openOrderJourney(o), reorder: () => reorderOrder(o),
        }
      }),
      geoLabel: s.geoState === 'locating' ? 'جارٍ تحديد موقعك…' : s.geoState === 'done' ? 'تم تحديد موقعك ✓' : 'حدّد موقعي تلقائياً',
      loginSendDisabled: !phoneOk(s.loginPhone), loginVerifyDisabled: (s.loginInput || '').length < 4,
      chatSendDisabled: !s.chatInput.trim() || s.chatSending,
      showSuggestions: s.chatMessages.length <= 1 && !s.chatSending,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s])

  const app = {
    s, vm, WILAYAS, WHATSAPP, OTP_LEN,
    onLoginPhone, sendLoginCode, onLoginInput, backLoginPhone, loginVerify, logout, goLogin,
    goOrder, startNewRequest, pickVehicle, setVin, set, setYear, toggleVinConfirm, scanCG,
    setQty, addPhoto, rmPhoto, addPart, rmPart, go, geoDetect,
    startSubmit, agreeFromTerms, goToOrders,
    openAcct, closeAcct, editProfile, closeEdit, saveProfile, addVehicle,
    openHub, closeHub, openOrderJourney, closeOrderJourney, reorderOrder,
    toggleMenu, closeMenu, openContact, closeContact, openTerms, closeTerms,
    toggleChat, onChatInput, sendChat,
  }

  return (
    <div dir="rtl" lang="ar">
      <Header app={app} />
      <Landing app={app}>
        <AccountSection app={app} />
      </Landing>
      <Footer app={app} />

      <MobileMenu app={app} />
      <ContactModal app={app} />
      <TermsModal app={app} />
      <AccountModal app={app} />
      <EditProfileModal app={app} />
      {s.hubOpen && <OrdersHub app={app} />}
      <Assistant app={app} />
    </div>
  )
}

// ---- mocked الميسر assistant ----
const WELCOME = 'مرحباً، أنا الميسر — مساعدك في MT AUTO. أساعدك على تحديد القطعة المناسبة لسيارتك، وأشرح لك خطوات الطلب والدليل والدفع. كيف يمكنني مساعدتك؟'
export const SUGGESTIONS = ['ساعدني أحدّد القطعة المناسبة', 'ما معنى «دليل القطعة»؟', 'كم يستغرق استلام العروض؟', 'كيف أدفع؟']
function mockReply(text) {
  const t = text.toLowerCase()
  if (/دليل|فيديو|proof/.test(t)) return 'دليل القطعة فيديو حقيقي يصوّره المحل للقطعة نفسها قبل الشحن، لتتأكّد أنها مطابقة لسيارتك. طلب الدليل يثبّت العرض المختار ويجمّد بقية العروض.'
  if (/ادفع|دفع|سعر|فلوس|pay/.test(t)) return 'الدفع نقداً فقط عند الاستلام، بعد أن تفحص القطعة أمام الموصّل — لا عربون ولا دفع مسبق.'
  if (/كم|مدة|وقت|يستغرق|عروض/.test(t)) return 'نعرض طلبك على شبكة محلّاتنا وتصلك حتى ٣ عروض، وننبّهك على واتساب فور وصولها لتقارن بينها وتختار الأنسب.'
  if (/قطعة|أحدّد|مناسب|سيارة/.test(t)) return 'بكل سرور. أخبرني بطراز سيارتك وسنة الصنع ونوع الوقود، والعطل أو موضع القطعة، ورقم القطعة أو صورة إن توفّرت — وسأساعدك على تضييق الخيارات.'
  return 'أنا هنا للمساعدة في تحديد القطعة وشرح خطوات الطلب والدفع على MT AUTO. اطرح سؤالك وسأجيبك، أو تواصل مع الدعم البشري عبر واتساب.'
}
