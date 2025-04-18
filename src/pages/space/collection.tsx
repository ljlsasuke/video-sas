import Popover from '@/components/Popover'
import SasIcon from '@/components/SasIcon'
import useCollections from '@/hooks/useCollections'
import { removeCollectionBySelfId } from '@/services'
import { formatDate, FormatType } from '@/utils/format'
import { useState } from 'react'
import { history, useOutletContext } from 'umi'
export default function Collection() {
  const [pageNo, setPageNo] = useState(1)
  const { userId, isCurrentUser } = useOutletContext<{
    userId: string
    isCurrentUser: boolean
  }>()

  const Collections = useCollections(
    pageNo,
    10,
    // 如果是当前用户，就不要传递这个id，后端通过token来获取当前用户的收藏列表
    // 为了和TopNav命中相同缓存
    isCurrentUser ? undefined : Number(userId),
  )
  const videoOptItems = [
    {
      opt: '取消收藏',
      callback: (id: number) => {
        removeCollectionBySelfId(id).then((res) => {
          Collections.refetch()
        })
      },
    },
  ]
  return (
    <div>
      <header className="flex gap-3">
        <div className="h-28 w-48 overflow-hidden rounded-md">
          <img
            className="h-full w-full object-cover"
            src={Collections?.data?.results[0]?.video.cover ?? '/fakerImg.jpg'}
            alt="收藏夹封面"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-xl">默认收藏夹</h1>
            <div className="text-sm text-gray-400">
              视频数：{Collections?.data?.total}
            </div>
          </div>
          <div className="mt-2 flex gap-3 text-sm">
            <button className="rounded-lg bg-primary px-4 py-2 text-white">
              播放全部
            </button>
            <button className="rounded-lg border border-[#e3e5e7] px-5 py-1 transition-colors hover:bg-[#e3e5e7]">
              分享
            </button>
          </div>
        </div>
      </header>
      <div className="my-3 h-[0.5px] bg-[#e3e5e7]"></div>
      <div>
        <ul className="flex flex-wrap gap-4">
          {Collections?.data?.results.map((collection) => (
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

              <div className="mt-2 flex h-8 justify-between">
                <p className="line-clamp-2 cursor-pointer text-sm leading-4 hover:text-primary">
                  {collection.video.description}
                </p>
                {isCurrentUser && (
                  <div className="cursor-pointer text-[#61666d]">
                    <Popover
                      className="min-w-0 px-0"
                      content={
                        <>
                          <ul className="w-32 py-1">
                            {videoOptItems.map((item, index) => (
                              <li
                                key={index}
                                onClick={() => item.callback(collection.id)}
                                className="cursor-pointer hover:bg-[#f6f7f8]"
                              >
                                <p className="py-2 text-center text-base">
                                  {item.opt}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </>
                      }
                    >
                      <SasIcon name="more"></SasIcon>
                    </Popover>
                  </div>
                )}
              </div>
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
