import { ReactNode } from 'react'
import SasIcon from './SasIcon'

interface DialogProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  showFooterDivider?: boolean // 是否显示分割线属性
}

export default function Dialog({
  isOpen,
  title,
  onClose,
  children,
  footer,
  showFooterDivider = true, // 默认显示分割线
}: DialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="min-h-40 w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <SasIcon name="close" />
          </button>
        </div>
        <div
          className={showFooterDivider ? 'border-b border-gray-200 pb-4' : ''}
        >
          {children}
        </div>
        {footer && <div className="mt-4 flex justify-end">{footer}</div>}
      </div>
    </div>
  )
}
