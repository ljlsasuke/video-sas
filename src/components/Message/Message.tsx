import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export type MessageType = 'success' | 'error' | 'info' | 'warning'

interface MessageProps {
  id: string // 添加唯一ID
  type?: MessageType
  content: string
  duration?: number
  onClose: (id: string) => void // 修改为接收ID的关闭函数
  top?: number // 添加top属性控制消息位置
}

export default function Message({
  id,
  type = 'info',
  content,
  duration = 3000,
  onClose,
  top = 12,
}: MessageProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 组件挂载后立即显示
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
    let closeTimer: NodeJS.Timeout
    const timer = setTimeout(() => {
      // 先触发淡出动画
      setIsVisible(false)
      // 等待动画结束后关闭
      closeTimer = setTimeout(() => onClose(id), 300)
    }, duration)

    return () => {
      clearTimeout(timer)
      clearTimeout(closeTimer)
    }
  }, [duration, onClose, id])

  const getIconByType = (type: MessageType) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      default:
        return 'ℹ'
    }
  }

  const getColorByType = (type: MessageType) => {
    switch (type) {
      case 'success':
        return 'text-primary'
      case 'error':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-500'
      default:
        return 'text-blue-500'
    }
  }

  return createPortal(
    <div
      className={`fixed left-1/2 -translate-x-1/2 transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}
      style={{ top: `${top}px` }} // 使用动态top值
    >
      <div
        className={`flex items-center rounded-lg bg-white px-4 py-2 shadow-lg ${getColorByType(
          type,
        )}`}
      >
        <span className="mr-2">{getIconByType(type)}</span>
        <span>{content}</span>
      </div>
    </div>,
    document.body,
  )
}