import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import * as api from '@/lib/api'

interface AuthUser {
  id: string
  email: string
  business_name: string | null
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, businessName: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (!api.isLoggedIn()) {
        setIsLoading(false)
        return
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${api.getToken()}` },
        })
        if (res.ok) {
          setUser(await res.json())
        } else {
          api.clearToken()
        }
      } catch {
        api.clearToken()
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  async function login(email: string, password: string) {
    await api.login(email, password)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${api.getToken()}` },
    })
    setUser(await res.json())
  }

  async function signup(email: string, password: string, businessName: string) {
    await api.signup(email, password, businessName)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${api.getToken()}` },
    })
    setUser(await res.json())
  }

  function logout() {
    api.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: user !== null, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}