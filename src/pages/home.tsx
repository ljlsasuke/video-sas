import message from '@/components/Message'
import { getHotList, getRecommendList } from '@/services'
import { useAuthStore } from '@/store/authStore'
import type { VideoItem } from '@/type/model'
import { formatDate, formatPlayCount } from '@/utils/format'
import { useCallback, useEffect, useState } from 'react'
import { history } from 'umi'
export default function HomePage() {
  type ListItem = {
    id: number
    name: string
    listType: 'recommend' | 'hot'
  }
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const leftList: ListItem[] = isLoggedIn
    ? [
        {
          id: 1,
          name: '个性推荐',
          listType: 'recommend',
        },
        // {
        //   id: 2,
        //   name: '正在关注',
        // },
        {
          id: 3,
          name: '热门排行',
          listType: 'hot',
        },
      ]
    : [
        {
          id: 3,
          name: '热门排行',
          listType: 'hot',
        },
      ]
  const [videoList, setVideoList] = useState<VideoItem[]>([])
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)
  const [offset, setOffset] = useState<number>(0)
  useEffect(() => {
    const handleScroll = () => {
      // 计算滚动到底部的条件
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        // 50 是一个缓冲值，可根据需求调整
        setOffset((prevOffset) => prevOffset + limit)
      }
    }
    // 定义节流函数
    const throttle = (func: () => void, delay: number) => {
      let lastCall = 0
      return function () {
        const now = new Date().getTime()
        if (now - lastCall >= delay) {
          func()
          lastCall = now
        }
      }
    }
    const throttledHandleScroll = throttle(handleScroll, 200)
    // 添加滚动事件监听
    window.addEventListener('scroll', throttledHandleScroll)

    // 清理函数，组件卸载时移除事件监听
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [limit, offset]) // 添加offset作为依赖项
  const fetchRecommendVideoList = () => {
    getRecommendList(offset, limit)
      .then((data) => {
        setLimit(data.limit)
        setVideoList((prevList) => {
          return [...prevList, ...data.results]
        })
      })
      .catch((err) => {
        message.error(err)
      })
  }
  const handleTabChange = (index: number) => {
    setActiveIndex(index)
    setVideoList([])
    setOffset(0)
    window.scrollTo(0, 0)
  }
  const fetchHotVideoList = () => {
    getHotList(offset, limit)
      .then((data) => {
        setLimit(data.limit)
        setVideoList((prevList) => {
          return [...prevList, ...data.results]
        })
      })
      .catch((err) => {
        message.error(err)
      })
  }

  const fetchVideoList = useCallback(() => {
    if (leftList[activeIndex].listType === 'recommend') {
      return fetchRecommendVideoList()
    } else {
      fetchHotVideoList()
    }
  }, [activeIndex])
  useEffect(() => {
    fetchVideoList()
  }, [limit, offset, activeIndex])
  return (
    <div className="flex flex-col">
      <div className="flex w-full p-3">
        <ul className="flex items-center rounded-full bg-white px-2 py-1">
          {leftList.map((item, index) => (
            <li
              key={item.id}
              onClick={() => handleTabChange(index)}
              className={`mr-4 cursor-pointer rounded-full px-4 py-1 text-sm font-bold text-[#323B49CC] transition-colors ${activeIndex === index ? 'bg-black text-white' : 'hover:bg-[#e2e2e6] hover:text-black'}`}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      {/* 下面注释掉的是原先没有用瀑布流的布局，我现在还没想好要不要用瀑布流 */}
      <div className="mt-3">
        <ul className="flex w-full flex-wrap justify-between gap-5">
          {videoList.map((item, index) => {
            return (
              <li
                key={`${item.url}-${index}`}
                onClick={() => history.push(`video/${item.url}`)}
                className="relative mb-3 w-[calc((33.333333%)-1.25rem)] transform cursor-pointer overflow-hidden transition-transform hover:scale-105"
              >
                <div className="absolute inset-0 z-10 bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-30"></div>
                <div className="flex flex-col">
                  <div className="mb-2 h-48 w-full overflow-hidden rounded-lg">
                    <img
                      className="w-full object-cover"
                      src={item.cover}
                      alt={item.description}
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
                        <span className="mr-2">
                          {formatPlayCount(item.playCount)}播放
                        </span>
                        <span className="mr-2">
                          {formatDate(item.uploadTime)}
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
      {/* 瀑布流布局 AI生成 */}
      {/* <div className="mt-3 px-5">
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
                      className="mr-2 h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-gray-500">{item.description}</div>
                      <div className="flex items-center text-gray-500">
                        <span className="mr-2">
                          {formatPlayCount(item.playCount)}播放
                        </span>
                        <span className="mr-2">
                          {formatDate(item.uploadTime)}
                        </span>
                        <span>{item.author.username}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}
