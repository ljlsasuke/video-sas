import type { LoginResT } from '@/type'
import type { VideoItem } from '@/type/model'
import { defineMock } from 'umi'
const randomNum = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min //包含最大最小值
// 生成假数据的函数
function generateFakeVideoData(nums: number = 20) {
  const fakeData: VideoItem[] = []
  for (let i = 1; i <= nums; i++) {
    fakeData.push({
      id: i,
      author: {
        id: i * 3,
        username: `user${i}`,
        avatar: '/fakerAvatar.png',
      },
      url: `/video/${randomNum(1, 6)}`,
      cover: '/fakerImg.jpg',
      playCount: Math.floor(Math.random() * 10000),
      uploadTime: new Date().toISOString(),
      description:
        '【王维MBTI】当16人格听到“你值得被爱”| 超级治愈!! | 部分cp向预警 | 全员向动画',
    })
  }
  return fakeData
}
export default defineMock({
  '/api/recommendList': (req, res) => {
    const { count } = req.query
    const responseBody = generateFakeVideoData(Number(count))
    res.send(responseBody)
  },
  'POST  /api/login': (req, res) => {
    const { username, password } = req.body
    if (username === 'admin' && password === 'admin') {
      res.send({
        code: 200,
        message: '登录成功',
        data: {
          token: 'admin-faker-token',
          userInfo: {
            id: 1,
            username: '是里里大王',
            avatar: '/fakerAvatar.png',
          },
        },
      } as LoginResT)
    } else {
      res.send({
        code: 400,
        message: '用户名或密码错误',
      })
    }
  },
})
