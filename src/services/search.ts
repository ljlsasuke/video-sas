import type { SearchResultResT } from '@/type'
import { $get } from '@/utils/http'
export const tagSearch = async (name: string, page = 1, pageSize = 10) => {
  let res = await $get<SearchResultResT>('/search/tag/', {
    params: { name, page, pageSize },
  })
  return res.data
}

export const keywordSearch = async (
  keyword: string,
  page = 1,
  pageSize = 10,
) => {
  let res = await $get<SearchResultResT>('/search/keyword/', {
    params: { keyword, page, pageSize },
  })
  return res.data
}
