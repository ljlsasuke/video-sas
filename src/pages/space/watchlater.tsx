import SasIcon from '@/components/SasIcon'
import useWatchLater from '@/hooks/useWatchLater'
import { removeWatchLaterBySelfId } from '@/services'
import { useState } from 'react'
import { history } from 'umi'

export default function WatchLater() {
  const [offset, setOffset] = useState(0)
  const limit = 5

  const watchLaterResult = useWatchLater(limit, offset)

  const toRemove = (id: number) => {
    removeWatchLaterBySelfId(id)
      .then(() => {
        watchLaterResult.refetch()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div>
      <header className="mb-3">
        <h1 className="text-3xl font-bold">稍后再看</h1>
      </header>
      <ul>
        {watchLaterResult.data?.results.map((item, index) => (
          <li key={item.id} className="h-32 gap-x-6">
            <div
              onClick={() => history.push(`/video/${item.video.url}`)}
              className="group flex h-full cursor-pointer items-center gap-x-3 rounded-lg py-2 pl-2 transition-colors hover:bg-[#d1d1d9]"
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
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  toRemove(item.id)
                }}
                className="mr-8 hidden text-[#767c8a] hover:text-primary group-hover:block"
              >
                <SasIcon name="trash" width={28} height={28}></SasIcon>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
