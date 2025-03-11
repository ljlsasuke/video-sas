import { useAuthStore } from '@/store/authStore'
import pubsub from '@/utils/pubsub'
import type { AxiosError, RequestConfig } from 'umi'
import { request as umiRequest } from 'umi'
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
interface RequestOptions {
  params?: any
  data?: any
  headers?: Record<string, string>
  [key: string]: any
}

// 使用getState()获取当前状态，避免React hooks规则限制
const getAuthState = () => useAuthStore.getState()

let isRefreshing = false
// 用于存储正在进行的刷新token请求
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
  config: CustomRequestConfig
}> = []

// 执行失败队列中的请求
const processQueue = (error: any = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error)
    } else {
      // 重新发起请求
      resolve(MyRequest(config.url, config.method, config))
    }
  })
  failedQueue = []
}

// 添加自定义请求配置接口，扩展AxiosRequestConfig
interface CustomRequestConfig {
  url: string
  method: RequestMethod
  _retry?: boolean
  [key: string]: any
}

const requestConfig: RequestConfig = {
  timeout: 10000,
  // 配置全局请求前缀（根据环境切换）
  baseURL:
    process.env.UMI_APP_ENV === 'development'
      ? process.env.UMI_APP_API_URL
      : 'http://your-prod-domain.com',
  requestInterceptors: [
    (url, options) => {
      // 每次请求前重新获取最新的token
      const { token } = getAuthState()
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
      return { url, options }
    },
  ],
  responseInterceptors: [
    [
      (response) => {
        return response
      },
      async (error: Error) => {
        try {
          const { status, data } = (error as AxiosError<any, any>).response!
          // 将originalRequest转换为我们的自定义类型
          const originalRequest = (error as AxiosError)
            .config as unknown as CustomRequestConfig

          // 处理401错误（未授权，通常是token过期）
          if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
              // 如果已经在刷新token，将请求加入队列
              return new Promise((resolve, reject) => {
                failedQueue.push({
                  resolve,
                  reject,
                  config: originalRequest,
                })
              })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
              // 尝试刷新token
              const refreshSuccess = await toRefreshToken()

              isRefreshing = false

              if (refreshSuccess) {
                // 重新发起之前失败的请求
                processQueue()
                // 重新发起当前请求，确保传递正确的参数
                return MyRequest(
                  originalRequest.url,
                  originalRequest.method as RequestMethod,
                  {
                    ...originalRequest,
                    // 移除可能导致类型错误的属性
                    url: undefined,
                    method: undefined,
                    _retry: undefined,
                  },
                )
              } else {
                // 刷新失败，清除认证状态
                getAuthState().clearAuthState()
                processQueue(new Error('登录已过期，请重新登录'))
                // 可以在这里添加重定向到登录页的逻辑
                // window.location.href = '/login' 不过目前我没有登录页
                return Promise.reject('登录已过期，请重新登录')
              }
            } catch (refreshError) {
              isRefreshing = false
              getAuthState().clearAuthState()
              processQueue(refreshError)
              // window.location.href = '/login'
              return Promise.reject('登录已过期，请重新登录')
            }
          }

          // 其他错误处理逻辑
          let errorMessage = error.message

          if (data && typeof data.message === 'string') {
            errorMessage = data.message
          }

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
        } catch (catchError) {
          console.error('请求错误:', error)
          return Promise.reject('网络连接异常')
        }
      },
    ],
  ],
}

const MyRequest = async <T>(
  url: string,
  method: RequestMethod,
  options: RequestOptions = {},
): Promise<T> => {
  const MyResponse = await umiRequest<T>(url, {
    method: method,
    ...options,
    ...requestConfig,
  })
  return MyResponse
}

export const $get = <T>(url: string, options?: RequestOptions) =>
  MyRequest<T>(url, 'GET', options)

export const $post = <T>(url: string, options?: RequestOptions) =>
  MyRequest<T>(url, 'POST', options)

export const $put = <T>(url: string, options?: RequestOptions) =>
  MyRequest<T>(url, 'PUT', options)

export const $del = <T>(url: string, options?: RequestOptions) =>
  MyRequest<T>(url, 'DELETE', options)

interface RefreshTokenRes {
  code: number
  message: string
  data: {
    access: string
  }
  success: boolean
}
export const TOKEN_REFRESHED_EVENT = 'token-refreshed' // 等以后事件多了把事件常量专门定义一个文件

const toRefreshToken = async (): Promise<boolean> => {
  try {
    const { refresh } = getAuthState()
    if (!refresh) {
      return false
    }

    const response = await $post<RefreshTokenRes>('/token/refresh/', {
      data: {
        refresh: refresh,
      },
    })

    if (response.code !== 200 || !response.data.access) {
      return false
    }

    // 更新token
    getAuthState().refreshToken(response.data.access)
    pubsub.publish(TOKEN_REFRESHED_EVENT)
    console.log('成功刷新token')
    return true
  } catch (error) {
    console.error('刷新token失败:', error)
    return false
  }
}
