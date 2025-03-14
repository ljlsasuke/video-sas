import message from '@/components/Message'
import SasIcon from '@/components/SasIcon'
import { getVideoDetail, toggleCollection } from '@/services'
import { useAuthStore } from '@/store/authStore'
import type { VideoDetail } from '@/type'
import { produce } from 'immer'
import { useEffect, useRef, useState } from 'react'
import { history, Link, useParams } from 'umi'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export default function video() {
  const param = useParams()
  const { bv } = param
  const videoRef = useRef(null)
  const playerRef = useRef<any>(null) // 添加 player 的引用
  const [videoDetail, setVideoDetail] = useState<VideoDetail>()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const fetchVideoDetail = () => {
    if (!bv) return message.error('未传入BV号！')
    getVideoDetail(bv)
      .then((data) => {
        setVideoDetail(data)
      })
      .catch((err) => {
        message.error(err)
      })
  }
  useEffect(() => {
    fetchVideoDetail()
  }, [bv, isLoggedIn])
  useEffect(() => {
    if (videoRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        fluid: false,
        userActions: {
          hotkeys: true,
        },
      })
      /**
       * videoRef.current 原生的Video标签
       * player/playerRef.current videojs创建的一个播放器实例
       * playerElement 播放器实例对应的DOM元素
       */
      player.ready(() => {
        const playerElement = player.el() as HTMLElement
        if (playerElement) {
          playerElement.focus()
        }
      })
      playerRef.current = player // 保存 player 实例到 playerRef
      return () => player.dispose()
    }
  }, [])
  // 监听 videoDetail 变化，更新视频源
  useEffect(() => {
    if (playerRef.current && videoDetail?.filePath) {
      playerRef.current.src({ src: videoDetail.filePath, type: 'video/mp4' })
      playerRef.current.el().focus()
    }
  }, [videoDetail?.filePath])
  const onCollect = async () => {
    if (videoDetail?.isCollected === undefined) return
    try {
      await toggleCollection(videoDetail.url, videoDetail.isCollected)
      message.success(videoDetail.isCollected ? '取消收藏成功' : '收藏成功')
      setVideoDetail(
        produce(videoDetail, (draft) => {
          draft.isCollected = !draft.isCollected
        }),
      )
    } catch (error) {
      message.error(String(error))
    }
  }
  return (
    <div className="flex h-full">
      {/* 左侧视频播放区域 */}
      <div className="h-svh min-h-[600px] min-w-[700px] flex-1 flex-col">
        <div className="mb-5">
          <h1 className="mb-3 text-xl font-medium">
            {videoDetail?.description}
          </h1>
          <h2>
            <div className="flex text-sm text-gray-400">
              <SasIcon name="play" className="h-5 w-5 fill-gray-400"></SasIcon>
              <span className="ml-1 mr-3">{videoDetail?.playCount}</span>
              <span>{videoDetail?.uploadTime}</span>
            </div>
          </h2>
        </div>
        <div className="mb-3 h-4/5 w-full">
          <div data-vjs-player>
            <video
              ref={videoRef}
              className="video-js vjs-default-skin h-full w-full"
              controls
            ></video>
          </div>
        </div>
        {/* 功能列表，添加到收藏，稍后再看之类的 */}
        <ul>
          <li className="cursor-pointer" onClick={onCollect}>
            <SasIcon
              name="star-filled"
              width={26}
              height={26}
              className={
                videoDetail?.isCollected
                  ? 'text-primary'
                  : 'text-[#61666d] hover:text-primary'
              }
            ></SasIcon>
          </li>
        </ul>
        <div>
          {videoDetail?.tags.map((tag) => (
            <Link
              key={tag.id}
              to={`/search?tag=${tag.name}`}
              className="mr-1 inline-block cursor-pointer rounded-lg border border-gray-300 px-2 py-1 text-base font-normal text-primary hover:bg-primary hover:text-white"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 右侧信息区域 */}
      <div className="flex w-1/3 min-w-[300px] flex-shrink-0 flex-col border-l">
        {/* 上传者信息 */}
        <div className="border-b p-4">
          <div className="flex items-center space-x-3">
            <img
              src={videoDetail?.author.avatar}
              className="h-12 w-12 rounded-full"
              alt="上传者头像"
            />
            <div>
              <h3 className="text-primary">{videoDetail?.author.username}</h3>
              <p className="text-sm text-gray-500">
                {videoDetail?.author.description}
              </p>
            </div>
          </div>
        </div>

        {/* 推荐视频列表 */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {videoDetail?.recommended.map((item, index) => (
            <div
              onClick={() => history.push(`${item.url}`)}
              key={`${item.url}-${index}`}
              className="flex cursor-pointer space-x-3 rounded p-2 hover:bg-gray-100"
            >
              <div className="h-20 w-32 overflow-hidden rounded bg-gray-300">
                <img
                  src={item.cover}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="mb-2 line-clamp-2 font-medium">
                  {item.description}
                </h4>
                <div className="mb-2 flex text-gray-500">
                  <SasIcon name="up"></SasIcon>
                  <p className="ml-1 text-sm">{item.author.username}</p>
                </div>
                <div className="flex text-gray-500">
                  <SasIcon name="play"></SasIcon>
                  <p className="ml-1 text-sm">{item.playCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
