import type {
  HotVideoListResT,
  NewVideoDataT,
  NewVideoResT,
  recommendedResT,
  VideoDetailResT,
  VideoIsUserUploadResT,
} from '@/type'
import { $delete, $get, $post } from '@/utils/http'
export const getRecommendList = async (offset = 0, limit = 10) => {
  let res = await $get<recommendedResT>('/videos/recommended/', {
    params: { offset, limit },
  })
  return res.data
}

export const getHotList = async (offset = 0, limit = 10) => {
  let res = await $get<HotVideoListResT>('/videos/hot/', {
    params: { offset, limit },
  })
  return res.data
}

export const getVideoDetail = async (bv: string) => {
  let { data } = await $get<VideoDetailResT>(`/videos/${bv}/`)
  return data
}
/**
 * 上传这个视频之前，封面和视频都已经上传到了服务器，这里传给后端的是地址
 */
export const createNewVideo = async (data: NewVideoDataT) => {
  let res = await $post<NewVideoResT>('/videos/', data)
  return res.data
}

export const deleteVideo = async (bv: string) => {
  let res = await $delete(`/videos/${bv}/`)
  return res
}

export const getVideoIsUserCreate = async (
  id: number,
  page = 1,
  pageSize = 10,
) => {
  let res = await $get<VideoIsUserUploadResT>(`/users/${id}/upload_videos/`, {
    params: {
      page,
      pageSize,
    },
  })
  return res.data
}
