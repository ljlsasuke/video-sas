import SasIcon from '@/components/SasIcon'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
import { history } from 'umi'
import Login from './Login'
import message from './Message'
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
      message.warning('这是一个waring')
    }
    if (item.id === 4) {
      message.error('这是一个error')
    }
    if (item.id === 9) {
      message.info('这是一个info')
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
            if (item.id === 0)
              return (
                <li
                  key={item.id}
                  className="ml-2 h-10 w-10 cursor-pointer overflow-hidden rounded-full"
                >
                  <img
                    src={userInfo?.avatar}
                    className="h-full w-full"
                    alt="用户头像"
                  />
                </li>
              )
            return (
              <li
                key={item.id}
                onClick={() => {
                  onClickItem(item)
                }}
                className="cursor-pointer rounded-full border-black p-2 transition-colors duration-200 hover:bg-[#d7d7dd]"
              >
                <SasIcon name={item.icon} width={24} height={24}></SasIcon>
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
