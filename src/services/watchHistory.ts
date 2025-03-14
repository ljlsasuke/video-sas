import type { WatchHistoryResT } from '@/type'
import { $delete, $get } from '@/utils/http'
export const getWatchHistory = async (
  offset: number = 0,
  limit: number = 5,
) => {
  let res = await $get<WatchHistoryResT>('/watch-history/', {
    params: { offset, limit },
  })
  return res.data
}

export const removeWatchHistory = async (id: number) => {
  let res = await $delete<any>(`/watch-history/${id}`)
}
