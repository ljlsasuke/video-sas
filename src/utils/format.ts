// 写一个播放量达到多少万之后把数字转化为万的函数，万以下是数字，万以上是多少万
export function formatPlayCount(count: number | string): string {
  if (typeof count === 'string') {
    if (count.includes('万')) {
      return count
    }
    count = Number(count)
  }
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}

// 写一个把时间戳转化为某种格式时间的函数
export enum FormatType {
  YMD = 'YMD', //年月日
  YMDHMS = 'YMDHMS', //年月日时分秒
  later = 'later', //几天前,几个星期前，几月前，几年这种
}
export function formatDate(
  date: string | number,
  type: FormatType = FormatType.YMD,
): string {
  const dateObj = new Date(date)
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  const seconds = String(dateObj.getSeconds()).padStart(2, '0')

  if (type === FormatType.YMD) {
    return `${year}年${month}月${day}日`
  } else if (type === FormatType.YMDHMS) {
    return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
  } else if (type === FormatType.later) {
    const now = new Date()
    const diff = now.getTime() - dateObj.getTime()

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)

    if (years > 0) {
      return `${years}年前`
    }
    if (months > 0) {
      return `${months}月前`
    }
    if (weeks > 0) {
      return `${weeks}周前`
    }
    if (days > 0) {
      return `${days}天前`
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours > 0) {
      return `${hours}小时前`
    }

    const minutes = Math.floor(diff / (1000 * 60))
    if (minutes > 0) {
      return `${minutes}分钟前`
    }

    return '刚刚'
  }

  return ''
}
