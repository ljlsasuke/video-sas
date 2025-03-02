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
        <svg
          className="h-full w-full scale-75 fill-primary transition duration-200 ease-in-out hover:scale-100"
          enableBackground="new 0 0 512 512"
          id="Layer_1"
          version="1.1"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              clipRule="evenodd"
              d="M117.583,354.544C135.5,392.5,169.713,401.446,200,407.5   c60.033,12,110.773,4.892,164.229-18.483c12.484-5.46,35.271-17.517,30.614-34.02c31.05,6.647,62.845,10.952,92.935,20.603   c29.926,9.592,32.771,31.09,4.915,46.082c-34.159,18.38-70.725,35.442-108.314,43.643   c-102.824,22.438-205.775,19.167-306.155-15.455c-21.39-7.38-42.35-17.732-61.24-30.162c-24.225-15.931-22.48-33.905,4.885-42.84   C52.813,366.77,85.428,361.8,117.583,354.544z"
              fillRule="evenodd"
            />
            <polygon
              clipRule="evenodd"
              fillRule="evenodd"
              points="249.443,300.77 194.583,294.26 189.373,338.145 244.228,344.657  "
            />
            <path
              clipRule="evenodd"
              d="M184.043,289.322l0.875-7.343l76.795,9.122l-0.885,7.473   c29.672,0,74.672-7.074,90.672-14.574c-16.735-55.149-35.967-115.685-53.151-172.325c26.439,12.92,48.904,23.9,74.1,36.215   c0.83-7.072-52.235-76.857-79.75-108.567c-3.655-4.22-11.36-6.853-17.22-6.895c-27.291-0.205-59.46,38.945-71.311,82.122   c-2.175,7.925-6.975,31.83-7.78,36.42c-3.23,18.44,33.145-2.762,43.38,10.73c-11.13,0-22.095-1.757-32.1,0.583   c-7.365,1.723-17.77,7.585-19.49,13.67c-9.99,35.4-19.47,70.953-28.57,106.595C167.693,285.18,175.823,287.504,184.043,289.322z"
              fillRule="evenodd"
            />
            <path
              clipRule="evenodd"
              d="M365.073,331.584C347.5,340.5,294,354.544,254.628,350.742l-0.735,6.188   l-76.795-9.118l0.445-3.76c-10.5-2.314-20.835-5.34-31.105-8.712c-0.795,3.252-3.815,6.719-2.395,9.742   C167.5,395,300,392.5,374.083,361.287C371.073,351.362,368.073,341.462,365.073,331.584z"
              fillRule="evenodd"
            />
          </g>
        </svg>
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
