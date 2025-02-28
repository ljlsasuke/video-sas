import message from '@/components/Message'
import { useAuth } from '@/contexts/AuthContext'
import { login } from '@/services/api'
import pubsub from '@/utils/pubsub'
import { useState } from 'react'
interface LoginProps {
  onClose: () => void
}
export default function Login({ onClose }: LoginProps) {
  const { setAuthState } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const onLogin = async () => {
    login({
      username,
      password,
    })
      .then(({ code, message: messageInfo, data }) => {
        if (code !== 200) return Promise.reject(messageInfo)
        setAuthState(data.token, data.userInfo)
        message.success(messageInfo)
        pubsub.publish('LOGIN_SUCCESS')
      })
      .catch((err) => {
        message.error(err)
      })
      .finally(() => {
        onClose()
      })
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
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
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <input
            value={username}
            onChange={(e) => setUsername((e.target as HTMLInputElement).value)}
            type="text"
            placeholder="请输入账号"
            className="mb-4 h-10 w-full rounded-md border border-gray-300 px-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <input
            value={password}
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
            type="password"
            placeholder="请输入密码"
            className="mb-4 h-10 w-full rounded-md border border-gray-300 px-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
          />

          <div className="mb-4 flex justify-between">
            <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
              忘记密码？
            </a>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
              立即注册
            </a>
          </div>
          <div className="flex gap-4">
            <button className="h-10 w-full rounded-md border border-gray-400 text-black">
              注册
            </button>
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
  )
}
