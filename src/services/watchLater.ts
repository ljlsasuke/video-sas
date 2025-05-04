import type { WatchLaterResT } from '@/type'
import { $delete, $get, $post } from '@/utils/http'
export const getWatchLater = async (offset: number = 0, limit: number = 5) => {
  let res = await $get<WatchLaterResT>('/watch-later/', {
    params: { offset, limit },
  })
  return res.data
}
export const addWatchLater = async (bv: string) => {
  let res = await $post<any>('/watch-later/', { video_url: bv })
}

export const removeWatchLaterByBV = async (bv: string) => {
  let res = await $delete<any>('/watch-later/cancel_by_video/', {
    params: { video_url: bv },
  })
}

export const toggleWatchLater = async (
  videoUrl: string,
  isInWatchLater: boolean,
) => {
  if (isInWatchLater) {
    await removeWatchLaterByBV(videoUrl)
  } else {
    await addWatchLater(videoUrl)
  }
}

export const removeWatchLaterBySelfId = async (id: number) => {
  let res = await $delete<any>(`/watch-later/${id}/`)
}
