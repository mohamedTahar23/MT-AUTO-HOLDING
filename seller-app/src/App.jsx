import { AppProvider, useApp } from './state/store.jsx'
import AuthFlow from './components/auth/AuthFlow.jsx'
import UnderReview from './components/auth/UnderReview.jsx'
import AppShell from './components/shell/AppShell.jsx'
import Toaster from './components/ui/Toaster.jsx'
import DevPanel from './components/dev/DevPanel.jsx'

function Root() {
  const { session, shop } = useApp()

  let view
  if (!session) view = <AuthFlow />
  else if (!shop) view = <div className="auth-wrap"><div className="card card-pad muted">جارٍ التحميل…</div></div>
  else if (shop.status === 'review') view = <UnderReview />
  else view = <AppShell />

  return (
    <>
      {view}
      <Toaster />
      <DevPanel />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  )
}
