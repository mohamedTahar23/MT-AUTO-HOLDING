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

// Tiny inline SVG thumbnail standing in for a buyer-uploaded part photo — no
// external assets, so the mock stays self-contained and CSP-safe.
const photoThumb = (bg) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="${bg}"/><circle cx="48" cy="48" r="22" fill="none" stroke="#FF8A1F" stroke-width="7"/><circle cx="48" cy="48" r="7" fill="#FF8A1F"/></svg>`,
  )

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
// `brandAlt` (optional) names an accepted substitute brand; `buyerPhotoUrl` is a
// masked reference photo the buyer attached (blank when none).
export const tasks = [
  {
    id: 'MT-10482',
    createdAt: mins(7),
    part: { name: 'مضخة ماء', ref: 'RAF-2231' },
    car: { make: 'Volkswagen', model: 'Golf 7', year: 2016, engine: '1.6 TDI' },
    buyerPhotoUrl: photoThumb('#0E2042'),
    prefBrand: 'Hepu',
    brandAlt: 'Gates',
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
    brandAlt: 'TRW',
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
    altOk: false, // أصلي فقط — no substitute accepted
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
    brandAlt: 'KYB',
    altOk: true,
    note: '',
    competingShops: 4,
  },
  {
    id: 'MT-10506',
    createdAt: mins(96),
    part: { name: 'طقم قابض', ref: 'RAF-3382' },
    car: { make: 'Citroën', model: 'C4', year: 2017, engine: '1.6 HDi' },
    buyerPhotoUrl: '',
    prefBrand: 'Valeo',
    brandAlt: 'Sachs',
    altOk: true,
    note: 'يفضّل طقم كامل مع رمان بلي القابض.',
    competingShops: 6,
  },
  {
    id: 'MT-10510',
    createdAt: mins(120),
    part: { name: 'بطارية 60 أمبير', ref: 'RAF-6605' },
    car: { make: 'Kia', model: 'Sportage', year: 2019, engine: '1.6 GDI' },
    buyerPhotoUrl: photoThumb('#143058'),
    prefBrand: 'Varta',
    brandAlt: 'Bosch',
    altOk: true,
    note: 'السيارة متوقّفة — أحتاجها اليوم إن أمكن.',
    competingShops: 3,
  },
  {
    id: 'MT-10515',
    createdAt: mins(150),
    part: { name: 'ذراع مساحات أمامي', ref: 'RAF-7742' },
    car: { make: 'Nissan', model: 'Qashqai', year: 2016, engine: '1.5 dCi' },
    buyerPhotoUrl: '',
    prefBrand: 'Bosch',
    brandAlt: 'Valeo',
    altOk: true,
    note: '',
    competingShops: 5,
  },
]

// My offers. `sent` offers within 15 min can be withdrawn free.
// of_q1/of_q2 both target MT-10501 (still in the open queue) → a 2-offer group
// on the عروضي screen. `ref` is the part reference shown in the offers table
// (may be empty when the seller didn't record one).
export const offers = [
  {
    id: 'of_q1',
    taskId: 'MT-10501',
    partName: 'مساعد أمامي',
    car: 'Hyundai i30 2015',
    ref: 'RAF-1120',
    price: 5200,
    brand: 'Monroe',
    country: 'فرنسا',
    note: '',
    status: 'sent',
    submittedAt: mins(12), // inside the 15-min window → free withdraw
    actedBy: 'u_owner',
    competingShops: 4,
  },
  {
    id: 'of_q2',
    taskId: 'MT-10501',
    partName: 'مساعد أمامي',
    car: 'Hyundai i30 2015',
    ref: 'RAF-1120',
    price: 4700,
    brand: 'KYB',
    country: 'اليابان',
    note: '',
    status: 'sent',
    submittedAt: mins(45), // window closed → withdrawal now warns
    actedBy: 'u_owner',
    competingShops: 4,
  },
  {
    id: 'of_1',
    taskId: 'MT-10470',
    partName: 'فلتر زيت',
    car: 'Toyota Corolla 2017',
    ref: 'RAF-9954',
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
    ref: '', // no reference recorded — table shows an empty cell
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
    ref: 'RAF-5531',
    price: 9200,
    brand: 'Valeo',
    country: 'فرنسا',
    note: '',
    status: 'won', // its order (MT-10459) still awaits the proof video → "مطلوب فيديو"
    submittedAt: mins(280),
    actedBy: 'u_owner',
    competingShops: 3,
  },
  {
    id: 'of_won2',
    taskId: 'MT-10430',
    partName: 'رادياتير مكيّف',
    car: 'BMW Série 3 2018',
    ref: 'RAF-7810',
    price: 62000, // > 50 000 دج → 6% commission tier
    brand: 'Mahle',
    country: 'ألمانيا',
    note: '',
    status: 'won', // video already accepted → confirmed, preparing shipment
    submittedAt: mins(320),
    actedBy: 'u_owner',
    competingShops: 5,
  },
  {
    id: 'of_lost',
    taskId: 'MT-10412',
    partName: 'مقصّ أمامي',
    car: 'Peugeot 208 2015',
    ref: '',
    price: 4800,
    brand: 'TRW',
    country: 'فرنسا',
    note: '',
    status: 'lost',
    submittedAt: mins(2000),
    actedBy: 'u_emp_1',
    competingShops: 7,
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
    delivery: 'paid', // payout settled (see payouts) → full tracker on التسليمات
    actedBy: 'u_owner',
  },
  // Post-handover shipments for the tracking-only التسليمات screen.
  // `delivery` ∈ pack | picked | transit | delivered | dispute | paid — when absent
  // it is derived from `stage` (video/handover → pack, transit → transit, done → delivered).
  {
    id: 'MT-4741',
    offerId: null,
    partName: "Kit d'embrayage",
    car: 'Renault Clio',
    brand: 'Valeo',
    price: 14500,
    status: 'قيد الشحن',
    stage: 'transit',
    proofStatus: 'مرفوع',
    videoDeadline: null,
    labelCode: null,
    delivery: 'picked',
    actedBy: 'u_owner',
  },
  {
    id: 'MT-4733',
    offerId: null,
    partName: 'Disques de frein',
    car: 'Toyota Corolla',
    brand: 'Brembo',
    price: 8900,
    status: 'قيد الشحن',
    stage: 'transit',
    proofStatus: 'مرفوع',
    videoDeadline: null,
    labelCode: null,
    delivery: 'picked',
    actedBy: 'u_emp_1',
  },
  {
    id: 'MT-4719',
    offerId: null,
    partName: 'Pompe à carburant',
    car: 'Hyundai Accent',
    brand: 'Bosch',
    price: 11200,
    status: 'في الطريق',
    stage: 'transit',
    proofStatus: 'مرفوع',
    videoDeadline: null,
    labelCode: null,
    delivery: 'transit',
    actedBy: 'u_owner',
  },
  {
    id: 'MT-4726',
    offerId: null,
    partName: 'Bras de suspension',
    car: 'Kia Picanto',
    brand: 'TRW',
    price: 6400,
    status: 'في الطريق',
    stage: 'transit',
    proofStatus: 'مرفوع',
    videoDeadline: null,
    labelCode: null,
    delivery: 'dispute',
    actedBy: 'u_owner',
  },
  {
    id: 'MT-4702',
    offerId: null,
    partName: 'Phare avant',
    car: 'Volkswagen Golf',
    brand: 'Hella',
    price: 17800,
    status: 'سُلّمت',
    stage: 'done',
    proofStatus: 'مرفوع',
    videoDeadline: null,
    labelCode: null,
    delivery: 'delivered',
    actedBy: 'u_emp_1',
  },
]

// Payouts (الأرباح) — orders that reached the buyer; amounts are held until
// transferred to the shop. status ∈ delivered (awaiting COD collection) |
// collected (MT holds the money) | paid (transferred, paidAt = dd/mm) |
// dispute (frozen — surfaces under التسليمات as «قيد النزاع», never here).
// PAYOUT_BASELINE = lifetime total already received before these rows; the
// receipt toggle adds each confirmed paid amount on top of it.
export const PAYOUT_BASELINE = 494700
export const payouts = [
  { ref: 'MT-4702', partName: 'Phare avant', car: 'Golf', amount: 6500, status: 'delivered', paidAt: null },
  { ref: 'MT-4695', partName: 'Batterie', car: 'Renault Clio', amount: 12000, status: 'collected', paidAt: null },
  { ref: 'MT-4688', partName: "Kit d'essuie-glaces", car: 'Peugeot 301', amount: 1800, status: 'paid', paidAt: '02/10' },
  { ref: 'MT-4676', partName: 'Alternateur', car: 'Hyundai i10', amount: 14000, status: 'paid', paidAt: '28/09' },
  { ref: 'MT-4661', partName: 'Plaquettes', car: 'Renault Symbol', amount: 2400, status: 'paid', paidAt: '21/09' },
  // The disputed shipment (see orders MT-4726) — frozen, excluded from الأرباح.
  { ref: 'MT-4726', partName: 'Bras de suspension', car: 'Kia Picanto', amount: 6400, status: 'dispute', paidAt: null },
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

// Staff activity log (سجل نشاط الموظفين) — owner-only audit trail. STAFF
// actions only (the owner's own actions are never listed). Newest first.
// kind ∈ quote | message | delivery | withdraw | alert | other — drives the
// row's status-dot color on the activity screen.
export const activityLog = [
  {
    id: 'act_1',
    initial: 'ي',
    who: 'yacine@alamine-parts.dz',
    act: 'قدّم عرضاً على',
    target: 'Alternateur · MT-4795',
    meta: '14,000 دج',
    time: 'اليوم 09:14',
    kind: 'quote',
  },
  {
    id: 'act_2',
    initial: 'س',
    who: 'samir@alamine-parts.dz',
    act: 'ردّ على رسالة في',
    target: 'Amortisseur · MT-4726',
    meta: '',
    time: 'اليوم 08:40',
    kind: 'message',
  },
  {
    id: 'act_3',
    initial: 'س',
    who: 'samir@alamine-parts.dz',
    act: 'سلّم الطرد للناقل في',
    target: "Kit d'embrayage · MT-4741",
    meta: '',
    time: 'اليوم 08:12',
    kind: 'delivery',
  },
  {
    id: 'act_4',
    initial: 'ي',
    who: 'yacine@alamine-parts.dz',
    act: 'سحب عرضاً متأخراً على',
    target: 'Pompe à eau · MT-4712',
    meta: '6,500 دج',
    time: 'أمس 18:22',
    kind: 'withdraw',
  },
  {
    id: 'act_5',
    initial: 'س',
    who: 'samir@alamine-parts.dz',
    act: 'أكّد استلام دفعة',
    target: "Kit d'essuie-glaces · MT-4688",
    meta: '1,800 دج',
    time: 'أمس 17:05',
    kind: 'other',
  },
  {
    id: 'act_6',
    initial: 'ي',
    who: 'yacine@alamine-parts.dz',
    act: 'قدّم عرضاً على',
    target: 'Phare avant · MT-4702',
    meta: '17,800 دج',
    time: 'أمس 15:48',
    kind: 'quote',
  },
]

// Messages — thread with the MT team only.
export const messages = [
  { id: 'm1', from: 'MT', at: mins(120), text: 'مرحباً بكم في بوابة البائعين. أي استفسار نحن هنا للمساعدة.' },
  { id: 'm2', from: 'shop', at: mins(90), text: 'شكراً، عندي سؤال حول تأخّر أحد المدفوعات.' },
  { id: 'm3', from: 'MT', at: mins(80), text: 'سيُحرَّر المبلغ تلقائياً بعد تأكيد التسليم. طلب MT-10422 قيد الشحن حالياً.' },
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

// Car makes grouped by origin — powers the queue's "تصفية حسب الماركة" filter.
// `brands` values must match task.car.make exactly for filtering to work.
export const carBrandGroups = [
  { country: 'فرنسية', brands: ['Renault', 'Dacia', 'Peugeot', 'Citroën', 'DS'] },
  { country: 'كورية', brands: ['Hyundai', 'Kia'] },
  { country: 'ألمانية', brands: ['Volkswagen', 'Audi', 'BMW', 'Mercedes', 'Opel', 'Seat'] },
  { country: 'يابانية', brands: ['Toyota', 'Nissan', 'Honda', 'Mazda', 'Suzuki'] },
]

// Sponsored slides for the queue right-rail ad carousel (مموّل). No external
// assets — the card art is a CSS gradient keyed off `hue`.
export const ads = [
  {
    id: 'ad1',
    brand: 'MANN-FILTER',
    eyebrow: 'شريك موثوق',
    title: 'فلاتر أصلية بسعر الجملة',
    sub: 'زيت · هواء · وقود — تغطية كاملة للسيارات الأوروبية',
    cta: 'اكتشف العرض',
    hue: '#0E2042',
  },
  {
    id: 'ad2',
    brand: 'VALEO',
    eyebrow: 'عرض هذا الأسبوع',
    title: 'أطقم قوابض بضمان سنتين',
    sub: 'خصم يصل إلى 15% للبائعين المعتمدين',
    cta: 'اطلب الكتالوج',
    hue: '#143058',
  },
  {
    id: 'ad3',
    brand: 'BOSCH',
    eyebrow: 'وصل حديثاً',
    title: 'بطاريات وشمعات إشعال',
    sub: 'توصيل سريع لعنابة والشرق الجزائري',
    cta: 'تواصل الآن',
    hue: '#1D3F73',
  },
]

// Wholesale demo catalog — powers the one interactive behavior of the Buy
// (الشراء) coming-soon landing: the demo search. Each part is findable by its
// official ref, any alias (old/short/abbreviated refs), its name, or a
// compatible vehicle name. Figures are illustrative — the feature ships later.
export const wholesaleDemo = [
  {
    ref: '24410-2M803',
    aliases: ['2M803-24410', '2M810', '2R-2M803', 'TEN CH SPO'],
    partName: 'Tendeur de chaîne',
    vehicles: ['Sportage 5', 'Tucson', 'Seltos'],
    suppliers: [
      { brand: 'Mobis', origin: 'كوريا الجنوبية', range: '9 250 – 10 500 دج' },
      { brand: 'KFM', origin: 'كوريا الجنوبية', range: '6 200 – 7 400 دج' },
    ],
  },
]

// Wilaya list for enrollment (subset of the 58 — enough for the picker).
export const wilayas = [
  'عنابة', 'الطارف', 'قالمة', 'سكيكدة', 'سوق أهراس', 'قسنطينة', 'ميلة',
  'أم البواقي', 'باتنة', 'تبسة', 'خنشلة', 'بسكرة', 'سطيف', 'برج بوعريريج',
  'جيجل', 'بجاية', 'الجزائر', 'البليدة', 'وهران', 'تيزي وزو', 'بومرداس',
]
