import { getHotList, getRecommendList } from '@/services'
import { useAuthStore } from '@/store/authStore'
import type { VideoItem } from '@/type'
import { formatDate, formatPlayCount } from '@/utils/format'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback, useRef, useState } from 'react'
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

  const [activeIndex, setActiveIndex] = useState(0)
  const limit = 10 // 固定的limit值
  type VideoResponseType = {
    limit: number
    offset: number
    results: VideoItem[]
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery<
      VideoResponseType, // 查询函数返回的数据类型
      Error, // 错误类型
      VideoResponseType, // 转换后的数据类型（这里与原始数据相同）
      ['videos', string], // 查询键类型
      number // 分页参数类型
    >({
      queryKey: ['videos', leftList[activeIndex].listType],
      queryFn: async ({ pageParam = 0 }: { pageParam: number }) => {
        try {
          if (leftList[activeIndex].listType === 'recommend') {
            // 返回的是recommendedResT类型
            return await getRecommendList(pageParam, limit)
          } else {
            // 返回的是hotResT类型
            return await getHotList(pageParam, limit)
          }
        } catch (error) {
          console.error('加载视频失败:', error)
          throw error
        }
      },
      getNextPageParam: (lastPage: VideoResponseType): number | undefined => {
        // 如果返回结果为空或少于limit，说明没有更多数据了
        if (!lastPage.results || lastPage.results.length === 0) {
          return undefined // 返回undefined表示没有下一页
        }
        // 否则返回下一页的offset
        return (lastPage.offset || 0) + (lastPage.limit || limit)
      },
      // 如果你不想使用缓存，可以设置以下选项
      staleTime: 0, // 数据立即变为stale
      cacheTime: 5 * 60 * 1000, // 缓存5分钟
    })

  // 获取所有视频列表
  const videoList = data?.pages.flatMap((page) => page.results) || []
  // const videoList = data.results
  console.log(data, '???')

  // 处理标签切换
  const handleTabChange = (index: number) => {
    setActiveIndex(index)
    window.scrollTo(0, 0)
  }

  // 创建一个观察者来检测滚动到底部
  const observer = useRef<IntersectionObserver | null>(null)
  const lastVideoElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isFetchingNextPage) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  )

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

      <div className="mt-3">
        {status === 'loading' ? (
          <div className="flex justify-center py-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
          </div>
        ) : status === 'error' ? (
          <div className="py-4 text-center text-red-500">加载失败，请重试</div>
        ) : (
          <>
            <ul className="flex w-full flex-wrap justify-between gap-5">
              {videoList.map((item, index) => {
                // 为最后一个元素添加ref
                const isLastElement = index === videoList.length - 1

                return (
                  <li
                    key={`${item.url}-${index}`}
                    ref={isLastElement ? lastVideoElementRef : null}
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
                          <div className="line-clamp-2 text-gray-500">
                            {item.description}
                          </div>
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

            {/* 加载状态指示器 */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
              </div>
            )}

            {/* 没有更多数据提示 */}
            {!hasNextPage && videoList.length > 0 && (
              <div className="py-4 text-center text-gray-500">
                没有更多视频了
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
