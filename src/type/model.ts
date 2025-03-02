export interface VideoItem {
  id: number
  author: {
    id: number // 用户的uid
    username: string
    avatar: string
  }
  url: string // 应该是一个BV号,用在video的路径参数
  cover: string
  playCount: number
  uploadTime: string // 时间戳？
  description: string // 视频名字
}

export interface UserInfo {
  username: string
  avatar: string
}
