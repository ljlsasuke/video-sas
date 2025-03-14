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

export interface LoginResData {
  token: string
  refresh: string
  userInfo: UserInfo
}

export type recommendedResT = ResponseStructure<VideoItem[]>

export type LoginResT = ResponseStructure<LoginResData>
export type VideoDetailResT = ResponseStructure<VideoDetail>

export type WatchLaterResT = LimitOffsetStructure<WatchLaterItem[]>
export type WatchHistoryResT = LimitOffsetStructure<WatchHistoryItem[]>
export type CollectionsResT = LimitOffsetStructure<CollectionItem[]>
