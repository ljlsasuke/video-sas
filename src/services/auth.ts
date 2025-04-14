import type { LoginResT } from '@/type'
import { $post } from '@/utils/http'

export const login = async (data: { username: string; password: string }) => {
  let res = await $post<LoginResT>('/login/', data)
  return res.data
}

export const register = async (data: {
  username: string
  password: string
}) => {
  let res = await $post<LoginResT>('/register/', data)
  return res.data
}
