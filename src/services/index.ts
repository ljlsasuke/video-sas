import type { LoginResT, recommendedResT, VideoDetailResT } from '@/type'
import { formatDate, formatPlayCount, FormatType } from '@/utils/format'
import { $get, $post } from '@/utils/http'

// 可以转化成async/await的写法，不过暂时感觉没啥必要
export const login = (data: { username: string; password: string }) => {
  return $post<LoginResT>('/login/', { data }).then((res) => {
    if (res.code !== 200) return Promise.reject(res.message)
    return res
  })
}

export const getVideoList = () => {
  return $get<recommendedResT>('/videos/recommended/').then((res) => {
    if (res.code !== 200) return Promise.reject(res.message)
    res.data.forEach((item) => {
      item.uploadTime = formatDate(item.uploadTime, FormatType.later)
      item.playCount = formatPlayCount(item.playCount)
    })
    return res
  })
}

export const getVideoDetail = (bv: string) => {
  return $get<VideoDetailResT>(`/videos/${bv}`).then((res) => {
    if (res.code !== 200) return Promise.reject(res.message)
    res.data.playCount = formatPlayCount(res.data.playCount)
    res.data.uploadTime = formatDate(res.data.uploadTime, FormatType.YMDHMS)
    res.data.recommended.forEach((item) => {
      item.playCount = formatPlayCount(item.playCount)
    })
    return res
  })
}
