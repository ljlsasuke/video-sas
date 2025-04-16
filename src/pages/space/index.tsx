import Dialog from '@/components/Dialog'
import SasIcon from '@/components/SasIcon'
import { useMemo, useState } from 'react'
import { history, Outlet, useLocation, useParams } from 'umi'
export default function Space() {
  const params = useParams<{ id: string }>()
  const location = useLocation()
  const { id: userId } = params
  const onChangeAvatar = () => {
    setIsDialogOpen(true)
  }
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const onCloseDialog = () => {
    // 可能还要做一些清理工作，比如清空上传的文件
    setIsDialogOpen(false)
  }
  const activateRoute = useMemo(() => {
    return location.pathname.split('/').at(-1)
  }, [location.pathname])
  type RouterPath = 'upload' | 'collection' | 'watchlater' | 'watchHistory'
  type RouterMapT = {
    name: string
    routePath: RouterPath
    icon?: string
  }
  const RouterMap: RouterMapT[] = [
    {
      name: '投稿管理',
      routePath: 'upload',
      icon: 'video-library',
    },
    {
      name: '收藏视频',
      routePath: 'collection',
      icon: 'star',
    },
    {
      name: '稍后再看',
      routePath: 'watchlater',
      icon: 'carplay',
    },
    {
      name: '观看历史',
      routePath: 'watchHistory',
      icon: 'time-line',
    },
  ]
  return (
    <>
      <div className="-top-tn absolute left-0 right-0 -z-10 h-48 w-screen">
        <img
          className="h-full w-full object-cover"
          src="/biliback.png"
          alt=""
        />
      </div>
      <div>
        <header className="h-20">
          <div className="flex h-16">
            <div
              onClick={onChangeAvatar}
              className="ring-3 group relative h-16 w-16 cursor-pointer overflow-hidden rounded-full ring-2 ring-white"
            >
              <img src="/fakerAvatar.png" alt="" className="h-full w-full" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-sm text-white">更新头像</span>
              </div>
            </div>
            <div className="ml-4 flex flex-col justify-around text-white">
              <p className="font-semibold">只要微笑就好了i</p>
              <p className="text-sm">事实，无情的事实</p>
            </div>
          </div>
          <Dialog
            isOpen={isDialogOpen}
            title="更新头像"
            onClose={() => onCloseDialog()}
            footer={
              <>
                <button
                  onClick={onCloseDialog}
                  className="mr-2 rounded px-4 py-2 text-gray-600"
                >
                  取消
                </button>
                <button
                  onClick={() => onCloseDialog()}
                  className="rounded bg-blue-500 px-4 py-2 text-white"
                >
                  确认
                </button>
              </>
            }
          >
            原来单身
          </Dialog>
        </header>

        <main className="mt-4 flex">
          <ul className="mr-2 w-48 space-y-2">
            {RouterMap.map((item) => (
              <li
                key={item.routePath}
                onClick={() => history.push(item.routePath)}
                className={`${activateRoute === item.routePath ? 'bg-primary text-white' : 'hover:bg-gray-300'} flex cursor-pointer items-center rounded-lg px-2 py-3 transition-colors`}
              >
                <div className="mr-2">
                  <SasIcon name={item.icon ?? 'folder'}></SasIcon>
                </div>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  )
}
