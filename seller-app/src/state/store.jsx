import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { api } from '../api/index.js'

const AppContext = createContext(null)

const MODE_KEY = 'mtseller.mode' // persisted sell ⇄ buy header toggle

function readMode() {
  try {
    return localStorage.getItem(MODE_KEY) === 'buy' ? 'buy' : 'sell'
  } catch {
    return 'sell'
  }
}

/** Access the app store (session, shop, routing, toasts). */
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}

export function AppProvider({ children }) {
  const [session, setSession] = useState(() => api.currentSession())
  const [shop, setShop] = useState(null)
  const [route, setRoute] = useState({ name: 'queue', params: {} })
  // Owner "Account area" popup — null | 'settings' | 'team' | 'activity'.
  // These sections are modals over the current view, never routed screens.
  const [accountModal, setAccountModal] = useState(null)
  const accountModalPushed = useRef(false) // did we pushState for the open modal?
  const [mode, setModeState] = useState(readMode)
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  // Load the shop whenever we have a session.
  const refreshShop = useCallback(async () => {
    if (!api.currentSession()) return setShop(null)
    const s = await api.getShop()
    setShop(s)
    return s
  }, [])

  useEffect(() => {
    if (session) refreshShop()
    else setShop(null)
  }, [session, refreshShop])

  const navigate = useCallback((name, params = {}) => setRoute({ name, params }), [])

  // Open one account section as a popup. Owner-only — staff calls are ignored
  // (their menu never offers these, this guards programmatic opens too).
  const openAccountModal = useCallback(
    (name) => {
      if (session?.user?.role !== 'owner') return
      setAccountModal(name)
      window.history.pushState({ accountModal: name }, '')
      accountModalPushed.current = true
    },
    [session],
  )

  // Closing goes through history.back() when we pushed an entry, so ✕/Esc/
  // backdrop and the browser Back button all land on the same popstate path.
  // The flag clears BEFORE back(): popstate is async, and a second close
  // trigger in that window must not issue a second back() (it would traverse
  // past the app's only entry and leave the SPA).
  const closeAccountModal = useCallback(() => {
    if (accountModalPushed.current) {
      accountModalPushed.current = false
      window.history.back()
    } else {
      setAccountModal(null)
    }
  }, [])

  useEffect(() => {
    // Follow the entry's own state rather than blindly closing: Back lands on
    // the base entry (state null → closed) and Forward can land back on a
    // modal entry (→ reopen), so the buttons never hit dead entries.
    const onPop = (e) => {
      const name = e.state?.accountModal
      const valid = name === 'settings' || name === 'team' || name === 'activity' ? name : null
      accountModalPushed.current = Boolean(valid)
      setAccountModal(valid)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const setMode = useCallback((m) => {
    setModeState(m)
    try {
      localStorage.setItem(MODE_KEY, m)
    } catch {
      /* storage blocked — mode still switches for the session */
    }
  }, [])

  const toast = useCallback((text, kind = 'info') => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, text, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])

  const signIn = useCallback(
    (nextSession) => {
      setSession(nextSession)
      setRoute({ name: 'queue', params: {} })
    },
    [],
  )

  const signOut = useCallback(async () => {
    await api.signOut()
    setSession(null)
    setShop(null)
    setAccountModal(null)
  }, [])

  const value = {
    api,
    session,
    setSession,
    shop,
    setShop,
    refreshShop,
    route,
    navigate,
    accountModal,
    openAccountModal,
    closeAccountModal,
    mode,
    setMode,
    toast,
    toasts,
    signIn,
    signOut,
    // Convenience flags
    isOwner: session?.user?.role === 'owner',
    perms: session?.user?.perms || {},
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
