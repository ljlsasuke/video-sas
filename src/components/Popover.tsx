import React, { ReactNode, useEffect, useRef, useState } from 'react'

// 创建一个全局事件总线，用于 Popover 之间的通信
const PopoverEventBus = {
  currentOpenPopoverId: null as string | null,
  listeners: new Set<(id: string | null) => void>(),

  // 设置当前打开的 Popover ID
  setCurrentOpen(id: string | null) {
    this.currentOpenPopoverId = id
    this.notifyListeners()
  },

  // 添加监听器
  addListener(listener: (id: string | null) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  },

  // 通知所有监听器
  notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.currentOpenPopoverId)
    }
  },
}

interface PopoverProps {
  content: ReactNode
  title?: ReactNode
  children: ReactNode
  trigger?: 'hover' | 'click' | 'focus'
  placement?: 'top' | 'left' | 'right' | 'bottom'
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  className?: string
  mouseLeaveDelay?: number // 添加鼠标移出延迟关闭时间
  id?: string // 添加唯一标识符
}

const Popover: React.FC<PopoverProps> = ({
  content,
  title,
  children,
  trigger = 'hover',
  placement = 'bottom',
  visible: propVisible,
  onVisibleChange,
  className: overlayClassName = '',
  mouseLeaveDelay = 100, //只在trigger为hover时有作用
  id = `popover-${Math.random().toString(36).slice(2, 9)}`, // 生成随机ID
}) => {
  const [visible, setVisible] = useState(propVisible || false)
  const [animationClass, setAnimationClass] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null) // 新增关闭延迟定时器

  // 监听其他 Popover 的打开事件
  useEffect(() => {
    const removeListener = PopoverEventBus.addListener((currentId) => {
      if (currentId !== id && visible) {
        // 如果另一个 Popover 打开，且当前 Popover 是可见的，则立即关闭当前 Popover
        handleVisibleChange(false, true)
      }
    })

    // 组件卸载时移除监听器
    return () => {
      removeListener()
    }
  }, [id]) // 只依赖 id，因为 visible 的检查在回调函数内部进行

  // 同步外部visible状态
  useEffect(() => {
    if (propVisible !== undefined) {
      setVisible(propVisible)
      setAnimationClass(
        propVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
      )
    }
  }, [propVisible])

  // 处理可见性变化
  const handleVisibleChange = (newVisible: boolean, immediate = false) => {
    // 清除现有的动画定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // 清除关闭延迟定时器
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (newVisible) {
      // 通知事件总线，当前 Popover 已打开
      PopoverEventBus.setCurrentOpen(id)

      // 先设置为初始状态（缩小和透明）
      setAnimationClass('opacity-0 scale-95')
      setVisible(true)
      // 使用 requestAnimationFrame 确保 DOM 更新后再添加动画类
      requestAnimationFrame(() => {
        // 再添加一个 requestAnimationFrame 确保初始状态已应用
        requestAnimationFrame(() => {
          setAnimationClass('opacity-100 scale-100')
        })
      })
    } else {
      // 如果当前 Popover 是打开的，通知事件总线它已关闭
      if (visible && PopoverEventBus.currentOpenPopoverId === id) {
        PopoverEventBus.setCurrentOpen(null)
      }

      // 隐藏时，如果不是立即执行，则添加延迟
      if (!immediate && trigger === 'hover') {
        closeTimerRef.current = setTimeout(() => {
          setAnimationClass('opacity-0 scale-95')
          timerRef.current = setTimeout(() => {
            setVisible(false)
          }, 200) // 与过渡时间匹配
        }, mouseLeaveDelay)
      } else {
        // 立即执行隐藏
        setAnimationClass('opacity-0 scale-95')
        timerRef.current = setTimeout(() => {
          setVisible(false)
        }, 200) // 与过渡时间匹配
      }
    }

    if (propVisible === undefined) {
      // 非受控模式（无 onVisibleChange）或半受控模式（有 onVisibleChange）
      if (newVisible !== visible) {
        onVisibleChange?.(newVisible)
      }
    } else {
      // 受控模式：仅在值变化时通知
      if (newVisible !== propVisible) {
        onVisibleChange?.(newVisible)
      }
    }
  }

  // 点击外部关闭
  useEffect(() => {
    if (trigger !== 'click') return
    const handleClickOutside = (event: MouseEvent) => {
      if (
        visible &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        handleVisibleChange(false, true) // 点击外部立即关闭
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [visible, trigger])

  // 处理ESC键关闭
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible) {
        handleVisibleChange(false, true) // ESC键立即关闭
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [visible])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  // 根据触发方式设置事件处理器
  const getTriggerProps = () => {
    switch (trigger) {
      case 'hover':
        return {
          onMouseEnter: () => {
            handleVisibleChange(true)
          },
          onMouseLeave: (e: React.MouseEvent) => {
            // 检查鼠标是否移动到了内容区域
            const toElement = e.relatedTarget as Node
            if (contentRef.current && contentRef.current.contains(toElement)) {
              return // 如果移动到内容区域，不关闭
            }
            handleVisibleChange(false) // 使用延迟关闭
          },
        }
      case 'click':
        return {
          onClick: () => handleVisibleChange(!visible),
        }
      case 'focus':
        return {
          onFocus: () => handleVisibleChange(true),
          onBlur: () => handleVisibleChange(false, true), // 失焦立即关闭
        }
      default:
        return {}
    }
  }

  // 为内容区域添加鼠标事件处理
  const getContentProps = () => {
    if (trigger === 'hover') {
      return {
        onMouseEnter: () => {
          // 鼠标进入内容区域时，取消任何关闭定时器
          if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current)
            closeTimerRef.current = null
          }
          if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
          }
        },
        onMouseLeave: (e: React.MouseEvent) => {
          // 检查鼠标是否移动到了触发区域
          const toElement = e.relatedTarget as Node
          if (
            containerRef.current &&
            containerRef.current.contains(toElement)
          ) {
            return // 如果移动到触发区域，不关闭
          }
          handleVisibleChange(false) // 使用延迟关闭
        },
      }
    }
    return {}
  }

  // 根据位置设置样式
  const getPlacementStyle = () => {
    switch (placement) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-1'
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-1'
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-1'
      case 'bottom':
      default:
        return 'top-full left-1/2 -translate-x-1/2 mt-1'
    }
  }

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div {...getTriggerProps()}>{children}</div>
      {visible && (
        <div
          ref={contentRef}
          {...getContentProps()}
          className={`absolute z-50 w-fit min-w-[200px] transform rounded-lg bg-white p-3 shadow-lg transition-all duration-200 ease-in-out ${getPlacementStyle()} ${animationClass} ${overlayClassName}`}
        >
          {title && (
            <div className="mb-2 border-b border-gray-100 pb-2 text-center font-bold">
              {title}
            </div>
          )}
          <div>{content}</div>
        </div>
      )}
    </div>
  )
}

export default Popover
