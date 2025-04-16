import useCollections from '@/hooks/useCollections'
import { useState } from 'react'
export default function Collection() {
  const [pageNo, setPageNo] = useState(1)
  const { isLoading, isError, data } = useCollections(pageNo)
  console.log(data, '???')
  return (
    <div>
      <header onClick={() => setPageNo((pageNo) => pageNo + 1)}>
        收藏的Header{pageNo}
      </header>
      <div>
        <ul>
          <li></li>
        </ul>
        {/* 这里放一个分页组件 */}
      </div>
    </div>
  )
}
