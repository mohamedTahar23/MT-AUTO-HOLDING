// Data ported verbatim from the DCLogic class in the design bundle.

export const SAVED_VEHICLES = [
  { make: 'كيا', model: 'Picanto', year: '2018', fuel: 'بنزين', vin: 'KNAB1511AJT123456' },
  { make: 'كيا', model: 'Rio', year: '2016', fuel: 'بنزين', vin: '' },
]

export const SAVED_PROFILE = { first: 'كريم', last: 'بن عيسى', wilaya: 'عنابة', commune: 'الحجار' }

export const ACCT_ORDERS = [
  { code: 'MT-260709-4821', part: 'Plaquettes de frein avant', car: 'كيا Picanto 2018', status: 'quotes', date: '٠٩/٠٧' },
  { code: 'MT-260706-9052', part: 'Phare avant droit', car: 'كيا Rio 2016', status: 'delivered', date: '٠٦/٠٧' },
]

// Buyer-facing order stages (label + color family).
export const BSTAT = {
  sourcing: { l: 'قيد المطابقة', c: 'amber' },
  quotes: { l: 'عروض جاهزة', c: 'amber' },
  video: { l: 'بانتظار الدليل', c: 'amber' },
  confirm: { l: 'مؤكّد', c: 'navy' },
  delivery: { l: 'في الطريق', c: 'amber' },
  delivered: { l: 'سُلّم', c: 'green' },
  complete: { l: 'مكتمل', c: 'green' },
}

export const WILAYAS = [
  { n: 'عنابة', h: 400, d: 250 }, { n: 'الطارف', h: 500, d: 300 }, { n: 'قالمة', h: 500, d: 300 },
  { n: 'سكيكدة', h: 500, d: 300 }, { n: 'سوق أهراس', h: 550, d: 350 }, { n: 'قسنطينة', h: 550, d: 350 },
  { n: 'ميلة', h: 600, d: 350 }, { n: 'أم البواقي', h: 600, d: 350 }, { n: 'باتنة', h: 650, d: 400 },
  { n: 'تبسة', h: 700, d: 400 }, { n: 'خنشلة', h: 700, d: 400 }, { n: 'بسكرة', h: 750, d: 450 },
  { n: 'سطيف', h: 650, d: 400 }, { n: 'برج بوعريريج', h: 700, d: 400 }, { n: 'جيجل', h: 600, d: 350 },
  { n: 'بجاية', h: 650, d: 400 }, { n: 'الجزائر', h: 800, d: 450 }, { n: 'البليدة', h: 800, d: 450 },
  { n: 'وهران', h: 850, d: 500 }, { n: 'تيزي وزو', h: 750, d: 450 }, { n: 'بومرداس', h: 750, d: 450 },
  { n: 'المدية', h: 800, d: 450 }, { n: 'الوادي', h: 850, d: 500 }, { n: 'ورقلة', h: 900, d: 550 },
  { n: 'غرداية', h: 900, d: 550 }, { n: 'بشار', h: 1000, d: 600 },
]

export const WHATSAPP = 'https://api.whatsapp.com/send?phone=213659401338'

// Reverse-marketplace maintenance keywords (drives the "تذكير الصيانة" affordance).
export const MAINT_RE = /زيت|زيوت|فلتر|فلاتر|فيلتر|بلاكي|تيل|فرامل|قرص|أقراص|مساح|ماسح|بوجيه|شمع|سير|سيور|بطاري|إطار|اطار|عجل|تبريد|سائل|شحم|كلاتش|قابض/

export const phoneOk = (p) => /^0[5-7]\d{8}$/.test(p || '')
export const onlyDigits = (s, n) => (s || '').replace(/\D/g, '').slice(0, n)
export const newCode = (len = 6) => {
  let c = ''
  for (let i = 0; i < len; i++) c += Math.floor(Math.random() * 10)
  return c
}
export const genOrder = () => 'MT-' + Math.floor(1000 + Math.random() * 9000)
