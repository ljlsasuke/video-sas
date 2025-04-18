import QUERY_KEYS from '@/constants/queryKeys'
import { getWatchHistory } from '@/services'
import { useQuery } from '@tanstack/react-query'
export default function useWatchLater(limit = 5, offset = 0) {
  return useQuery({
    queryKey: QUERY_KEYS.WATCH_HISTORY(limit, offset),
    queryFn: () => getWatchHistory(offset, limit),
    staleTime: 1000 * 60 * 1,
    refetchOnMount: true,
  })
}
