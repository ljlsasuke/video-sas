import type { VideoItem } from '@/type'
import { defineMock } from 'umi'
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
      url: `/video/${i}`,
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
})
