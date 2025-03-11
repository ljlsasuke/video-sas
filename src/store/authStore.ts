import { create } from 'zustand'
import type { LoginResData, UserInfo } from '@/type'

interface AuthState {
  token: string | null
  refresh: string | null
  userInfo: UserInfo | null
  isLoggedIn: boolean
  
  // 操作方法
  setAuthState: (authData: LoginResData) => void
  clearAuthState: () => void
  refreshToken: (newToken: string, newRefresh?: string) => void
}

// 从localStorage获取初始状态
const getStoredToken = () => localStorage.getItem('token')
const getStoredRefresh = () => localStorage.getItem('refresh')
const getStoredUserInfo = () => {
  const stored = localStorage.getItem('userInfo')
  return stored ? JSON.parse(stored) : null
}

export const useAuthStore = create<AuthState>((set) => ({
  token: getStoredToken(),
  refresh: getStoredRefresh(),
  userInfo: getStoredUserInfo(),
  isLoggedIn: !!getStoredToken(),
  
  setAuthState: (authData: LoginResData) => {
    const { token, refresh, userInfo } = authData
    
    // 更新localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('refresh', refresh)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    
    // 更新状态
    set({
      token,
      refresh,
      userInfo,
      isLoggedIn: true
    })
  },
  
  clearAuthState: () => {
    // 清除localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    localStorage.removeItem('userInfo')
    
    // 更新状态
    set({
      token: null,
      refresh: null,
      userInfo: null,
      isLoggedIn: false
    })
  },
  
  refreshToken: (newToken: string, newRefresh?: string) => {
    // 更新localStorage
    localStorage.setItem('token', newToken)
    if (newRefresh) {
      localStorage.setItem('refresh', newRefresh)
    }
    
    // 更新状态
    set((state) => ({
      token: newToken,
      refresh: newRefresh || state.refresh
    }))
  }
}))