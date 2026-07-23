/** §8 — contact: address / phone / directions card. */
export default function ContactSection() {
  return (
    <section className="land-sec land-sec--white" id="contact">
      <div className="wrap contact-grid">
        <div className="card card-pad contact-card">
          <div className="crow">
            <span className="ci">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            <div>
              <b>العنوان</b>
              <span>الحجّار، ولاية عنابة — «محل محمد الطاهر لبيع قطع غيار السيارات»</span>
            </div>
          </div>
          <div className="crow">
            <span className="ci">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V18a2 2 0 0 1-2 2A14 14 0 0 1 5 6a2 2 0 0 1 0-2z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <b>الهاتف</b>
              <a href="tel:0659401338" className="contact-num" dir="ltr">
                0659 40 13 38
              </a>
            </div>
          </div>
          <a
            className="btn btn-primary btn-block"
            style={{ marginTop: 16 }}
            href="https://maps.app.goo.gl/n7Zxd7ayvok8PNaZ6"
            target="_blank"
            rel="noopener"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" style={{ flex: 'none' }}>
              <path d="M3 11l18-7-7 18-2.6-7.4L3 11z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
            احصل على الاتجاهات
          </a>
        </div>
      </div>
    </section>
  )
}
