import { ChangeEvent, useRef, useState } from 'react'

type UploadType = 'avatar' | 'cover' | 'video'

interface UploadComponentProps {
  type: UploadType
  value?: string
  onFileSelected?: (file: File) => { allow: boolean; message?: string }
  maxSize?: number
}
/**
 *  目前这个上传组件本身只关注 文件的选择和预览，并且通过回调的方式让外部拿到当前选中的文件
 *  我们自己去把文件传给后端并处理后续操作
 *  并不是常规的组件自己上传，外部只传递参数和回调的组件
 *  并且业务场景只有三种 头像，封面，视频，只支持单文件上传
 *  和本项目高度耦合，可扩展性差
 */
export const Upload = ({
  type,
  value,
  onFileSelected,
  maxSize,
}: UploadComponentProps) => {
  const [previewUrl, setPreviewUrl] = useState(value || '')
  const [error, setError] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const accept = {
    avatar: 'image/png,image/jpeg,image/jpg',
    cover: 'image/jpeg',
    video: 'video/mp4',
  }[type]

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setError('') // 清空以前的错误信息
    const file = e.target.files?.[0]
    if (!file) return

    if (maxSize && file.size > maxSize * 1024 * 1024) {
      setError(`文件大小不能超过 ${maxSize}MB!`)
      return
    }
    if (onFileSelected) {
      const checkRes = onFileSelected(file)
      if (!checkRes.allow) {
        setError(checkRes.message || '非法上传！')
        return
      }
    }
    // 设置预览
    if (type !== 'video') {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
    setFiles([file])
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />

      <div
        className="cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {type === 'video' ? (
          <div className="flex flex-col items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:border-blue-500">
            <div className="text-gray-400">
              <svg className="h-8 w-8" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12v6l5-3-5-3z"
                />
              </svg>
            </div>
            <span className="mt-2 text-gray-500">点击上传视频</span>
            {files.length > 0 && (
              <div className="mt-3 w-full rounded bg-gray-100 p-2">
                {files.map((file, index) => (
                  <div key={index} className="p-1 text-sm text-gray-600">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 transition-colors duration-300 hover:border-blue-500 ${
              type === 'avatar'
                ? 'h-24 w-24 overflow-hidden rounded-full'
                : 'h-[180px] w-[320px] overflow-hidden rounded-lg'
            }`}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                className={`h-full w-full object-cover ${
                  type === 'avatar' ? 'rounded-full' : 'rounded-lg'
                }`}
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <svg className="h-8 w-8" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"
                  />
                </svg>
                <span className="mt-2 text-sm">点击上传</span>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  )
}
