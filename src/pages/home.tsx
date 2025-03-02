import { useAuth } from '@/contexts/AuthContext'
import { getVideoList } from '@/services/api'
import type { VideoItem } from '@/type/model'
import { useEffect, useState } from 'react'
import { history } from 'umi'
export default function HomePage() {
  type ListItem = {
    id: number
    name: string
  }
  const leftList: ListItem[] = [
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
  const [videoList, setVideoList] = useState<VideoItem[]>([])
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const { isLoggedIn } = useAuth()
  useEffect(() => {
    getVideoList<VideoItem[]>().then((res) => {
      setVideoList(res)
    })
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
      <div className="mt-3">
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
      </div>
    </div>
  )
}
