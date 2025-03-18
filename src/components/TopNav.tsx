import SasIcon from '@/components/SasIcon'
import { getCollections, getWatchHistory, getWatchLater } from '@/services'
import { useAuthStore } from '@/store/authStore'
import type { CollectionItem, WatchHistoryItem, WatchLaterItem } from '@/type'
import { formatDate, FormatType } from '@/utils/format'
import { produce } from 'immer'
import { useEffect, useState } from 'react'
import { history } from 'umi'
import Login from './Login'
import Popover from './Popover'

export default function TopNav() {
  type ListItem = {
    id: number // 这个id应该我随便给就行了,让头像的是 0 其他不重复
    name: string
    icon: string
  }
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  // 使用选择器模式，只订阅需要的状态
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const userInfo = useAuthStore((state) => state.userInfo)
  const clearAuthState = useAuthStore((state) => state.clearAuthState)
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

  const handlerESC = (event: KeyboardEvent) => {
    if (event.code === 'Escape') {
      handleCloseModal()
    }
  }
  const onClickItem = (item: ListItem) => {
    if (item.id === 7) {
    } else if (item.id === 4) {
    } else if (item.id === 9) {
    }
  }
  const handleLoginClick = () => {
    setIsLoginModalOpen(true)
    window.addEventListener('keyup', handlerESC)
  }
  const handleCloseModal = () => {
    setIsLoginModalOpen(false)
    window.removeEventListener('keyup', handlerESC)
  }
  const [keyword, setKeyword] = useState('')
  const handleToSearch = () => {
    if (keyword.trim() === '') {
      return
    }
    history.push(`/search?keyword=${keyword}`)
  }
  const [popoverStates, setPopoverStates] = useState<
    Record<
      number,
      {
        visible: boolean
        dataLoaded: boolean
        data: CollectionItem[] | WatchHistoryItem[] | WatchLaterItem[]
      }
    >
  >({
    4: {
      visible: false,
      dataLoaded: false,
      data: [] as CollectionItem[],
    },
    9: {
      visible: false,
      dataLoaded: false,
      data: [] as WatchHistoryItem[],
    },
    7: {
      visible: false,
      dataLoaded: false,
      data: [] as WatchLaterItem[],
    },
  })

  // 渲染用户头像弹出内容
  const renderUserPopoverContent = () => (
    <>
      <div className="flex items-start gap-3">
        <div className="h-16 w-16 overflow-hidden rounded-full transition-transform duration-300">
          <img
            src={userInfo?.avatar}
            className="h-full w-full"
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
        <div className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-100">
          <SasIcon name="video-library" width={18} height={18}></SasIcon>
          <span>投稿管理</span>
        </div>
        <div className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-100">
          <SasIcon name="user-no" width={18} height={18}></SasIcon>
          <span>账号设置</span>
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

  const fetchCollections = async () => {
    try {
      const res = await getCollections()
      setPopoverStates((prev) =>
        produce(prev, (draft) => {
          // 使用函数式更新获取最新状态
          if (draft[4]) {
            draft[4].data = res.results || []
            draft[4].dataLoaded = true
          }
        }),
      )
    } catch (error) {
      console.error('获取收藏失败:', error)
    }
  }

  const fetchWatchHistory = async () => {
    try {
      const res = await getWatchHistory()
      setPopoverStates((prev) =>
        produce(prev, (draft) => {
          if (draft[9]) {
            draft[9].data = res.results || []
            draft[9].dataLoaded = true
          }
        }),
      )
    } catch (error) {
      console.error('获取历史记录失败:', error)
    }
  }

  const fetchWatchLater = async () => {
    try {
      const res = await getWatchLater()
      setPopoverStates((prev) =>
        produce(prev, (draft) => {
          if (draft[7]) {
            draft[7].data = res.results || []
            draft[7].dataLoaded = true
          }
        }),
      )
    } catch (error) {
      console.error('获取稍后再看失败:', error)
    }
  }
  useEffect(() => {
    // 暂时先不设置触发PopOver的时候再渲染
    // 先这样把UI做出来
    if (isLoggedIn) {
      fetchCollections()
        .then(() => fetchWatchHistory())
        .then(() => fetchWatchLater())
      // fetchCollections()
      // fetchWatchHistory()
      // fetchWatchLater()
    }
  }, [isLoggedIn])

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

    if (id in timeLabels) {
      return renderListContent(
        popoverStates[id].data,
        timeLabels[id as keyof typeof timeLabels],
      )
    }

    return null
  }

  return (
    <div className="fixed z-10 flex h-tn w-5/6 items-center justify-between">
      <div
        className="h-10 w-10 cursor-pointer"
        onClick={() => history.push('/')}
      >
        <SasIcon
          name="logo"
          className="h-full w-full scale-75 fill-primary transition duration-200 ease-in-out hover:scale-100"
        ></SasIcon>
      </div>
      <div className="relative mx-4 h-10 w-1/3 flex-shrink-0">
        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleToSearch()
            }
          }}
          className="my-input-shadow h-10 w-full rounded-full px-3 py-1 ring-opacity-50 transition duration-200 ease-in-out hover:border-gray-400 focus:rounded-2xl focus:border-primary focus:outline-none focus:ring focus:ring-primary"
        />
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={handleToSearch}
        >
          <SasIcon name="search" width={24} height={24}></SasIcon>
        </div>
      </div>
      <ul className="flex items-center gap-2">
        {isLoggedIn ? (
          list.map((item) => {
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
                        src={userInfo?.avatar}
                        className="h-full w-full"
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
          })
        ) : (
          <li
            onClick={handleLoginClick}
            className="flex cursor-pointer items-center rounded-full px-4 py-2 text-primary transition duration-200 ease-in-out hover:bg-primary hover:text-white"
          >
            <SasIcon
              name="user-no"
              width={22}
              height={22}
              className="mr-1"
            ></SasIcon>
            登录
          </li>
        )}
      </ul>
      {isLoginModalOpen && <Login onClose={handleCloseModal}></Login>}
    </div>
  )
}
