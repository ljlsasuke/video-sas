import QUERY_KEYS from '@/constants/queryKeys'
import { getWatchHistory } from '@/services'
import { useAuthStore } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'
export default function useWatchLater(limit = 5, offset = 0) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  if (!isLoggedIn) return null
  return useQuery({
    queryKey: QUERY_KEYS.WATch_HISTORY(limit, offset),
    queryFn: () => getWatchHistory(offset, limit),
    staleTime: 1000 * 60 * 1,
    refetchOnMount: true,
  })
}
