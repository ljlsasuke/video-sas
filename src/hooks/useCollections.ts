import QUERY_KEYS from '@/constants/queryKeys'
import { getCollections } from '@/services'
import { useQuery } from '@tanstack/react-query'
export default function useCollections(userId: number, page = 1, pageSize = 9) {
  return useQuery({
    queryKey: QUERY_KEYS.COLLECTIONS(page, pageSize, userId),
    queryFn: () => getCollections(page, pageSize, userId),
    staleTime: 1000 * 60 * 5, // 数据5分钟内不会被标记为过期
    gcTime: 1000 * 60 * 10, // 缓存保留10分钟
    // refetchOnMount: false, // 组件挂载时不自动重新请求
    // todo:暂时还没发现为什么在视频播放界面让所有的缓存过期后个人空间收藏列表那里还是旧数据
    // 但是顶部VideoStar里面的数据是都更新了的，这里暂时让数据在组件挂载时重新获取，暂时解决
    // 后续再找原因
    refetchOnMount: 'always',
  })
}
