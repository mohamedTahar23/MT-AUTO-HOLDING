import LandingHeader from '../landing/LandingHeader.jsx'
import Hero from '../landing/Hero.jsx'
import StatBand from '../landing/StatBand.jsx'
import HowItWorks from '../landing/HowItWorks.jsx'
import TeamSection from '../landing/TeamSection.jsx'
import WholesaleSection from '../landing/WholesaleSection.jsx'
import SigninCard from '../landing/SigninCard.jsx'
import ContactSection from '../landing/ContactSection.jsx'
import LandingFooter from '../landing/LandingFooter.jsx'

/**
 * Marketing landing + sign-in entry point — the full seller front door from the
 * design bundle, top to bottom: header (lang toggle) → hero → 10%/أنت/نحن band →
 * كيف يعمل → فريق المحل → سوق الجملة → sign-in (Google + OTP) → contact → footer.
 */
export default function LoginGate({ onSubmit }) {
  return (
    <div className="app-page landing-page">
      <LandingHeader />
      <Hero />
      <StatBand />
      <HowItWorks />
      <TeamSection />
      <WholesaleSection />
      <SigninCard onSubmit={onSubmit} />
      <ContactSection />
      <LandingFooter />

      <a className="fab-wa" href="https://wa.me/213659401338" target="_blank" rel="noreferrer" aria-label="واتساب">
        ✆
      </a>
    </div>
  )
}
