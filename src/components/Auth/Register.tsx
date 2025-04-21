import message from '@/components/Message'
import { TagInput } from '@/components/TagInput'
import { register } from '@/services'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
import Dialog from '../Dialog'

interface RegisterProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export default function Register({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterProps) {
  const setAuthState = useAuthStore((state) => state.setAuthState)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [description, setDescription] = useState('') // 1. 添加 description 状态
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleTagsChange = (newTags: string[]) => {
    setSelectedTags(newTags)
  }


  const onRegister = async () => {
    if (password !== confirmPassword) {
      message.error('两次输入的密码不一致！')
      return
    }
    if (!username || !password) {
      message.error('用户名和密码不能为空！')
      return
    }
    // 2. 在调用 register 服务时加入 description
    register({
      username,
      password,
      description, // 添加 description
      tags: selectedTags,
    })
      .then((data) => {
        setAuthState(data)
        message.success(
          '注册成功, ' + data.userInfo.username + ', 已自动为您登录',
        )
        onClose()
      })
      .catch((err: string) => {
        message.error(err)
      })
  }

  if (!isOpen) return null

  return (
    <Dialog isOpen={isOpen} title="注册新用户" onClose={onClose}>
      <div className="flex flex-col gap-4 p-4">
        {/* ... 用户名、密码、确认密码输入框保持不变 ... */}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="请输入用户名"
          className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="请输入密码"
          className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          // 移除这里的 onKeyUp，避免在标签输入时意外触发注册
          // onKeyUp={(e) => e.key === 'Enter' && onRegister()}
          type="password"
          placeholder="请再次确认密码"
          className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
        />

        {/* 3. 添加用户简介输入框 */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="简单介绍一下自己吧（可选）"
          rows={3} // 可以调整行数
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
        />

        {/* TagInput 组件保持不变 */}
        <TagInput
          tags={selectedTags}
          onChange={handleTagsChange}
          placeholder="输入你感兴趣的标签（可选）"
        />

        {/* 注册按钮和返回登录链接保持不变 */}
        <button
          onClick={onRegister}
          className="h-10 w-full rounded-md bg-primary text-white transition-all hover:bg-primary/90"
        >
          注册
        </button>
        {/* ... 返回登录链接保持不变 ... */}
        <div className="mt-2 text-center">
          <a
            href="javascript:void(0);"
            onClick={onSwitchToLogin} // 点击切换回登录
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            已有账号？返回登录
          </a>
        </div>
      </div>
    </Dialog>
  )
}
