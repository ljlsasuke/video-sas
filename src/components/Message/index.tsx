import { createRoot, type Root } from 'react-dom/client'
import Message, { MessageType } from './Message'

// 消息容器和Root
let messageContainer: HTMLDivElement | null = null
let root: Root | null = null

// 消息队列和配置
interface MessageItem {
  id: string
  content: string
  type: MessageType
  duration: number
}

// 消息队列
const messageQueue: MessageItem[] = []
// 消息间距
const MESSAGE_GAP = 16
// 基础高度
const BASE_TOP = 48

// 生成唯一ID
const generateId = (): string => {
  return `message-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

// 计算消息位置
const calculatePosition = (index: number): number => {
  return BASE_TOP + index * (48 + MESSAGE_GAP) // 48px是消息大致高度
}

// 处理关闭单个消息
const handleClose = (id: string) => {
  // 从队列中移除消息
  const index = messageQueue.findIndex((item) => item.id === id)
  if (index !== -1) {
    messageQueue.splice(index, 1)
    // 重新渲染队列
    renderMessageQueue()
  }

  // 如果队列为空，清理DOM
  if (messageQueue.length === 0 && root && messageContainer) {
    root.unmount()
    document.body.removeChild(messageContainer)
    messageContainer = null
    root = null
  }
}

// 渲染消息队列
const renderMessageQueue = () => {
  if (!root) return

  root.render(
    <>
      {messageQueue.map((msg, index) => (
        <Message
          key={msg.id}
          id={msg.id}
          content={msg.content}
          type={msg.type}
          duration={msg.duration}
          onClose={handleClose}
          top={calculatePosition(index)}
        />
      ))}
    </>,
  )
}

// 显示消息
const show = (
  content: string,
  type: MessageType = 'info',
  duration: number = 3000,
) => {
  // 创建消息容器（如果不存在）
  if (!messageContainer) {
    messageContainer = document.createElement('div')
    document.body.appendChild(messageContainer)
    root = createRoot(messageContainer)
  }

  // 创建新消息并添加到队列
  const id = generateId()
  messageQueue.push({ id, content, type, duration })

  // 渲染队列
  renderMessageQueue()
}

// 导出的消息API
const message = {
  success: (content: string, duration?: number) => {
    show(content, 'success', duration)
  },
  error: (content: string, duration?: number) => {
    show(content, 'error', duration)
  },
  warning: (content: string, duration?: number) => {
    show(content, 'warning', duration)
  },
  info: (content: string, duration?: number) => {
    show(content, 'info', duration)
  },
}

export default message
