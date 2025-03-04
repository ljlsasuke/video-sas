import SasIcon from '@/components/SasIcon'
import { useAuth } from '@/contexts/AuthContext'
import { useMemo, useState } from 'react'
import { history } from 'umi'
import Login from './Login'
import message from './Message'
export default function TopNav() {
  type ListItem = {
    id: number
    name: string
  }
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { isLoggedIn } = useAuth()
  const list = useMemo<ListItem[]>(() => {
    return isLoggedIn
      ? [
          {
            id: 7,
            name: '稍后再看',
          },
          {
            id: 4,
            name: '动态',
          },
          {
            id: 9,
            name: '里里大王',
          },
        ]
      : [
          {
            id: 0,
            name: '登录',
          },
        ]
  }, [isLoggedIn])
  const handlerESC = (event: KeyboardEvent) => {
    if (event.code === 'Escape') {
      handleCloseModal()
    }
  }

  const onClickItem = (item: ListItem) => {
    if (item.name === '登录') {
      handleLoginClick()
    }
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
      <div className="mx-4 h-10 w-1/3 flex-shrink-0">
        <input
          type="text"
          className="border-1 h-10 w-full rounded-full border border-gray-300 px-3 py-1 ring-opacity-50 transition duration-200 ease-in-out hover:border-gray-400 focus:rounded-2xl focus:border-primary focus:outline-none focus:ring focus:ring-primary"
        />
      </div>
      <ul className="flex">
        {list.map((item) => {
          return (
            <li
              key={item.id}
              onClick={() => {
                onClickItem(item)
              }}
              className="cursor-pointer rounded-full px-4 py-2 text-primary transition duration-200 ease-in-out hover:bg-primary hover:text-white"
            >
              {item.name}
            </li>
          )
        })}
      </ul>
      {isLoginModalOpen && <Login onClose={handleCloseModal}></Login>}
    </div>
  )
}
