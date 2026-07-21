import { WHATSAPP } from '../data.js'

export default function Footer({ app }) {
  const { openContact } = app
  return (
    <footer className="site-foot">
      <div className="foot-top">
        <div className="wrap">
          <div className="foot-brand foot-social">
            <h4 className="social-h">تابعنا</h4>
            <ul className="social-list">
              <li><a href="https://web.facebook.com/profile.php?id=61581476184409" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none"><path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg> فيسبوك</a></li>
              <li><a href="https://www.instagram.com/mtauto.23/" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.6" /><circle cx="17" cy="7" r="1" fill="currentColor" /></svg> إنستغرام</a></li>
              <li><a href="https://www.tiktok.com/@mohamedtaharauto" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none"><path d="M14 4c.3 2.2 1.8 3.9 4 4.2v2.7c-1.5 0-2.9-.4-4-1.2v5.6a5.3 5.3 0 1 1-5.3-5.3c.3 0 .6 0 .9.1v2.8a2.6 2.6 0 1 0 1.8 2.4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg> تيك توك</a></li>
              <li><a href="https://www.youtube.com/@mohamedtaharauto" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.6" /><path d="M11 9.6l4 2.4-4 2.4z" fill="currentColor" /></svg> اليوتيوب</a></li>
              <li><a href={WHATSAPP} target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none"><path d="M4 20l1.4-4.2A8 8 0 1 1 12 20a8 8 0 0 1-3.8-1L4 20z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg> واتساب</a></li>
            </ul>
          </div>
          <div className="fcol"><h4>روابط</h4><ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); openContact() }}>اتصل بنا</a></li>
            <li><a href="#how">كيف نعمل</a></li>
          </ul></div>
        </div>
      </div>
      <div className="foot-bottom">
        <div className="wrap"><span>© 2026 MT AUTO</span></div>
      </div>
    </footer>
  )
}
