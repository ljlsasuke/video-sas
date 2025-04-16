import type { UserInfoResT } from '@/type'
import { $get } from '@/utils/http'
export const getUserInfo = async (id: number) => {
  let res = await $get<UserInfoResT>(`/users/${id}/profile/`)
  return res.data
}
