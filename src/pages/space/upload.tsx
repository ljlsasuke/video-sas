import SasIcon from '@/components/SasIcon'
export default function Upload() {
  return (
    <div>
      <header>
        <button className="flex items-center rounded-md bg-primary px-2 py-1 text-white">
          <SasIcon name="plus" className="font-bold"></SasIcon>
          <span>投稿新视频</span>
        </button>
      </header>
      <div></div>
    </div>
  )
}
