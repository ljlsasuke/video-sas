import message from '@/components/Message'
import { login } from '@/services'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
// import Dialog from '../Dialog' // 不再需要直接使用 Dialog
import SasIcon from '../SasIcon'
import Register from './Register' // 引入 Register 组件

interface LoginProps {
  isOpen: boolean // 添加 isOpen 属性来控制登录弹窗自身
  onClose: () => void
}
export default function Login({ isOpen, onClose }: LoginProps) { // 接收 isOpen
  const setAuthState = useAuthStore((state) => state.setAuthState)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRegisterOpen, setIsRegisterOpen] = useState(false) // 控制注册弹窗的状态

  const onLogin = async () => {
    login({
      username,
      password,
    })
      .then((data) => {
        setAuthState(data)
        message.success('登录成功,' + data.userInfo.username)
        onClose() // 登录成功后关闭登录弹窗
      })
      .catch((err: string) => {
        message.error(err)
      })
      // .finally(() => { // 不再需要在 finally 中关闭，因为成功或失败后都会处理
      //   onClose()
      // })
  }

  const handleOpenRegister = () => {
    onClose() // 先关闭登录弹窗
    setIsRegisterOpen(true) // 再打开注册弹窗
  }

  const handleCloseRegister = () => {
    setIsRegisterOpen(false)
    // 注意：这里不需要重新打开登录弹窗，除非有特定需求
    // 如果需要返回登录，Register 组件内部会处理
  }

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false); // 关闭注册弹窗
    // 这里可以根据需要决定是否重新打开登录弹窗，
    // 但通常用户是从登录弹窗过去的，关闭注册弹窗即可
    // 如果 Login 组件是由 TopNav 控制的，TopNav 需要重新打开它
    // 如果 Login 组件是独立的，可能需要调用一个 showLogin() 之类的函数
    // 暂时保持关闭注册弹窗即可
  }


  if (!isOpen && !isRegisterOpen) return null // 如果两个弹窗都没打开，则不渲染

  // 如果注册弹窗打开，则只渲染注册弹窗
  if (isRegisterOpen) {
    return <Register isOpen={isRegisterOpen} onClose={handleCloseRegister} onSwitchToLogin={handleSwitchToLogin} />
  }

  // 否则渲染登录弹窗
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"> {/* 添加 z-index */}
        <div className="flex h-[30vh] min-h-[381px] w-[30vw] min-w-[768px] rounded-lg bg-white">
          {/* 左侧图片区域 */}
          <div className="flex w-[35%] flex-col items-center justify-center border-r border-gray-200">
            <div className="min-w[200px] min-h-[200px] rounded-lg bg-gray-100">
              <img
                src="https://img.88icon.com/upload/jpg/20210525/ba7350953abe0316035e313e1854db46_20397_800_505.jpg"
                alt=""
              />
            </div>
          </div>

          {/* 右侧密码登录区域 */}
          <div className="flex flex-1 flex-col px-8 py-8 md:px-12">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-medium">密码登录</h2>
              <div onClick={onClose} className="cursor-pointer"> {/* 使用传入的 onClose */}
                <SasIcon name="close" width={24} height={24}></SasIcon>
              </div>
            </div>

            <input
              value={username}
              onChange={(e) =>
                setUsername((e.target as HTMLInputElement).value)
              }
              type="text"
              placeholder="请输入账号"
              className="mb-4 h-10 w-full rounded-md border border-gray-300 px-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <input
              value={password}
              onChange={(e) =>
                setPassword((e.target as HTMLInputElement).value)
              }
              onKeyUp={(e) => e.key === 'Enter' && onLogin()}
              type="password"
              placeholder="请输入密码"
              className="mb-4 h-10 w-full rounded-md border border-gray-300 px-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            />

            <div className="mb-4 flex justify-end"> {/* 修改为 justify-end */}
              <a
                href="javascript:void(0);"
                onClick={handleOpenRegister} // 修改点击事件
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                没有账号？立即注册
              </a>
            </div>
            <div className="flex gap-4">
              <button
                onClick={onLogin}
                className="h-10 w-full rounded-md bg-primary text-white transition-all hover:bg-primary/90"
              >
                登录
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 不再需要这里的 Dialog */}
      {/* <Register isOpen={isRegisterOpen} onClose={handleCloseRegister} /> */}
    </>
  )
}
