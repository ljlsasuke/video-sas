export type PromiseInnerType<T> = T extends Promise<infer U> ? U : T
