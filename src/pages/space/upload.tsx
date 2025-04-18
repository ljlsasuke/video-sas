import Dialog from '@/components/Dialog'
import message from '@/components/Message'
import Popover from '@/components/Popover'
import SasIcon from '@/components/SasIcon'
import { TagInput } from '@/components/TagInput'
import { Upload as UP } from '@/components/Upload'
import {
  createNewVideo,
  deleteVideo as deleteVideoApi,
  getVideoIsUserCreate,
  uploadCover,
  uploadVideo,
} from '@/services'
import type { NewVideoDataT, VideoItem } from '@/type'
import { formatDate, FormatType } from '@/utils/format'
import { useEffect, useState } from 'react'
import { history, useOutletContext } from 'umi'
export default function Upload() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [videoTitle, setVideoTitle] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [tagList, setTagList] = useState<string[]>([])
  const { userId, isCurrentUser } = useOutletContext<{
    userId: string
    isCurrentUser: boolean
  }>()
  const [uploadVideoList, setUploadVideoList] = useState<VideoItem[]>([])
  const fetchVideoList = () => {
    return getVideoIsUserCreate(Number(userId)).then((data) => {
      setUploadVideoList(data.results)
    })
  }
  const deleteVideo = async (bv: string) => {
    return deleteVideoApi(bv)
      .then(() => {
        message.success('删除成功！')
        return fetchVideoList()
      })
      .catch((err) => {
        message.error(err)
      })
  }
  const videoOptItems = [
    {
      opt: '编辑视频',
      callback: (bv: string) => {
        alert('编辑视频' + bv)
      },
    },
    {
      opt: '删除视频',
      callback: (bv: string) => {
        deleteVideo(bv)
      },
    },
  ]
  useEffect(() => {
    fetchVideoList()
  }, [])
  // 本来准备只有点击取消按钮才会清空输入状态，直接点击 x 关闭Dialog不会清空的
  // 但是发现 目前的upload组件无法回归原来的状态（因为我们只拿到了File,没有previewUrl ）
  // 所以这个功能以后再说
  const onCloseDialog = () => {
    setIsDialogOpen(false)
    // 关闭时清空所有状态
    setVideoTitle('')
    setCoverFile(null)
    setVideoFile(null)
    setTagList([]) // 清空标签列表
  }

  const NewVideoData: NewVideoDataT = {
    filePath: '',
    cover: '',
    description: '',
    tags: [],
  }
  const checkBeforeNewVideo = async () => {
    if (!videoTitle.trim()) {
      message.error('视频标题不能为空！')
      return false
    }
    if (!tagList.length) {
      message.error('至少给出一个标签')
      return false
    }
    if (!coverFile) {
      message.error('必须上传视频封面！')
      return false
    }
    if (!videoFile) {
      message.error('必须上传视频文件！')
      return false
    }
    NewVideoData.description = videoTitle
    NewVideoData.tags = tagList
    return uploadCover(coverFile)
      .then(({ url }) => {
        NewVideoData.cover = url
        message.success('封面上传成功！')
        return uploadVideo(videoFile)
      })
      .then(({ url }) => {
        NewVideoData.filePath = url
        message.success('视频上传成功！')
        return true
      })
      .catch((err) => {
        message.error(err)
        return false
      })
  }

  const onConfirm = async () => {
    let checked = await checkBeforeNewVideo()
    if (!checked) return
    createNewVideo(NewVideoData)
      .then((newVideo) => {
        console.log(newVideo)
        message.success('视频投稿成功！')
        // 由于后面要做分页所以这里用重新请求，不然可以手动把返回的 newVideo 插入到列表中
        return fetchVideoList()
      })
      .catch((err) => {
        message.error(err)
      })
      .finally(() => {
        onCloseDialog()
      })
  }

  const handleCoverSelected = (file: File) => {
    console.log('Cover selected:', file.name)
    if (!['image/jpeg'].includes(file.type)) {
      setCoverFile(null)
      return { allow: false, message: '封面仅支持 JPG 或 PNG 格式！' }
    }
    setCoverFile(file)
    return { allow: true }
  }

  const handleVideoSelected = (file: File) => {
    console.log('Video selected:', file.name)
    if (file.type !== 'video/mp4') {
      setVideoFile(null)
      return { allow: false, message: '视频仅支持 MP4 格式！' }
    }
    setVideoFile(file)
    return { allow: true }
  }
  return (
    <div>
      <header className="flex gap-3">
        <div className="h-28 w-48 overflow-hidden rounded-md">
          <img
            className="h-full w-full object-cover"
            src={uploadVideoList[0]?.cover ?? '/fakerImg.jpg'}
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-xl">投稿列表</h1>
            <div className="text-sm text-gray-400">视频数：{50}</div>
          </div>
          <div className="mt-2 flex gap-3 text-sm">
            {isCurrentUser && (
              <button
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center rounded-md bg-primary px-4 py-2 text-white focus:outline-none"
              >
                <SasIcon name="plus" className="font-bold"></SasIcon>
                <span>投稿新视频</span>
              </button>
            )}
            <button className="rounded-lg border border-[#e3e5e7] px-5 py-1 transition-colors hover:bg-[#e3e5e7]">
              分享
            </button>
          </div>
        </div>
        <Dialog
          isOpen={isDialogOpen}
          title="投稿新视频"
          onClose={onCloseDialog}
          footer={
            <>
              <button
                onClick={onCloseDialog}
                className="mr-2 rounded px-4 py-2 text-gray-600"
              >
                取消
              </button>
              <button
                onClick={onConfirm}
                className="rounded bg-primary px-4 py-2 text-white"
              >
                确认
              </button>
            </>
          }
        >
          <div className="mb-4">
            <label
              htmlFor="videoTitle"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              编辑视频标题
            </label>
            <input
              type="text"
              id="videoTitle"
              name="videoTitle"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="请输入视频标题"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              添加视频标签
            </label>
            <TagInput
              tags={tagList}
              onChange={setTagList} // 直接传递 setState 函数
              placeholder="输入标签后按 Enter 添加..."
              maxTags={5} // 示例：最多允许 5 个标签
            />
            <p className="mt-1 text-xs text-gray-500">
              最多可添加 {5} 个标签。请至少添加 1 个标签
            </p>{' '}
          </div>

          <div className="mb-4">
            <h1 className="mb-1 block text-sm font-medium text-gray-700">
              挑选视频封面
            </h1>
            <UP type="cover" onFileSelected={handleCoverSelected} />
          </div>

          <div className="mb-4">
            <h1 className="mb-1 block text-sm font-medium text-gray-700">
              上传视频文件
            </h1>
            <UP
              type="video"
              onFileSelected={handleVideoSelected}
              maxSize={200}
            />
          </div>
        </Dialog>
      </header>
      <div className="my-3 h-[0.5px] bg-[#e3e5e7]"></div>
      {/* 下面是一个投稿视频的列表 */}
      <div>
        <ul className="flex flex-wrap gap-4">
          {uploadVideoList.map((video) => (
            <li key={video.url} className="flex w-48 flex-col">
              <div
                onClick={() => history.push(`/video/${video.url}`)}
                className="h-28 cursor-pointer overflow-hidden rounded-lg"
              >
                <img
                  className="h-full w-full object-cover"
                  src={video.cover}
                  alt=""
                />
              </div>
              <div className="mt-2 flex h-8 justify-between">
                <p className="line-clamp-2 cursor-pointer text-sm leading-4 hover:text-primary">
                  {video.description}
                </p>
                {isCurrentUser && (
                  <div className="cursor-pointer text-[#61666d]">
                    <Popover
                      className="min-w-32 px-0"
                      content={
                        <>
                          <ul className="w-32 py-1">
                            {videoOptItems.map((item, index) => (
                              <li
                                key={index}
                                onClick={() => item.callback(video.url)}
                                className="cursor-pointer hover:bg-[#f6f7f8]"
                              >
                                <p className="py-2 text-center text-base">
                                  {item.opt}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </>
                      }
                    >
                      <SasIcon name="more"></SasIcon>
                    </Popover>
                  </div>
                )}
              </div>

              <div
                onClick={() => history.push(`/space/${video.author.id}`)}
                className="mt-1 flex cursor-pointer items-center text-xs text-gray-500 hover:text-primary"
              >
                <SasIcon name="up"></SasIcon>
                <span>{video.author.username}</span>
                <span className="mx-1">·</span>
                <span>
                  上传于 {formatDate(video.uploadTime, FormatType.later)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
