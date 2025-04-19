import QUERY_KEYS from '@/constants/queryKeys'
import { getCollections } from '@/services'
import { useQuery } from '@tanstack/react-query'
export default function useCollections(
  page = 1,
  pageSize = 9,
  userId?: number,
) {
  return useQuery({
    queryKey: QUERY_KEYS.COLLECTIONS(page, pageSize, userId),
    queryFn: () => getCollections(page, pageSize, userId),
    staleTime: 1000 * 60 * 5, // 数据5分钟内不会被标记为过期
    gcTime: 1000 * 60 * 10, // 缓存保留10分钟
    refetchOnMount: false, // 组件挂载时不自动重新请求
  })
}
