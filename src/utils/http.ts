import { useAuthStore } from '@/store/authStore'
import axios from 'axios'
// 使用getState()获取当前状态，避免React hooks规则限制
const getAuthState = () => useAuthStore.getState()

const baseConfig = {
  baseURL:
    process.env.UMI_APP_ENV === 'development'
      ? process.env.UMI_APP_API_URL
      : 'http://your-prod-domain.com',
  timeout: 10000,
}
const axiosInstance = axios.create(baseConfig)

axiosInstance.interceptors.request.use((config) => {
  const { token } = getAuthState()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
// 用于存储正在进行的刷新token请求
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
  config: any // 就一个标准的axios config,可能多一个 _retry
}> = []
// 执行失败队列中的请求
const processQueue = (error: any = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error)
    } else {
      // 重新发起请求
      resolve(axiosInstance.request(config)) // 用实例去请求没错，重新发起的请求也要走拦截器的
    }
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.code !== 200) {
      return Promise.reject(response.data.message ?? '业务错误')
    }
    return response.data // 只返回请求体呗
  },
  async (error) => {
    const { status, config, response } = error
    if (status === 401 && !config._retry) {
      // _retry 是我自己加上去的
      // 根据这个config再重新发送请求
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
            config: config,
          })
        })
      }
      // 有点不明白这两行
      // 而且这个_retry 什么时候需要去除呢？
      config._retry = true
      isRefreshing = true
      try {
        const refreshSuccess = await toRefreshToken()
        isRefreshing = false
        if (refreshSuccess) {
          processQueue()
          return axiosInstance.request(config)
        } else {
          getAuthState().clearAuthState()
          processQueue(new Error('登录已过期，请重新登录'))
          return Promise.reject('登录已过期，请重新登录')
        }
      } catch (refreshError) {
        isRefreshing = false
        getAuthState().clearAuthState()
        processQueue(refreshError)
        return Promise.reject('登录已过期，请重新登录')
      }
    }
    // 处理不是401的错误
    let errorMessage = response.message // 这个是 axios自动给的message
    if (typeof response.data?.message === 'string')
      errorMessage = response.data.message // 如果后端传过来的有错误信息就用后端的替换掉
    switch (status) {
      case 400:
        errorMessage = '请求参数错误: ' + errorMessage
        break
      case 404:
        errorMessage = '资源不存在: ' + errorMessage
        break
      case 500:
        errorMessage = '服务器错误: ' + errorMessage
        break
    }
    return Promise.reject(errorMessage)
  },
)
interface OtherRequestConfig {
  // AxiosRequestConfig 中 除了data,url,method这些的几项
  params?: any
  headers?: Record<string, string>
  [key: string]: any
}
export const $get = <T>(url: string, config?: OtherRequestConfig) =>
  axiosInstance.get<any, T>(url, config)

export const $post = <T>(
  url: string,
  data?: any,
  config?: OtherRequestConfig,
) => axiosInstance.post<any, T>(url, data, config)

export const $put = <T>(url: string, data?: any, config?: OtherRequestConfig) =>
  axiosInstance.put<any, T>(url, data, config)

export const $delete = <T>(url: string, config?: OtherRequestConfig) =>
  axiosInstance.delete<any, T>(url, config)

export const toRefreshToken = async (): Promise<boolean> => {
  try {
    const { refresh } = getAuthState()
    if (!refresh) {
      return false
    }

    // 使用原始 axios 实例发送请求，跳过拦截器
    const response = await axios.post(
      '/token/refresh/',
      { refresh },
      baseConfig,
    )

    // 处理响应
    if (response.data.code !== 200) {
      return false
    }

    getAuthState().refreshToken(response.data.data.access)
    console.log('成功刷新token')
    return true
  } catch (error) {
    console.error('刷新token失败:', error)
    return false
  }
}
