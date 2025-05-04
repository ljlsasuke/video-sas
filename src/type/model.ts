export interface VideoItem {
  author: UserInfo
  url: string // 应该是一个BV号,用在video的路径参数
  cover: string
  playCount: number | string //具体数字或者格式化后的数字
  uploadTime: string // 时间戳？
  description: string // 视频名字
  hasCollected?: boolean
}

export interface UserInfo {
  // 这里肯定不是一个人的全部信息，后续发现多了那些需要就加上去,别的地方单独需要的属性对这个接口进行扩写就行
  id: number // 用户的uid
  username: string
  avatar: string
  description: string
  // interestedTags: Tag[]
  interestedTags: string[]
}

export interface Tag {
  id: number
  name: string
}

export interface VideoDetail extends VideoItem {
  // 进入video页面用到的属性
  tags: Tag[]
  isCollected: boolean
  isInWatchLater: boolean
  filePath: string
  recommended: VideoItem[]
}

export interface CollectionItem {
  id: number
  video: VideoItem
  createdAt: string // 收藏时间
}

export interface WatchHistoryItem {
  id: number
  video: VideoItem
  watchedAt: string // 观看时间
}

export interface WatchLaterItem {
  id: number
  video: VideoItem
  addedAt: string // 添加稍后再看时间
}
