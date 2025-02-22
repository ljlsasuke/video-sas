interface ResponseStructure<T> {
  code: number
  message: string
  data: T
}

export interface VideoItem {
  id: number
  author: {
    id: number
    username: string
    avatar: string
  }
  url: string
  cover: string
  playCount: number
  uploadTime: string // 时间戳？
  description: string // 视频名字
}
