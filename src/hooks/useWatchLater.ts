import QUERY_KEYS from '@/constants/queryKeys'
import { getWatchLater } from '@/services'
import { useAuthStore } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'
export default function useWatchLater(limit = 5, offset = 0) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  if (!isLoggedIn) return null
  return useQuery({
    queryKey: QUERY_KEYS.WATCH_LATER(limit, offset),
    queryFn: () => getWatchLater(offset, limit),
    staleTime: 1000 * 60 * 5, // 数据5分钟内不会被标记为过期
    gcTime: 1000 * 60 * 10, // 缓存保留10分钟
    refetchOnMount: false, // 组件挂载时不自动重新请求
  })
}
