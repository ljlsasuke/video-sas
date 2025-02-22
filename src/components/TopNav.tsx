import { useEffect, useState } from 'react'
export default function TopNav() {
  type ListItem = {
    id: number
    name: string
  }
  const [list, setList] = useState<ListItem[]>([])
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  useEffect(() => {
    let isLogin = false
    if (!isLogin) {
      setList([
        {
          id: 0,
          name: '登录',
        },
      ])
    } else {
      setList([
        {
          id: 1,
          name: '动态',
        },
        {
          id: 2,
          name: '你好',
        },
      ])
    }
  }, [])
  const handlerESC = (event: KeyboardEvent) => {
    console.log('event', event)
    if (event.code === 'Escape') {
      handleCloseModal()
    }
  }

  const onClickItem = (item: ListItem) => {
    if (item.name === '登录') {
      handleLoginClick()
    }
  }
  const handleLoginClick = () => {
    setIsLoginModalOpen(true)
    console.log('注册事件')
    window.addEventListener('keyup', handlerESC)
  }
  const handleCloseModal = () => {
    setIsLoginModalOpen(false)
    console.log('注销事件')
    window.removeEventListener('keyup', handlerESC)
  }
  return (
    <div className="flex justify-between items-center fixed  h-tn w-3/4 z-10">
      <div className="w-8 h-8 rounded-full bg-rose-400 hover:bg-primary cursor-pointer"></div>
      <div className="w-4/6 h-10">
        <input
          type="text"
          className="focus:outline-none w-4/6 h-10 rounded-full border border-gray-300 border-1 px-3 py-1 hover:border-gray-400 focus:border-primary focus:ring focus:ring-primary ring-opacity-50 transition duration-200 ease-in-out"
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
              className="cursor-pointer px-4 py-2 rounded-full text-primary hover:bg-primary hover:text-white transition duration-200 ease-in-out"
            >
              {item.name}
            </li>
          )
        })}
      </ul>
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md relative">
            <input
              type="text"
              placeholder="用户名"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <input
              type="password"
              placeholder="密码"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-around">
              <button
                className="w-1/3 bg-primary text-white p-2 rounded-md"
                onClick={handleCloseModal}
              >
                登录
              </button>
              <button
                className="w-1/3 bg-gray-300 text-gray-700 p-2 rounded-md"
                onClick={handleCloseModal}
              >
                注册
              </button>
            </div>
            <div
              className="absolute top-1 right-3 w-1 h-1 rounded-full cursor-pointer"
              onClick={handleCloseModal}
            >
              x
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
