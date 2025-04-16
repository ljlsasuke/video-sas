import type { CollectionsResT } from '@/type'
import { $delete, $get, $post } from '@/utils/http'
// 默认是当前登录用户（也就是自己）这时候不用传递userId后端通过token判断
// 获取别人收藏夹的时候需要把 userId传给后端
// 稍后再看和观看历史不加这个是因为这两个只能自己看
export const getCollections = async (
  page = 1,
  pageSize = 10,
  userId?: number,
) => {
  let res = await $get<CollectionsResT>('/collections/', {
    params: {
      type: 'page',
      page,
      pageSize,
      userId,
    },
  })
  return res.data
}

export const addCollection = async (bv: string) => {
  return await $post<any>('/collections/', { video_url: bv })
}

export const removeCollectionByBV = async (bv: string) => {
  return await $delete<any>(`/collections/cancel_by_video/`, {
    params: {
      video_url: bv,
    },
  })
}

export const toggleCollection = async (
  videoUrl: string,
  isCollected: boolean,
) => {
  if (isCollected) {
    await removeCollectionByBV(videoUrl)
  } else {
    await addCollection(videoUrl)
  }
}

export const removeCollectionBySelfId = async (id: number) => {
  return await $delete<any>(`/collections/${id}`)
}
