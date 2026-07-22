export default function MobileMenu({ app }) {
  const { s, closeMenu, openContact, goOrder, goLogin } = app
  return (
    <div className={'mobile-menu' + (s.menuOpen ? ' open' : '')}>
      <div className="scrim" onClick={closeMenu}></div>
      <div className="sheet">
        <div className="mh">
          <a className="brand" href="#" onClick={(e) => { e.preventDefault(); closeMenu() }}><span className="mark">MT</span><span className="wm"><b style={{ color: 'var(--ink)' }}>MT AUTO</b></span></a>
          <button className="x" type="button" onClick={closeMenu} aria-label="إغلاق"><svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
        </div>
        <a href="#how" onClick={closeMenu}><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> كيف نعمل</a>
        <a href="#" onClick={(e) => { e.preventDefault(); openContact() }}><svg viewBox="0 0 24 24" fill="none"><path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.7" /></svg> تواصل معنا</a>
        <div className="mdiv"></div>
        <a href="#account" onClick={(e) => { e.preventDefault(); goLogin() }}><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" /><path d="M7 9h6M7 13h10M7 17h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> طلباتي</a>
        <button className="btn btn-primary btn-block" type="button" onClick={goOrder} style={{ marginTop: 6 }}>اطلب قطعتك</button>
      </div>
    </div>
  )
}
