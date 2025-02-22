import { $get } from '@/utils/http'
export const getVideoList = <T = any>() => {
  return $get<T>('/recommendList', { params: { count: 9 } })
}
