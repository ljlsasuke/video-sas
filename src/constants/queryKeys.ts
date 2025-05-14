// 观看记录不缓存，每次都重新获取。收藏和稍后再看缓存
const QUERY_KEYS = {
  COLLECTIONS: (page: number, pageSize: number, userId: number) => [
    'collections',
    {
      page,
      pageSize,
      userId,
    },
  ],
  WATCH_LATER: (limit: number, offset: number) => [
    'watchLater',
    { limit, offset },
  ],
  WATCH_HISTORY: (limit: number, offset: number) => [
    'watchHistory',
    { limit, offset },
  ],
}

export default QUERY_KEYS
