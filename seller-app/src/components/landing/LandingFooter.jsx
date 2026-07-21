const SOCIALS = [
  {
    label: 'واتساب',
    href: 'https://wa.me/213659401338',
    icon: (
      <path d="M4 20l1.4-4.2A8 8 0 1 1 12 20a8 8 0 0 1-3.8-1L4 20z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    ),
  },
  {
    label: 'اليوتيوب',
    href: 'https://www.youtube.com/@mohamedtaharauto',
    icon: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M11 9.6l4 2.4-4 2.4z" fill="currentColor" />
      </>
    ),
  },
  {
    label: 'تيك توك',
    href: 'https://www.tiktok.com/@mohamedtaharauto',
    icon: (
      <path
        d="M14 4c.3 2.2 1.8 3.9 4 4.2v2.7c-1.5 0-2.9-.4-4-1.2v5.6a5.3 5.3 0 1 1-5.3-5.3c.3 0 .6 0 .9.1v2.8a2.6 2.6 0 1 0 1.8 2.4V4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: 'إنستغرام',
    href: 'https://www.instagram.com/mtauto.23/',
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17" cy="7" r="1" fill="currentColor" />
      </>
    ),
  },
  {
    label: 'فيسبوك',
    href: 'https://web.facebook.com/profile.php?id=61581476184409',
    icon: (
      <path
        d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
]

/** §9 — navy footer: "تابعنا" + circular social icons + the © line. */
export default function LandingFooter() {
  return (
    <footer className="land-foot">
      <div className="wrap">
        <h4>تابعنا</h4>
        <div className="land-social">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
              <svg viewBox="0 0 24 24" fill="none">{s.icon}</svg>
            </a>
          ))}
        </div>
        <div className="land-foot-bottom">© MT AUTO VIP 2026 — الحجّار، ولاية عنابة.</div>
      </div>
    </footer>
  )
}
