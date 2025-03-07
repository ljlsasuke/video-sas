export interface VideoItem {
  id: number
  author: UserInfo
  url: string // 应该是一个BV号,用在video的路径参数
  cover: string
  playCount: number
  uploadTime: string // 时间戳？
  description: string // 视频名字
}

export interface UserInfo {
  // 这里肯定不是一个人的全部信息，后续发现多了那些需要就加上去,别的地方单独需要的属性对这个接口进行扩写就行
  id: number // 用户的uid
  username: string
  avatar: string
}

export interface Tag {
  id: number
  name: string
}

export interface VideoDetail extends VideoItem {
  // 进入video页面用到的属性
  author: UserInfo & { description: string }
  tags: Tag[]
  isCollected: boolean
}
