import React, { KeyboardEvent, useState } from 'react'
import SasIcon from './SasIcon'

interface TagInputProps {
  tags: string[]
  onChange: (newTags: string[]) => void
  placeholder?: string
  maxTags?: number
}

export function TagInput({
  tags,
  onChange,
  placeholder = '添加标签...',
  maxTags,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault() // 防止表单提交（如果在一个 form 内部）
      addTag(inputValue.trim())
    }
    // 允许使用 Backspace 删除最后一个标签（如果输入框为空）
    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  const addTag = (tagToAdd: string) => {
    if (maxTags && tags.length >= maxTags) {
      console.warn(`最多只能添加 ${maxTags} 个标签`)
      return
    }
    if (!tags.includes(tagToAdd)) {
      onChange([...tags, tagToAdd])
      setInputValue('')
    } else {
      console.warn(`标签 "${tagToAdd}" 已存在`)
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="flex flex-wrap items-center rounded-md border border-gray-300 p-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
      {tags.map((tag) => (
        <span
          key={tag}
          className="mb-1 mr-2 flex items-center rounded bg-indigo-100 px-2 py-1 text-sm font-medium text-indigo-700"
        >
          {tag}
          <button
            type="button" // 防止触发表单提交
            onClick={() => removeTag(tag)}
            className="ml-1 flex-shrink-0 rounded-full p-0.5 text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label={`移除 ${tag}`}
          >
            <SasIcon name="close" className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''} // 仅在没有标签时显示 placeholder
        className="flex-grow border-none p-1 text-sm focus:outline-none focus:ring-0" // 基础样式，无边框，自动伸缩
        disabled={maxTags !== undefined && tags.length >= maxTags} // 达到最大数量时禁用输入
      />
    </div>
  )
}
