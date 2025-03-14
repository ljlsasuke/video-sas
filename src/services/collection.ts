import type { CollectionsResT } from '@/type'
import { $delete, $get, $post } from '@/utils/http'
export const getCollections = async (offset: number = 0, limit: number = 5) => {
  let res = await $get<CollectionsResT>('/collections/', {
    params: { offset, limit },
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
