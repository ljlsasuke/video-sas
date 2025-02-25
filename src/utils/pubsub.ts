type HashKey = string
const randomHashKeyGenerator = (): HashKey => {
  return Math.random().toString(36).substring(2, 15)
}
type CallBack<D = unknown> = (data?: D) => void
interface Subscribers<E extends string = string> {
  eventName: E
  callback: CallBack<any>
  hashKey: HashKey
}
class PubSub {
  private subscribers: Map<string, Subscribers[]>
  constructor() {
    this.subscribers = new Map()
  }

  publish = <E extends string, D = unknown>(event: E, data?: D): boolean => {
    const events = this.subscribers.get(event)
    if (!events?.length) return false
    events.forEach(({ callback }) => callback(data))
    return true
  }

  subscribe = <E extends string, D = unknown>(
    event: E,
    callback: CallBack<D>,
  ): HashKey => {
    const hashKey = randomHashKeyGenerator()
    const newSub = { eventName: event, callback, hashKey }

    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, [])
    }
    // 把初次订阅的增加通过这里实现，可以减少一次get查询
    this.subscribers.get(event)!.push(newSub)
    return hashKey
  }

  unsubscribe = (hashKey: HashKey): boolean => {
    if (!hashKey) return false
    let found = false
    for (const [event, subs] of this.subscribers) {
      let i = subs.length
      while (i--) {
        // 反向遍历避免splice影响索引
        if (subs[i].hashKey === hashKey) {
          subs.splice(i, 1)
          found = true
        }
      }
      if (subs.length === 0) {
        this.subscribers.delete(event)
      }
    }
    return found
  }
  getAllSubscribers = (): Readonly<Subscribers[]> =>
    Object.freeze([...this.subscribers.values()].flat())

  clearAllSubscribers = (): void => {
    this.subscribers.clear()
  }
}

type PubSubInterface = Omit<PubSub, 'subscribers'>

const createPubSubInstance = (): PubSubInterface => {
  const ins = new PubSub()
  return {
    subscribe: ins.subscribe,
    unsubscribe: ins.unsubscribe,
    publish: ins.publish,
    getAllSubscribers: ins.getAllSubscribers,
    clearAllSubscribers: ins.clearAllSubscribers,
  }
}
const pubsub = createPubSubInstance()
export default pubsub
