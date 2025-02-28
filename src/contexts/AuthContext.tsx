import type { UserInfo } from '@/type/model'
import { createContext, useContext, useState } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  token: string | null
  userInfo: UserInfo | null
  setAuthState: (token: string, userInfo: UserInfo) => void
  clearAuthState: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem('token')
    return stored ? stored : null
  })
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const stored = localStorage.getItem('userInfo')
    return stored ? JSON.parse(stored) : null
  })
  const setAuthState = (token: string, info: UserInfo) => {
    setToken(token)
    setUserInfo(info)
    console.log(info, '@@@@@@@@@@@@@@@@@@')
    localStorage.setItem('token', token)
    localStorage.setItem('userInfo', JSON.stringify(info))
  }
  const clearAuthState = () => {
    setUserInfo(null)
    setToken(null)
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userInfo,
        token,
        setAuthState,
        clearAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
