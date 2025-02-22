import type { RequestConfig } from 'umi'
import { request as umiRequest } from 'umi'

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
  baseURL: '/api',
  // process.env.NODE_ENV === 'development'
  //   ? '/api'
  //   : 'http://your-prod-domain.com',
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
    (response) => {
      // 进行错误处理和核心数据返回
      // const { status } = response
      // switch (status) {
      //   case 200:
      //     message.success('请求成功')
      //     break
      // }
      return response // axios的拦截器这里是返回response.data,不过最后请求都可以直接拿到响应体
    },
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
