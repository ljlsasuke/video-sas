import type { LoginResT, recommendedResT, VideoDetailResT } from '@/type'
import { formatDate, formatPlayCount, FormatType } from '@/utils/format'
import { $get, $post } from '@/utils/http'

// 在这里的请求是已经没有业务错误也没有请求错误了,应该直接就被页面上的调用给catch了
export const login = async (data: { username: string; password: string }) => {
  let res = await $post<LoginResT>('/login/', data)
  return res.data
}

export const getVideoList = async () => {
  let res = await $get<recommendedResT>('/videos/recommended/')
  return res.data.map((item) => ({
    ...item,
    uploadTime: formatDate(item.uploadTime),
    playCount: formatPlayCount(item.playCount),
  }))
}

export const getVideoDetail = async (bv: string) => {
  let { data } = await $get<VideoDetailResT>(`/videos/${bv}`)
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
