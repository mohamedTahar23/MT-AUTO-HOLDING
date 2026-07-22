import { useState } from 'react'
import { useApp } from '../../state/store.jsx'
import LoginGate from './LoginGate.jsx'
import OtpScreen from './OtpScreen.jsx'
import ApplyForm from './ApplyForm.jsx'

/**
 * Orchestrates the pre-auth journey:
 *   login → OTP → (known email)   app
 *             → (unknown email) apply → review
 * Every valid email gets a code and lands on the OTP screen; whether the address
 * belongs to a registered seller is resolved when the code is verified. The
 * "review" state is rendered by App once a session with a review shop exists.
 */
export default function AuthFlow() {
  const { api, setSession, toast } = useApp()
  const [step, setStep] = useState('login')
  const [email, setEmail] = useState('')

  async function startLogin(nextEmail) {
    setEmail(nextEmail)
    await api.requestOtp(nextEmail) // sends the code; every valid email → OTP screen
    setStep('otp')
  }

  async function verify(code) {
    try {
      const { session } = await api.verifyOtp(email, code)
      setSession(session) // App re-routes to the shell (or review) on session change
    } catch (e) {
      // A verified email that isn't a registered seller → the join request flow.
      if (e.message === 'unknown-email') {
        setStep('apply')
        return
      }
      throw e // let OtpScreen surface "الرمز غير صحيح أو منتهي الصلاحية"
    }
  }

  async function resend() {
    await api.requestOtp(email)
  }

  async function submitApply(payload) {
    await api.applyShop({ ...payload, gEmail: email })
    setSession(api.currentSession()) // now a "review" shop → App shows UnderReview
    toast('استلمنا طلبك — حسابك قيد المراجعة.', 'ok')
  }

  if (step === 'otp')
    return (
      <OtpScreen
        email={email}
        onVerify={verify}
        onResend={resend}
        onChangeEmail={() => setStep('login')}
      />
    )
  if (step === 'apply')
    return <ApplyForm email={email} onSubmit={submitApply} onBack={() => setStep('login')} />
  return <LoginGate onSubmit={startLogin} />
}
