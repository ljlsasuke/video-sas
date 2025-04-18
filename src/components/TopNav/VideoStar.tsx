import defaultAvatar from '@/assets/icons/user-no.svg'
import SasIcon from '@/components/SasIcon'
import useCollections from '@/hooks/useCollections'
import useWatchHistory from '@/hooks/useWatchHistory'
import useWatchLater from '@/hooks/useWatchLater'
import { useAuthStore } from '@/store/authStore'
import type { CollectionItem, WatchHistoryItem, WatchLaterItem } from '@/type'
import { formatDate, FormatType } from '@/utils/format'
import { history } from 'umi'
import Popover from '../Popover'
export default function VideoBar() {
  type ListItem = {
    id: number // 这个id应该我随便给就行了,让头像的是 0 其他不重复
    name: string
    icon: string
  }
  const list: ListItem[] = [
    {
      id: 4,
      name: '收藏',
      icon: 'star',
    },
    {
      id: 9,
      name: '观看历史',
      icon: 'time-line',
    },
    {
      id: 7,
      name: '稍后再看',
      icon: 'carplay',
    },
    {
      id: 0,
      name: '头像',
      icon: 'none', //头像木有icon
    },
  ]
  const onClickItem = (item: ListItem) => {
    if (item.id === 7) {
    } else if (item.id === 4) {
    } else if (item.id === 9) {
    }
  }
  const Collection = useCollections()
  const WatchLater = useWatchLater()
  const WatchHistory = useWatchHistory()
  const userInfo = useAuthStore((state) => state.userInfo)
  const clearAuthState = useAuthStore((state) => state.clearAuthState)
  // 渲染用户头像弹出内容
  const renderUserPopoverContent = () => (
    <>
      <div className="flex items-start gap-3">
        <div className="h-16 w-16 overflow-hidden rounded-full transition-transform duration-300">
          <img
            src={userInfo?.avatar || defaultAvatar}
            className="h-full w-full object-cover"
            alt="用户头像"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold">{userInfo?.username}</span>
          <span className="text-sm text-gray-500">LV5</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
        <div className="flex flex-col items-center">
          <span className="font-bold">450</span>
          <span className="text-xs text-gray-500">关注</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">4</span>
          <span className="text-xs text-gray-500">粉丝</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">11</span>
          <span className="text-xs text-gray-500">动态</span>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div
          onClick={() => history.push(`/space/${userInfo?.id}/upload`)}
          className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-100"
        >
          <SasIcon name="video-library" width={18} height={18}></SasIcon>
          <span>投稿管理</span>
        </div>
        <div
          onClick={() => history.push(`/space/${userInfo?.id}`)}
          className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-100"
        >
          <SasIcon name="user-no" width={18} height={18}></SasIcon>
          <span>个人空间</span>
        </div>
        <div
          className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-red-500 hover:bg-gray-100"
          onClick={clearAuthState}
        >
          <SasIcon name="logout" width={18} height={18}></SasIcon>
          <span>退出登录</span>
        </div>
      </div>
    </>
  )
  // 通用的渲染列表内容
  const renderListContent = (
    data: (CollectionItem | WatchHistoryItem | WatchLaterItem)[],
    getTimeLabel: (item: any) => { label: string; time: string },
  ) => (
    <ul className="flex max-h-[800px] flex-col gap-2 overflow-y-auto">
      {data.length !== 0 ? (
        data.map((item) => (
          <li
            key={item.id}
            className="flex w-[400px] cursor-pointer"
            onClick={() => history.push(`/video/${item.video.url}`)}
          >
            <div className="h-[90px] w-[160px] overflow-hidden rounded-md">
              <img
                src={item.video.cover}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="ml-3 flex-1">
              <h1 className="line-clamp-1">{item.video.description}</h1>
              <p className="mt-3 text-sm text-gray-500">
                {item.video.author.username}
              </p>
              <p className="text-sm text-gray-500">
                <span>{getTimeLabel(item).label}</span>
                {getTimeLabel(item).time}
              </p>
            </div>
          </li>
        ))
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-gray-500">暂无数据</p>
        </div>
      )}
    </ul>
  )

  // 根据ID获取弹出内容
  const getPopoverContent = (id: number) => {
    if (id === 0) {
      return renderUserPopoverContent()
    }

    const timeLabels = {
      4: (item: CollectionItem) => ({
        label: '收藏于：',
        time: formatDate(item.createdAt, FormatType.later),
      }),
      9: (item: WatchHistoryItem) => ({
        label: '观看时间：',
        time: formatDate(item.watchedAt, FormatType.YMDHMS),
      }),
      7: (item: WatchLaterItem) => ({
        label: '添加时间：',
        time: formatDate(item.addedAt, FormatType.later),
      }),
    }

    const item = {
      4: Collection,
      9: WatchHistory,
      7: WatchLater,
    }[id]

    if (!item || item.isLoading || !item.data) {
      return (
        <div className="flex h-32 items-center justify-center">
          <p className="text-sm text-gray-500">加载中...</p>
        </div>
      )
    }

    if (id in timeLabels) {
      return renderListContent(
        item.data.results,
        timeLabels[id as keyof typeof timeLabels],
      )
    }

    return null
  }
  return (
    <ul className="flex items-center gap-2">
      {list.map((item) => {
        if (item.id === 0) {
          // 用户个人信息这些数据就直接在登录之后获取然后存在状态管理库里面
          return (
            <li key={item.id} className="ml-2">
              <Popover
                trigger="hover"
                placement="bottom"
                content={getPopoverContent(item.id)}
                className="right-0 w-64 -translate-x-0"
              >
                <div className="h-10 w-10 cursor-pointer overflow-hidden rounded-full">
                  <img
                    src={userInfo?.avatar || defaultAvatar}
                    className="h-full w-full object-cover"
                    alt="用户头像"
                  />
                </div>
              </Popover>
            </li>
          )
        }
        return (
          <li key={item.id}>
            <Popover
              trigger="hover"
              placement="bottom"
              title={item.name}
              content={getPopoverContent(item.id)}
              className="right-0 w-[400px] -translate-x-0"
            >
              <div
                className="cursor-pointer rounded-full border-black p-2 transition-colors duration-200 hover:bg-[#d7d7dd]"
                onClick={() => onClickItem(item)}
              >
                <SasIcon name={item.icon} width={24} height={24}></SasIcon>
              </div>
            </Popover>
          </li>
        )
      })}
    </ul>
  )
}
