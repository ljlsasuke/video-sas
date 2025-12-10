import message from '@/components/Message'
import Pagination from '@/components/Pagination'
import SasIcon from '@/components/SasIcon'
import { addWatchLater, keywordSearch, tagSearch } from '@/services'
import { useAuthStore } from '@/store/authStore'
import type { VideoItem } from '@/type'
import { formatDate, FormatType } from '@/utils/format'
import type { PromiseInnerType } from '@/utils/typeGuard'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { useState } from 'react'
import { history, useSearchParams } from 'umi'
const defaultPageSize = 12
type SearchResultResT = PromiseInnerType<ReturnType<typeof keywordSearch>>
export default function search() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword')
  const tag = searchParams.get('tag')
  // type VideoItemT = VideoItem & { hasCollected?: boolean } // 只代表我又没有点击过加入稍后再看，不代表事实在不在数据库
  const [pageNo, setPageNo] = useState(1)
  const { data, isLoading, isError } = useQuery<SearchResultResT>({
    queryKey: ['searchResults', { tag, keyword, pageNo, defaultPageSize }],
    queryFn: async () => {
      // 统一处理所有请求逻辑
      if (tag) {
        return tagSearch(tag, pageNo, defaultPageSize)
      } else if (keyword && keyword.startsWith('tag:')) {
        return tagSearch(keyword.slice(4), pageNo, defaultPageSize)
      } else if (keyword) {
        return keywordSearch(keyword, pageNo, defaultPageSize)
      }
      // 如果没有搜索参数，返回一个空结果
      return { results: [], page: 1, total: 0, pageSize: 0, totalPages: 0 }
    },
    // 启用条件：只有当有搜索参数时才发起请求
    enabled: !!tag || !!keyword,
    // 其他配置，例如 staleTime
    staleTime: 5 * 60 * 1000, // 数据在 5 分钟内被认为是“新鲜”的
  })

  const videoList = data?.results || []
  const total = data?.total || 0
  const queryClient = useQueryClient()
  const queryKey = ['searchResults', { tag, keyword, pageNo, defaultPageSize }]
  // 添加处理按钮点击的函数
  const { mutateAsync: addWatchLaterMutation } = useMutation<
    void,
    Error,
    string
  >({
    mutationFn: (url: string) => addWatchLater(url),
    onSuccess: (_, url) => {
      message.success('添加稍后再看成功')
      queryClient.setQueryData(queryKey, (oldData: typeof data) => {
        if (!oldData) return
        return produce(oldData, (draft) => {
          const index = draft.results.findIndex((video) => video.url === url)
          if (index !== -1) {
            draft.results[index].hasCollected = true
          }
        })
      })

      // 同时，让 watchLater 列表查询失效，确保它能自动刷新
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'watchLater',
      })
    },
    onError: (error) => {
      message.error('添加失败：' + error.message)
    },
  })
  const handleButtonClick = async (e: React.MouseEvent, item: VideoItem) => {
    e.stopPropagation()
    if (!isLoggedIn) {
      message.error('请先登录')
      return
    }
    await addWatchLaterMutation(item.url)
  }

  return (
    <div>
      <header className="mb-6">搜索结果：</header>
      <ul className="flex flex-wrap gap-x-6 gap-y-10">
        {!videoList.length && (
          <div className="flex w-full flex-col items-center justify-center">
            <img src="/nodata.png" alt="nodata" />
            <span className="text-[#949ba3]">空空如也~</span>
          </div>
        )}
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
      {!!videoList.length && (
        <div className="mt-8">
          <Pagination
            current={pageNo}
            total={total}
            pageSize={defaultPageSize}
            onChange={(page, pageSize) => {
              setPageNo(page)
            }}
            showTotal={true}
            showNumberJump={true}
          ></Pagination>
        </div>
      )}
    </div>
  )
}
