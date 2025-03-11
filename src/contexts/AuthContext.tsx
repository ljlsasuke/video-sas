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
/**
 * @deprecated 此Provider已弃用，请使用 useAuthStore 代替
 */
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
/**
 * @deprecated 此 Hook 已弃用，请使用 useAuthStore 代替。
 * 由于状态管理还设计了刷新token，这个逻辑需要在组件之外进行，所以Context 并不合适，使用 zustand 状态管理库代替
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
