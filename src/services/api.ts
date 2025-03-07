import type { LoginResT } from '@/type'
import { $get, $post } from '@/utils/http'
export const getVideoList = <T = any>() => {
  return $get<T>('/videos/recommended/')
}
export const login = (data: { username: string; password: string }) => {
  return $post<LoginResT>('/login/', { data })
}
