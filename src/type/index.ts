// 这个文件是用来定义接口返回数据的类型的
import type { UserInfo } from './model'
interface ResponseStructure<T> {
  code: number
  message: string
  data: T
}

export type LoginResT = ResponseStructure<{ token: string; userInfo: UserInfo }>
