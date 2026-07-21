import { useState } from 'react'
import { useApp } from '../../state/store.jsx'
import LoginGate from './LoginGate.jsx'
import OtpScreen from './OtpScreen.jsx'
import ApplyForm from './ApplyForm.jsx'

/**
 * Orchestrates the pre-auth journey:
 *   login → (known email) OTP → app
 *         → (unknown email) apply → review
 * The "review" state is rendered by App once a session with a review shop exists.
 */
export default function AuthFlow() {
  const { api, setSession, toast } = useApp()
  const [step, setStep] = useState('login')
  const [email, setEmail] = useState('')

  async function startLogin(nextEmail) {
    setEmail(nextEmail)
    const { known } = await api.requestOtp(nextEmail)
    setStep(known ? 'otp' : 'apply')
  }

  async function verify(code) {
    const { session } = await api.verifyOtp(email, code)
    setSession(session) // App re-routes to the shell (or review) on session change
  }

  async function submitApply(payload) {
    await api.applyShop({ ...payload, gEmail: email })
    setSession(api.currentSession()) // now a "review" shop → App shows UnderReview
    toast('استلمنا طلبك — حسابك قيد المراجعة.', 'ok')
  }

  if (step === 'otp')
    return <OtpScreen email={email} onVerify={verify} onChangeEmail={() => setStep('login')} />
  if (step === 'apply')
    return <ApplyForm email={email} onSubmit={submitApply} onBack={() => setStep('login')} />
  return <LoginGate onSubmit={startLogin} />
}
