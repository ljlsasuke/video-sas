import type { UserInfo, UserInfoResT } from '@/type'
import { $get, $put } from '@/utils/http'
export const getUserInfo = async (id: number) => {
  let res = await $get<UserInfoResT>(`/users/${id}/profile/`)
  return res.data
}
export const updateUserInfo = async (data: Partial<UserInfo>) => {
  let res = await $put<any>(`/users/update_profile/`, data)
  return res.data
}
