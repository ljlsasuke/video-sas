import SasIcon from '@/components/SasIcon'
import { useEffect, useRef } from 'react'
import { Link, useParams } from 'umi'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export default function video() {
  const param = useParams()
  const videoRef = useRef(null)
  type Tag = {
    id: number
    name: string
  }
  let tags: Tag[] = []
  tags = [
    {
      id: 1,
      name: 'charmmy',
    },
    {
      id: 2,
      name: '梦境',
    },
    {
      id: 3,
      name: '茶米',
    },
    {
      id: 4,
      name: '夏日桃子',
    },
  ]
  useEffect(() => {
    if (videoRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        fluid: false,
        userActions: {
          hotkeys: true,
        },
      })

      return () => player.dispose()
    }
  }, [])

  return (
    <div className="flex h-full">
      {/* 左侧视频播放区域 */}
      <div className="h-svh min-h-[600px] min-w-[700px] flex-1 flex-col">
        <h1 className="mb-3 text-xl font-medium">
          难道天空在流眼泪吗？太阳温暖天边彩霞
        </h1>
        <h2>
          <div className="flex text-sm text-gray-400">
            <SasIcon name="play" className="h-5 w-5 fill-gray-400"></SasIcon>
            <span className="ml-1 mr-3">29万</span>
            <span>2024-08-06 14:49:25</span>
          </div>
        </h2>
        <div className="mb-3 h-4/5 w-full">
          <div data-vjs-player>
            <video
              ref={videoRef}
              className="video-js vjs-default-skin h-full w-full"
              controls
            >
              <source src={`/test/video${param.id}.mp4`} type="video/mp4" />
            </video>
          </div>
        </div>
        <div>
          {tags.map((tag) => (
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
              src="/fakerAvatar.png"
              className="h-12 w-12 rounded-full"
              alt="上传者头像"
            />
            <div>
              <h3 className="text-primary">里里</h3>
              <p className="text-sm text-gray-500">希望你也天天开心！</p>
            </div>
          </div>
        </div>

        {/* 推荐视频列表 */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div
              key={item}
              className="flex cursor-pointer space-x-3 rounded p-2 hover:bg-gray-100"
            >
              <div className="h-20 w-32 rounded bg-gray-300"></div>
              <div>
                <h4 className="line-clamp-2 font-medium">
                  推荐视频标题 {item}
                </h4>
                <p className="text-sm text-gray-500">播放量：{item * 1000}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
