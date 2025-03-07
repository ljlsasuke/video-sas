import type { LoginResData, UserInfo } from '@/type'
import { createContext, useContext, useMemo, useState } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  token: string | null
  refresh: string | null
  userInfo: UserInfo | null
  setAuthState: (authData: LoginResData) => void
  clearAuthState: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem('token')
    return stored ? stored : null
  })
  const [refresh, setRefresh] = useState<string | null>(() => {
    const stored = localStorage.getItem('refresh')
    return stored ? stored : null
  })
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const stored = localStorage.getItem('userInfo')
    return stored ? JSON.parse(stored) : null
  })
  const setAuthState = (authData: LoginResData) => {
    const { token, refresh, userInfo } = authData
    setToken(token)
    setUserInfo(userInfo)
    setRefresh(refresh)
    localStorage.setItem('token', token)
    localStorage.setItem('refresh', refresh)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  }
  const clearAuthState = () => {
    setUserInfo(null)
    setToken(null)
    setRefresh(null)
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
  }
  const contextValue = useMemo<AuthContextType>(
    () => ({
      isLoggedIn: !!token,
      userInfo,
      token,
      refresh,
      setAuthState,
      clearAuthState,
    }),
    [token, userInfo],
  )
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
