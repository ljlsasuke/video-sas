import SasIcon from '@/components/SasIcon'
import useWatchHistory from '@/hooks/useWatchHistory'
import { removeWatchHistory } from '@/services'
import { FormatType, formatDate } from '@/utils/format'
import { useState } from 'react'
import { history } from 'umi'

export default function WatchHistory() {
  const [offset, setOffset] = useState(0)
  const limit = 5

  const watchHistoryResult = useWatchHistory(limit, offset)

  const toRemove = (id: number) => {
    removeWatchHistory(id)
      .then(() => {
        // todo: 这里就先用 refetch 实现功能，后续再换成让key过期的那个，顺便了解一下useMutation的用法
        // todo: 无限滚动找出一个最佳实践（1.判断和底部的距离并且节流？2.React Query的无限滚动 3.IntersectionObserver）
        watchHistoryResult.refetch()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div>
      <header className="mb-3">
        <h1 className="text-3xl font-bold">观看历史</h1>
        {/* <button>清除所有观看历史</button> */}
      </header>
      <ul>
        {watchHistoryResult.data?.results.map((item, index) => (
          <li key={item.id} className="flex h-32 gap-x-6">
            {/* 左侧的虚线和观看时间 */}
            <div className="relative flex h-full w-52 items-center border-l-2 border-dashed border-l-[#e2e2e9] pl-2 before:absolute before:left-[-5px] before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full before:bg-[#e2e2e9]">
              <div className="text-[#7e8492]">
                {formatDate(item.watchedAt, FormatType.YMDHMS)}
              </div>
            </div>
            {/* 右侧的视频 */}
            <div
              onClick={() => history.push(`/video/${item.video.url}`)}
              // 添加 group 类
              className="group flex h-full flex-1 cursor-pointer items-center gap-x-3 rounded-lg py-2 pl-2 transition-colors hover:bg-[#d1d1d9]"
            >
              <div className="h-full w-52 overflow-hidden rounded-lg">
                <img
                  src={item.video.cover}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="line-clamp-2 cursor-pointer text-sm leading-4">
                  {item.video.description}
                </p>
                <div className="mt-4 flex items-center gap-x-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full">
                    <img
                      src={item.video.author.avatar}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-light text-[#7e8492]">
                    {item.video.author.username}
                  </span>
                </div>
              </div>
              {/* 添加 hidden group-hover:block 类 */}
              {/* group-hover 这个类用来控制hover到父元素的实现显示自己 */}
              <div
                onClick={(e) => {
                  e.stopPropagation() // 阻止事件冒泡，防止点击删除按钮时触发父元素的点击事件
                  toRemove(item.id)
                }}
                className="hidden text-[#767c8a] hover:text-primary group-hover:block"
              >
                <SasIcon name="trash" width={24} height={24}></SasIcon>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
