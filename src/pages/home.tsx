import { getVideoList } from '@/services/api'
import type { VideoItem } from '@/type'
import { useEffect, useState } from 'react'
import { history } from 'umi'
export default function HomePage() {
  type ListItem = {
    id: number
    name: string
  }

  const [leftList, setLeftList] = useState<ListItem[]>([])
  const [videoList, setVideoList] = useState<VideoItem[]>([])
  useEffect(() => {
    setLeftList([
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
    ])
    getVideoList<VideoItem[]>().then((res) => {
      setVideoList(res)
    })
  }, [])
  return (
    <div className="flex flex-col ">
      <div className="flex w-full">
        <ul className="flex">
          {leftList.map((item) => (
            <li key={item.id} className="mr-2 cursor-pointer">
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3">
        <ul className="flex flex-wrap justify-between w-full gap-5 ">
          {videoList.map((item, index) => {
            return (
              <li
                key={item.id}
                onClick={() => history.push(item.url)}
                className="mb-3 w-[calc((33.333333%)-1.25rem)] relative overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity z-10"></div>
                <div className="flex flex-col">
                  <div className="w-full h-auto mb-2 rounded-lg overflow-hidden">
                    <img src={item.cover} alt={item.description} />
                  </div>

                  <div className="flex items-center">
                    <img
                      src={item.author.avatar}
                      alt={item.author.username}
                      className="w-8 h-8 rounded-full mr-2"
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
