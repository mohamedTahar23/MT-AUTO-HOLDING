import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { api } from '../api/index.js'

const AppContext = createContext(null)

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
