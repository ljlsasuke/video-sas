import SasIcon from '@/components/SasIcon'
import useCollections from '@/hooks/useCollections'
import { formatDate, FormatType } from '@/utils/format'
import { useState } from 'react'
import { history, useOutletContext } from 'umi'
export default function Collection() {
  const [pageNo, setPageNo] = useState(1)
  const { userId, isCurrentUser } = useOutletContext<{
    userId: string
    isCurrentUser: boolean
  }>()

  const { isLoading, isError, data } = useCollections(
    pageNo,
    10,
    // 如果是当前用户，就不要传递这个id，后端通过token来获取当前用户的收藏列表
    // 为了和TopNav命中相同缓存
    isCurrentUser ? undefined : Number(userId),
  )
  return (
    <div>
      <header onClick={() => setPageNo((pageNo) => pageNo + 1)}>
        收藏的Header{pageNo}
      </header>
      <div>
        <ul className="flex flex-wrap gap-4">
          {data?.results.map((collection) => (
            <li key={collection.id} className="flex w-48 flex-col">
              <div
                onClick={() => history.push(`/video/${collection.video.url}`)}
                className="h-28 cursor-pointer overflow-hidden rounded-lg"
              >
                <img
                  className="h-full w-full object-cover"
                  src={collection.video.cover}
                  alt=""
                />
              </div>
              <p className="mt-2 line-clamp-2 h-8 cursor-pointer text-sm leading-4 hover:text-primary">
                {collection.video.description}
              </p>
              <div
                onClick={() =>
                  history.push(`/space/${collection.video.author.id}`)
                }
                className="mt-1 flex cursor-pointer items-center text-xs text-gray-500 hover:text-primary"
              >
                <SasIcon name="up"></SasIcon>
                <span>{collection.video.author.username}</span>
                <span className="mx-1">·</span>
                <span>
                  收藏于 {formatDate(collection.createdAt, FormatType.later)}
                </span>
              </div>
            </li>
          ))}
        </ul>
        {/* 这里放一个分页组件 */}
      </div>
    </div>
  )
}
