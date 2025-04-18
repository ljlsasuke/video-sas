import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
import { history } from 'umi'
import Login from '../Login'
import SasIcon from '../SasIcon'
import VideoStar from './VideoStar'

export default function TopNav() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  // 使用选择器模式，只订阅需要的状态
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const handlerESC = (event: KeyboardEvent) => {
    if (event.code === 'Escape') {
      handleCloseModal()
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

      {isLoggedIn ? (
        <VideoStar></VideoStar>
      ) : (
        <div
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
        </div>
      )}
      {isLoginModalOpen && <Login onClose={handleCloseModal}></Login>}
    </div>
  )
}
