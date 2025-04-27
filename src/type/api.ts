// 这个文件是用来定义接口返回数据的类型的
import type {
  CollectionItem,
  UserInfo,
  VideoDetail,
  VideoItem,
  WatchHistoryItem,
  WatchLaterItem,
} from './model'
interface ResponseStructure<T> {
  code: number
  message: string
  success: boolean
  data: T
}

export type LimitOffsetStructure<T> = ResponseStructure<{
  limit: number
  offset: number
  results: T
}>

export type PageNumberStructure<T> = ResponseStructure<{
  page: number
  pageSize: number
  total: number
  totalPages: number
  results: T
}>

export interface LoginResData {
  token: string
  refresh: string
  userInfo: UserInfo
}

export type UserInfoResT = ResponseStructure<UserInfo>

export type recommendedResT = LimitOffsetStructure<VideoItem[]>

export type LoginResT = ResponseStructure<LoginResData>
export type VideoDetailResT = ResponseStructure<VideoDetail>

export type WatchLaterResT = LimitOffsetStructure<WatchLaterItem[]>
export type WatchHistoryResT = LimitOffsetStructure<WatchHistoryItem[]>
export type CollectionsResT = PageNumberStructure<CollectionItem[]>

export type UploadResT = ResponseStructure<{ url: string }>

export interface NewVideoDataT {
  filePath: string //视频地址
  cover: string //封面地址
  description: string //标题
  tags: string[] //标签
}
export type NewVideoResT = ResponseStructure<VideoItem>

export type VideoIsUserUploadResT = PageNumberStructure<VideoItem[]>
