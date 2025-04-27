import Pagination from '@/components/Pagination'
import SasIcon from '@/components/SasIcon'
import { keywordSearch, tagSearch } from '@/services'
import type { VideoItem } from '@/type'
import { formatDate, FormatType } from '@/utils/format'
import { useEffect, useState } from 'react'
import { history, useSearchParams } from 'umi'
export default function search() {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword')
  const tag = searchParams.get('tag')
  const [videoList, setVideoList] = useState<VideoItem[]>([])
  const [pageNo, setPageNo] = useState(1)
  const [total, setTotal] = useState(0)
  const defaultPageSize = 12
  const getSearchResultByTag = async (tagName: string, pageNo: number) => {
    return tagSearch(tagName, pageNo, defaultPageSize).then((res) => {
      setPageNo(res.page)
      setTotal(res.total)
      setVideoList(res.results)
    })
  }
  const getSearchResultByKeyword = async (keyword: string, pageNo: number) => {
    return keywordSearch(keyword, pageNo, defaultPageSize).then((res) => {
      setPageNo(res.page)
      setTotal(res.total)
      setVideoList(res.results)
    })
  }
  const fetchSearchResult = async (
    tagName: string | null,
    keyword: string | null,
    pageNo: number,
  ) => {
    if (tagName) {
      getSearchResultByTag(tagName, pageNo)
    } else if (keyword && keyword.startsWith('tag:')) {
      getSearchResultByTag(keyword.slice(4), pageNo)
    } else if (keyword) {
      getSearchResultByKeyword(keyword, pageNo)
    }
  }
  useEffect(() => {
    // todo: 涉及到分页的时候还有别的参数，这时候api传参还挺麻烦的，需要考虑如何优化代码（柯里化？）
    fetchSearchResult(tag, keyword, pageNo)
  }, [tag, keyword, pageNo, defaultPageSize])
  return (
    <div>
      <header className="mb-6">搜索结果：</header>
      <ul className="flex flex-wrap gap-x-6 gap-y-10">
        {videoList.map((item, index) => (
          <li key={item.url + index} className="w-60">
            <div
              onClick={() => history.push(`/video/${item.url}`)}
              className="h-32 w-full cursor-pointer overflow-hidden rounded-md"
            >
              <img className="h-full w-full object-cover" src={item.cover} />
            </div>
            <div className="mt-2 flex h-8 justify-between">
              <p className="line-clamp-2 cursor-pointer text-sm leading-4 hover:text-primary">
                {item.description}
              </p>
            </div>
            <div
              onClick={() => history.push(`/space/${item.author.id}`)}
              className="mt-1 flex cursor-pointer items-center text-xs text-gray-500 hover:text-primary"
            >
              <SasIcon name="up"></SasIcon>
              <span>{item.author.username}</span>
              <span className="mx-1">·</span>
              <span>{formatDate(item.uploadTime, FormatType.YMD)}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Pagination
          current={pageNo}
          total={total}
          pageSize={defaultPageSize}
          onChange={(page, pageSize) => {
            fetchSearchResult(tag, keyword, page)
          }}
          showTotal={true}
          showNumberJump={true}
        ></Pagination>
      </div>
    </div>
  )
}
