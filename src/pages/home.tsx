import message from '@/components/Message'
import { getVideoList } from '@/services'
import { useAuthStore } from '@/store/authStore'
import type { VideoItem } from '@/type/model'
import { useEffect, useState } from 'react'
import { history } from 'umi'
export default function HomePage() {
  type ListItem = {
    id: number
    name: string
  }
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const leftList: ListItem[] = isLoggedIn
    ? [
        {
          id: 1,
          name: '个性推荐',
        },
        {
          id: 2,
          name: '正在关注',
        },
        {
          id: 3,
          name: '热门排行',
        },
      ]
    : [
        {
          id: 3,
          name: '热门排行',
        },
      ]
  const [videoList, setVideoList] = useState<VideoItem[]>([])
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const fetchVideoList = () => {
    // leftList里有个标识，发请求的时候通过这个表示请求不同的接口或接口内部做处理
    getVideoList()
      .then((data) => {
        setVideoList(data)
      })
      .catch((err) => {
        message.error(err)
      })
  }
  useEffect(() => {
    if (activeIndex >= leftList.length) {
      setActiveIndex(0)
    }
  }, [leftList])
  useEffect(() => {
    // 初始获取视频列表
    fetchVideoList()
  }, [activeIndex, isLoggedIn])
  return (
    <div className="flex flex-col">
      <div className="flex w-full p-3">
        <ul className="flex items-center rounded-full bg-white px-2 py-1">
          {leftList.map((item, index) => (
            <li
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className={`mr-4 cursor-pointer rounded-full px-4 py-1 text-sm font-bold text-[#323B49CC] transition-colors ${activeIndex === index ? 'bg-black text-white' : 'hover:bg-[#e2e2e6] hover:text-black'}`}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      {/* 下面注释掉的是原先没有用瀑布流的布局，我现在还没想好要不要用瀑布流 */}
      {/* <div className="mt-3">
        <ul className="flex w-full flex-wrap justify-between gap-5">
          {videoList.map((item, index) => {
            return (
              <li
                key={item.id}
                onClick={() => history.push(item.url)}
                className="relative mb-3 w-[calc((33.333333%)-1.25rem)] transform cursor-pointer overflow-hidden transition-transform hover:scale-105"
              >
                <div className="absolute inset-0 z-10 bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-30"></div>
                <div className="flex flex-col">
                  <div className="mb-2 h-auto w-full overflow-hidden rounded-lg">
                    <img src={item.cover} alt={item.description} />
                  </div>

                  <div className="flex items-center">
                    <img
                      src={item.author.avatar}
                      alt={item.author.username}
                      className="mr-2 h-8 w-8 rounded-full"
                    />
                    <div>
                      <div className="text-gray-500">{item.description}</div>
                      <div className="flex items-center text-gray-500">
                        <span className="mr-2">{item.playCount}播放</span>
                        <span className="mr-2">
                          {new Date(item.uploadTime).toLocaleDateString()}
                        </span>
                        <span>{item.author.username}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div> */}
      <div className="mt-3 px-5">
        <div className="columns-3 gap-5 space-y-5 [column-fill:_balance] sm:columns-1 md:columns-2 lg:columns-3">
          {videoList.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              onClick={() => history.push(`video/${item.url}`)}
              className="transform cursor-pointer break-inside-avoid-column overflow-hidden transition-transform hover:scale-105"
            >
              <div className="relative">
                <div className="absolute inset-0 z-10 bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-30"></div>
                <div className="flex flex-col">
                  <div className="mb-2 w-full overflow-hidden rounded-lg">
                    <img
                      src={item.cover}
                      alt={item.description}
                      className="h-auto w-full object-cover"
                    />
                  </div>

                  <div className="flex items-center">
                    <img
                      src={item.author.avatar}
                      alt={item.author.username}
                      className="mr-2 h-8 w-8 rounded-full"
                    />
                    <div>
                      <div className="text-gray-500">{item.description}</div>
                      <div className="flex items-center text-gray-500">
                        <span className="mr-2">{item.playCount}播放</span>
                        <span className="mr-2">{item.uploadTime}</span>
                        <span>{item.author.username}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
