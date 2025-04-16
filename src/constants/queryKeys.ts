// 观看记录不缓存，每次都重新获取。收藏和稍后再看缓存
const QUERY_KEYS = {
  COLLECTIONS: (page: number, pageSize: number, userId?: number) => [
    'collections',
    {
      page,
      pageSize,
      // api那里直接传递userId是因为如果userId是undefined，那么不会被包含在实际请求中
      // 这里把undefined过滤掉,否则依赖一个undefined感觉怪怪的
      ...(userId !== undefined && { userId }),
    },
  ],
  WATCH_LATER: (limit: number, offset: number) => [
    'watchLater',
    { limit, offset },
  ],
  WATch_HISTORY: (limit: number, offset: number) => [
    'watchHistory',
    { limit, offset },
  ],
}

export default QUERY_KEYS
