import type { UploadResT } from '@/type'
import { $upload } from '@/utils/http'
export const uploadAvatar = async (file: File) => {
  let res = await $upload<UploadResT>('/upload/avatar/', file)
  return res.data
}
export const uploadCover = async (file: File) => {
  let res = await $upload<UploadResT>('/upload/cover/', file)
  return res.data
}

export const uploadVideo = async (file: File) => {
  let res = await $upload<UploadResT>('/upload/video/', file)
  return res.data
}
