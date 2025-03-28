// 参考：
// https://chat.deepseek.com/a/chat/s/57605902-beeb-4fd9-8f2b-3146da9c0c3b
// https://chat.deepseek.com/a/chat/s/2c606220-a924-420d-808a-f1708f553409
type HashKey = symbol
const randomHashKeyGenerator = (): HashKey => {
  return Symbol('pubsub-key')
}
type CallBack<D = unknown> = (data?: D) => void
interface Subscribers<D = unknown> {
  callback: CallBack<D>
  hashKey: HashKey
}
class PubSub {
  private subscribers: Map<string, Subscribers<any>[]>
  constructor() {
    this.subscribers = new Map()
  }

  publish = <E extends string, D = unknown>(event: E, data?: D): boolean => {
    const events = this.subscribers.get(event)
    if (!events?.length) return false
    events.forEach(({ callback }) => {
      try {
        callback(data)
      } catch (error) {
        console.error(`事件 ${String(event)} 的回调执行出错:`, error)
      }
    })
    return true
  }

  subscribe = <E extends string, D = unknown>(
    event: E,
    callback: CallBack<D>,
  ): (() => void) => {
    const hashKey = randomHashKeyGenerator()
    const newSub = { callback, hashKey }

    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, [])
    }
    // 把初次订阅的增加通过这里实现，可以减少一次get查询
    this.subscribers.get(event)!.push(newSub)
    return () => {
      const events = this.subscribers.get(event)
      if (!events) return
      const i = events.findIndex(({ hashKey }) => hashKey === newSub.hashKey)
      if (i === -1) return
      events.splice(i, 1)
      if (events.length === 0) this.subscribers.delete(event)
    }
  }
  subscribeOnce = <E extends string, D = unknown>(
    event: E,
    callback: CallBack<D>,
  ): (() => void) => {
    // 1. 创建一个包装函数
    const onceCallback = (data?: D) => {
      try {
        callback(data) // 执行原始回调
      } finally {
        unsubscribe() // 无论成功与否都取消订阅
      }
    }

    // 2. 正常订阅这个包装函数
    const unsubscribe = this.subscribe(event, onceCallback)

    // 3. 返回取消订阅函数
    return unsubscribe
  }
  /**
   *  取消某个事件的所有订阅
   * @param event 事件名
   * @returns 是否成功
   */
  unsubscribeAll = (event: string): boolean => {
    return this.subscribers.delete(event)
  }

  getEventSubscribers = (
    event: string,
  ): Readonly<Subscribers[]> | undefined => {
    return this.subscribers.get(event)
  }

  getEvents = (): string[] => {
    return Array.from(this.subscribers.keys())
  }

  clearAllSubscribers = (): void => {
    this.subscribers.clear()
  }
}

type PubSubInterface = Omit<PubSub, 'subscribers'>

const createPubSubInstance = (): PubSubInterface => {
  const ins = new PubSub()
  return {
    subscribe: ins.subscribe,
    subscribeOnce: ins.subscribeOnce,
    unsubscribeAll: ins.unsubscribeAll,
    publish: ins.publish,
    getEventSubscribers: ins.getEventSubscribers,
    getEvents: ins.getEvents,
    clearAllSubscribers: ins.clearAllSubscribers,
  }
}
const pubsub = createPubSubInstance()
// 传统单例模式（设置构造函数为私有， 定义 getInstance 的静态方法 导出 唯一实例）
// 这是一个基于模块的单例模式 (Module Singleton Pattern) 参考：https://chat.deepseek.com/a/chat/s/8db438bb-e31a-4874-b87d-6753ea43d209
export default pubsub
