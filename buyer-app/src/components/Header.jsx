import { IOrders, Logo } from '../icons.jsx'

export default function Header({ app }) {
  const { s, vm, goOrder, openContact, openHub, openAcct, toggleMenu } = app
  return (
    <header className="site-head">
      <div className="wrap">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); goOrder() }}>
          <span className="mark"><Logo /></span>
          <span className="wm"><b>MT AUTO</b></span>
        </a>
        <nav className="nav-main" aria-label="رئيسية">
          <a href="#how">كيف نعمل</a>
          <a href="#" onClick={(e) => { e.preventDefault(); openContact() }}>تواصل</a>
        </nav>
        <span className="sp"></span>
        {s.loggedIn && (
          <div className="nav-acct">
            <button className="hub-link" type="button" onClick={openHub}><IOrders /> طلباتي</button>
            <button className="acct-chip" type="button" onClick={openAcct} aria-label="حسابي">
              <span className="av">{vm.acctInitial}</span><span className="lbl">حسابي</span>
            </button>
          </div>
        )}
        <a className="btn btn-primary head-cta" onClick={goOrder}>اطلب قطعتك</a>
        <button className="hamburger" aria-label="القائمة" onClick={toggleMenu}>
          <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>
    </header>
  )
}
