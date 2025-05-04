import message from '@/components/Message'
import Pagination from '@/components/Pagination'
import SasIcon from '@/components/SasIcon'
import { addWatchLater, keywordSearch, tagSearch } from '@/services'
import type { VideoItem } from '@/type'
import { formatDate, FormatType } from '@/utils/format'
import { useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { useEffect, useState } from 'react'
import { history, useSearchParams } from 'umi'
export default function search() {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword')
  const tag = searchParams.get('tag')
  // type VideoItemT = VideoItem & { hasCollected?: boolean } // 只代表我又没有点击过加入稍后再看，不代表事实在不在数据库
  const [videoList, setVideoList] = useState<VideoItem[]>([])
  const [pageNo, setPageNo] = useState(1)
  const [total, setTotal] = useState(0)
  const defaultPageSize = 12
  const getSearchResultByTag = async (tagName: string, pageNo: number) => {
    return tagSearch(tagName, pageNo, defaultPageSize).then((res) => {
      setPageNo(res.page)
      setTotal(res.total)
      setVideoList(res.results)
    })
  }
  const getSearchResultByKeyword = async (keyword: string, pageNo: number) => {
    return keywordSearch(keyword, pageNo, defaultPageSize).then((res) => {
      setPageNo(res.page)
      setTotal(res.total)
      setVideoList(res.results)
    })
  }
  const fetchSearchResult = async (
    tagName: string | null,
    keyword: string | null,
    pageNo: number,
  ) => {
    if (tagName) {
      getSearchResultByTag(tagName, pageNo)
    } else if (keyword && keyword.startsWith('tag:')) {
      getSearchResultByTag(keyword.slice(4), pageNo)
    } else if (keyword) {
      getSearchResultByKeyword(keyword, pageNo)
    }
  }
  useEffect(() => {
    // todo: 涉及到分页的时候还有别的参数，这时候api传参还挺麻烦的，需要考虑如何 优化 （柯里化？）
    fetchSearchResult(tag, keyword, pageNo)
  }, [tag, keyword, pageNo, defaultPageSize])

  const queryClient = useQueryClient()
  // 添加处理按钮点击的函数
  const handleButtonClick = async (e: React.MouseEvent, item: VideoItem) => {
    e.stopPropagation() // 阻止事件冒泡，防止触发父元素的点击事件
    try {
      await addWatchLater(item.url)
      message.success('添加稍后再看成功')
      queryClient.invalidateQueries({
        predicate: (query) => {
          const [key, params] = query.queryKey as [string, Record<string, any>]
          return key === 'watchLater'
        },
      })
    } catch (error) {
      // message.error(String(error))
    } finally {
      //修改item的hasCollected为True
      setVideoList(
        produce(videoList, (draft) => {
          const index = draft.findIndex((video) => video.url === item.url)
          if (index !== -1) {
            draft[index].hasCollected = true
          }
        }),
      )
    }
  }

  return (
    <div>
      <header className="mb-6">搜索结果：</header>
      <ul className="flex flex-wrap gap-x-6 gap-y-10">
        {videoList.map((item, index) => (
          <li key={item.url + index} className="w-60">
            <div
              onClick={() => history.push(`/video/${item.url}`)}
              className="group relative h-32 w-full cursor-pointer overflow-hidden rounded-md"
            >
              <img className="h-full w-full object-cover" src={item.cover} />
              {/* 添加遮罩层和按钮 */}
              <div className="absolute inset-0 flex items-start justify-end bg-black bg-opacity-50 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
                  className="rounded bg-black px-1 py-1 text-xs text-white outline-none hover:bg-opacity-80"
                  onClick={(e) => handleButtonClick(e, item)}
                >
                  <SasIcon name={!item.hasCollected ? 'carplay' : 'right'} />
                </button>
              </div>
            </div>
            <div className="mt-2 flex h-8 justify-between">
              <p className="line-clamp-2 cursor-pointer text-sm leading-4 hover:text-primary">
                {item.description}
              </p>
            </div>
            <div
              onClick={() => history.push(`/space/${item.author.id}`)}
              className="mt-1 flex cursor-pointer items-center text-xs text-gray-500 hover:text-primary"
            >
              <SasIcon name="up"></SasIcon>
              <span>{item.author.username}</span>
              <span className="mx-1">·</span>
              <span>{formatDate(item.uploadTime, FormatType.YMD)}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Pagination
          current={pageNo}
          total={total}
          pageSize={defaultPageSize}
          onChange={(page, pageSize) => {
            fetchSearchResult(tag, keyword, page)
          }}
          showTotal={true}
          showNumberJump={true}
        ></Pagination>
      </div>
    </div>
  )
}
