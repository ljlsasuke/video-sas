import type { recommendedResT, VideoDetailResT } from '@/type'
import { formatDate, formatPlayCount, FormatType } from '@/utils/format'
import { $get } from '@/utils/http'
export const getVideoList = async () => {
  let res = await $get<recommendedResT>('/videos/recommended/')
  return res.data.map((item) => ({
    ...item,
    uploadTime: formatDate(item.uploadTime),
    playCount: formatPlayCount(item.playCount),
  }))
}

export const getVideoDetail = async (bv: string) => {
  let { data } = await $get<VideoDetailResT>(`/videos/${bv}/`)
  return {
    ...data,
    playCount: formatPlayCount(data.playCount),
    uploadTime: formatDate(data.uploadTime, FormatType.YMDHMS),
    recommended: data.recommended.map((item) => ({
      ...item,
      playCount: formatPlayCount(item.playCount),
    })),
  }
}
