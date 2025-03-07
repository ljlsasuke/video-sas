import type { RequestConfig } from 'umi'
import { AxiosError, request as umiRequest } from 'umi'
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
interface RequestOptions {
  params?: any
  data?: any
  headers?: Record<string, string>
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
      const token = localStorage.getItem('token')
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
      (error: Error) => {
        try {
          const { status, data } = (error as AxiosError<any, any>).response!
          // 返回一个被拒绝的Promise，但确保传递的是字符串错误消息
          // 而不是整个错误对象
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
          // 返回字符串错误消息而不是整个错误对象
          return Promise.reject(errorMessage)
        } catch (catchError) {
          // 处理response可能为undefined的情况
          console.error('请求错误:', error)
          // 同样返回字符串而不是对象
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
