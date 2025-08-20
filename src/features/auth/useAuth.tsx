import { createContext, useContext, useState, ReactNode } from 'react'

type AuthStatus = 'idle' | 'loading' | 'success'

type AuthContextType = {
  isLoggedIn: boolean
  status: AuthStatus
  signIn: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('idle')
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const signIn = () => {
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setIsLoggedIn(true)
    }, 1000)
  }

  const signOut = () => {
    setStatus('idle')
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, status, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}