import React, { useState } from 'react'

interface PaginationProps {
  current?: number
  defaultCurrent?: number
  total: number
  pageSize: number
  defaultPageSize?: number
  onChange?: (page: number, pageSize: number) => void
  maxPagesToShow?: number
  showTotal?: boolean
  showNumberJump?: boolean
}

const Pagination: React.FC<PaginationProps> = ({
  current,
  defaultCurrent = 1,
  total,
  pageSize,
  onChange,
  maxPagesToShow = 5,
  showTotal = false,
  showNumberJump = false,
}) => {
  const [internalCurrent, setInternalCurrent] = useState(defaultCurrent)
  const [jumpPage, setJumpPage] = useState('')

  // 使用受控值或内部状态
  const actualCurrent = current ?? internalCurrent
  const totalPages = Math.ceil(total / pageSize)

  const handlePageChange = (page: number) => {
    if (!current) {
      setInternalCurrent(page)
    }
    onChange?.(page, pageSize)
  }

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber)
    }
  }

  // 生成要显示的页码数组
  const getPagesToShow = () => {
    let startPage = Math.max(1, actualCurrent - Math.floor(maxPagesToShow / 2))
    let endPage = startPage + maxPagesToShow - 1

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    )
  }

  const handleJumpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJumpPage(e.target.value)
  }

  const handleJump = () => {
    const page = parseInt(jumpPage)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      paginate(page)
    }
    setJumpPage('')
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {actualCurrent !== 1 && (
        <button
          className="rounded border px-3 py-1 hover:bg-gray-100"
          onClick={() => paginate(actualCurrent - 1)}
        >
          上一页
        </button>
      )}

      {getPagesToShow().map((page) => (
        <button
          key={page}
          onClick={() => paginate(page)}
          className={`rounded border px-3 py-1 ${
            page === actualCurrent
              ? 'bg-primary text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}

      {actualCurrent !== totalPages && (
        <button
          className="rounded border px-3 py-1 hover:bg-gray-100"
          onClick={() => paginate(actualCurrent + 1)}
        >
          下一页
        </button>
      )}
      {showTotal && (
        <span className="ml-4">
          共 {totalPages} 页 / {total} 个
        </span>
      )}
      {showNumberJump && (
        <div>
          <span className="ml-4 mr-2">跳至</span>
          <input
            type="text"
            value={jumpPage}
            onChange={handleJumpChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleJump()
              }
            }}
            className="h-8 w-16 rounded border border-gray-300 px-1 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          <span>页</span>
        </div>
      )}
    </div>
  )
}

export default Pagination
