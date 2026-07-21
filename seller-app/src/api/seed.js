// ---------------------------------------------------------------------------
// Seed data for the mocked backend.
//
// Everything here stands in for Supabase reads/RPCs. Shapes mirror the handoff
// "Data Contract" (SELLER-1 offer, SELLER-2 enrollment, SHOP-3 staff, ORDER
// statuses). When you wire the real backend, delete this file — the API adapter
// in ./index.js is the only place that imports it.
// ---------------------------------------------------------------------------

const now = Date.now()
const mins = (m) => new Date(now - m * 60000).toISOString()
const fromNow = (m) => new Date(now + m * 60000).toISOString()

// The signed-in shop (organization). r2.active gates the whole portal.
export const shop = {
  id: 'shop_annaba_01',
  name: 'قطع غيار الأمين',
  wilaya: 'عنابة',
  phone: '0659401338',
  address: 'حي سيدي عمار، طريق سكيكدة، عنابة',
  mapsUrl: 'https://maps.google.com/?q=Garage+Auto+Annaba',
  status: 'active', // 'review' | 'rejected' | 'active'
  rating: 4.7,
  withdraw_warns: 1, // 0..3 → 3 triggers R2
  r2: { active: false, reason: '', since: null, lifted_by: null, lifted_at: null },
}

// Owner + employees, each with owner-defined perms (SHOP-3).
export const shopUsers = [
  {
    id: 'u_owner',
    shop_id: shop.id,
    name: 'الأمين بوعلام',
    role: 'owner',
    perms: { pricing: true, media: true, payout: true, team: true },
  },
  {
    id: 'u_emp_1',
    shop_id: shop.id,
    name: 'سمير حداد',
    role: 'employee',
    perms: { pricing: true, media: true, payout: false, team: false },
  },
  {
    id: 'u_emp_2',
    shop_id: shop.id,
    name: 'ياسين مرابط',
    role: 'employee',
    perms: { pricing: true, media: false, payout: false, team: false },
  },
]

// Known emails → resolve to a user at login. Unknown email → join request flow.
export const knownAccounts = {
  'owner@alamine-parts.dz': 'u_owner',
  'samir@alamine-parts.dz': 'u_emp_1',
}

// seller_task_v — anonymised pricing tasks (the queue). ZERO buyer identity.
export const tasks = [
  {
    id: 'MT-10482',
    createdAt: mins(7),
    part: { name: 'مضخة ماء', ref: 'RAF-2231' },
    car: { make: 'Volkswagen', model: 'Golf 7', year: 2016, engine: '1.6 TDI' },
    buyerPhotoUrl: '',
    prefBrand: 'Hepu',
    altOk: true,
    note: 'القطعة الأصلية بها تسريب، أريد بديلاً موثوقاً.',
    competingShops: 3,
  },
  {
    id: 'MT-10488',
    createdAt: mins(21),
    part: { name: 'أقراص فرامل أمامية', ref: 'RAF-4417' },
    car: { make: 'Peugeot', model: '308', year: 2014, engine: '1.6 HDi' },
    buyerPhotoUrl: '',
    prefBrand: 'Bosch',
    altOk: true,
    note: '',
    competingShops: 5,
  },
  {
    id: 'MT-10495',
    createdAt: mins(46),
    part: { name: 'مصباح أمامي أيسر', ref: 'RAF-8890' },
    car: { make: 'Renault', model: 'Clio 4', year: 2018, engine: '1.5 dCi' },
    buyerPhotoUrl: '',
    prefBrand: 'Valeo',
    altOk: false,
    note: 'أصلي فقط، بدون بدائل.',
    competingShops: 2,
  },
  {
    id: 'MT-10501',
    createdAt: mins(72),
    part: { name: 'مساعد أمامي', ref: 'RAF-1120' },
    car: { make: 'Hyundai', model: 'i30', year: 2015, engine: '1.4' },
    buyerPhotoUrl: '',
    prefBrand: 'Monroe',
    altOk: true,
    note: '',
    competingShops: 4,
  },
]

// My offers. `sent` offers within 15 min can be withdrawn free.
export const offers = [
  {
    id: 'of_1',
    taskId: 'MT-10470',
    partName: 'فلتر زيت',
    car: 'Toyota Corolla 2017',
    price: 1800,
    brand: 'Denso',
    country: 'اليابان',
    note: '',
    status: 'sent', // sent | withdrawn | won | lost
    submittedAt: mins(9), // ~6 min left in the 15-min window
    actedBy: 'u_emp_1',
    competingShops: 4,
  },
  {
    id: 'of_2',
    taskId: 'MT-10465',
    partName: 'طرمبة بنزين',
    car: 'Seat Ibiza 2013',
    price: 6400,
    brand: 'Pierburg',
    country: 'ألمانيا',
    note: 'متوفرة فوراً.',
    status: 'sent',
    submittedAt: mins(40), // window closed → withdrawal now warns
    actedBy: 'u_owner',
    competingShops: 6,
  },
  {
    id: 'of_3',
    taskId: 'MT-10459',
    partName: 'قرص دبرياج',
    car: 'Dacia Logan 2016',
    price: 9200,
    brand: 'Valeo',
    country: 'فرنسا',
    note: '',
    status: 'won',
    submittedAt: mins(280),
    actedBy: 'u_owner',
    competingShops: 3,
  },
]

// Won orders → fulfilment. Statuses per ORDER contract.
// One order is a live "video required" task (24h window).
export const orders = [
  {
    id: 'MT-10459',
    offerId: 'of_3',
    partName: 'قرص دبرياج',
    car: 'Dacia Logan 2016',
    brand: 'Valeo',
    price: 9200,
    status: 'مؤكَّد', // بانتظار الإثبات | مؤكَّد | تجهيز | استلمها الناقل | في الطريق | سُلّمت
    stage: 'video', // 'video' | 'handover' | 'transit' | 'done'
    proofStatus: 'بانتظار', // بانتظار | مرفوع | مرفوض
    videoDeadline: fromNow(19 * 60), // ~19h left
    labelCode: null,
    actedBy: 'u_owner',
  },
  {
    id: 'MT-10440',
    offerId: 'of_old_1',
    partName: 'مروحة تبريد',
    car: 'Kia Picanto 2019',
    brand: 'NRF',
    price: 7300,
    status: 'مؤكَّد',
    stage: 'handover', // proof accepted → hand the masked parcel to carrier
    proofStatus: 'مرفوع',
    videoDeadline: null,
    labelCode: 'YAL-8842-AN',
    actedBy: 'u_owner',
  },
  {
    id: 'MT-10422',
    offerId: 'of_old_2',
    partName: 'ذراع تعليق',
    car: 'Ford Fiesta 2015',
    brand: 'TRW',
    price: 5100,
    status: 'في الطريق',
    stage: 'transit',
    proofStatus: 'مرفوع',
    videoDeadline: null,
    labelCode: 'YAL-8710-AN',
    tracking: ['تجهيز', 'استلمها الناقل', 'في الطريق'],
    actedBy: 'u_emp_1',
  },
  {
    id: 'MT-10405',
    offerId: 'of_old_3',
    partName: 'حساس أكسجين',
    car: 'Chevrolet Aveo 2014',
    brand: 'NGK',
    price: 3600,
    status: 'سُلّمت',
    stage: 'done',
    proofStatus: 'مرفوع',
    videoDeadline: null,
    labelCode: 'YAL-8511-AN',
    tracking: ['تجهيز', 'استلمها الناقل', 'في الطريق', 'سُلّمت'],
    actedBy: 'u_owner',
  },
]

// Payouts — net = agreed price, held until delivery confirmed.
// status: مجمّد (held) | مستحق (due) | تم (paid). COD collected by MT, never the shop.
export const payouts = [
  { orderId: 'MT-10405', partName: 'حساس أكسجين', net: 3600, status: 'مستحق', when: mins(60) },
  { orderId: 'MT-10391', partName: 'دواسة فرامل', net: 2400, status: 'تم', when: mins(1440) },
  { orderId: 'MT-10377', partName: 'مقبض باب', net: 1500, status: 'تم', when: mins(2880) },
  { orderId: 'MT-10422', partName: 'ذراع تعليق', net: 5100, status: 'مجمّد', when: null },
  { orderId: 'MT-10459', partName: 'قرص دبرياج', net: 9200, status: 'مجمّد', when: null },
]

// Performance (الأداء والتقييم).
export const performance = {
  rating: 4.7,
  reviews: 128,
  metrics: [
    { key: 'acceptance', label: 'معدّل القبول', value: 86, unit: '%', good: true },
    { key: 'speed', label: 'سرعة التسعير', value: '4 د', sub: 'متوسط الرد', good: true },
    { key: 'quality', label: 'جودة القطع', value: 96, unit: '%', good: true },
    { key: 'onTime', label: 'الالتزام بالمواعيد', value: 92, unit: '%', good: true },
  ],
  won: 214,
  delivered: 198,
  standing: 'موثوق', // standing tier
}

// Messages — thread with the MT team only.
export const messages = [
  { id: 'm1', from: 'MT', at: mins(120), text: 'مرحباً بكم في بوابة البائعين. أي استفسار نحن هنا للمساعدة.' },
  { id: 'm2', from: 'shop', at: mins(90), text: 'شكراً، عندي سؤال حول تأخّر أحد المدفوعات.' },
  { id: 'm3', from: 'MT', at: mins(80), text: 'سيُحرَّر المبلغ تلقائياً بعد تأكيد التسليم. طلب MT-10422 قيد الشحن حالياً.' },
]

// Announcements — read-only (إعلانات MT).
export const announcements = [
  {
    id: 'a1',
    at: mins(2880),
    title: 'تحديث نافذة سحب العرض',
    body: 'يمكنكم سحب أي عرض مجاناً خلال 15 دقيقة من إرساله. بعد ذلك يُحتسب السحب متأخراً.',
  },
  {
    id: 'a2',
    at: mins(7200),
    title: 'الناقل الجديد: YAL',
    body: 'أصبح تسليم الطرود عبر شركة YAL. سلّموا الطرد المُعمّى للناقل مع ذكر رمز الملصق و«MT AUTO».',
  },
]

// Country-of-manufacture options (بلد الصنع) for the offer modal.
export const countries = [
  'ألمانيا', 'فرنسا', 'إيطاليا', 'إسبانيا', 'اليابان', 'كوريا الجنوبية',
  'الصين', 'تركيا', 'الولايات المتحدة', 'رومانيا', 'التشيك', 'أخرى',
]

// Car-brand specialties (chips) for enrollment (SELLER-2 gChips).
export const brandChips = [
  'Volkswagen', 'Citroën', 'Peugeot', 'Renault', 'Toyota', 'Kia', 'Hyundai',
  'Fiat', 'Seat', 'Škoda', 'Ford', 'Chevrolet', 'Dacia', 'Suzuki', 'Nissan',
  'Mercedes', 'قطع عامة', 'سيارات صينية',
]

// Wilaya list for enrollment (subset of the 58 — enough for the picker).
export const wilayas = [
  'عنابة', 'الطارف', 'قالمة', 'سكيكدة', 'سوق أهراس', 'قسنطينة', 'ميلة',
  'أم البواقي', 'باتنة', 'تبسة', 'خنشلة', 'بسكرة', 'سطيف', 'برج بوعريريج',
  'جيجل', 'بجاية', 'الجزائر', 'البليدة', 'وهران', 'تيزي وزو', 'بومرداس',
]
