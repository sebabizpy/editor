import RedisClient, { Redis, KeyType } from "ioredis";
import debug from "debug";
import Queue from "./queues";
const debugLog: debug.IDebugger = debug("app:consumer-client");
const errorLog: debug.IDebugger = debug("app:consumer-client:error");
import { Task, TASK_STATUS } from "../../app/tasks/model/tasks.model"
import { MessagePublisher, RedisPublishClient } from "./publish.client"

export type SubscriberFunction<P = any, RES = any> = (channel: Queue, payload?: P) => Promise<RES>;

export interface MessageConsumer {
  addListener(channel: string, fn: SubscriberFunction, retryHandler?: RetryHandlerType): void
  start(): void
}

export interface MValue {
  fn: SubscriberFunction
  retry: RetryHandler
}


export class RedisConsumerClient implements MessageConsumer {

  listeners: Map<KeyType, MValue>
  handlers: Map<RetryHandlerType, RetryHandler>
  globalRetryHandlerType: RetryHandlerType
  redis: Redis

  constructor(retryHandler: RetryHandlerType = undefined, port: number = 6379) {
    this.listeners = new Map<KeyType, MValue>()
    this.globalRetryHandlerType = retryHandler;
    this.redis = new RedisClient(port)
  }

  keys(): IterableIterator<KeyType> {
    return this.listeners.keys();
  }

  async addListener<P, RES>(channel: Queue, fn: SubscriberFunction<P, RES>, retryHandler: RetryHandlerType = undefined) {

    let rht: RetryHandlerType = retryHandler || this.globalRetryHandlerType

    const val: MValue = { fn: fn, retry: this.createRetryHandler(rht) }
    this.listeners.set(channel, val);
  }

  public async start() {

    type Callback<T> = (err: Error | null, res: T) => void;

    const cb: Callback<string> = async (err: Error | null, message: string) => {
      if (message) {
        if (!err) {

          const payload = String(message).slice(String(message).indexOf(",") + 1,
            String(message).length)
          const key = String(message).split(",")[0]

          const v: MValue = await this.listeners.get(key)
          debugLog(`Found v.retry ${v.retry} ${key}`)

          try {
            debugLog(`[callback] Processing ${key}`)
            const result: any = await v.fn(Queue[key], payload)
            await v?.retry?.handle(Queue[key], result)
          } catch (error: unknown) {
            errorLog(`[callback] Error processing ${key} , ${error}`)
            await v?.retry?.handle(Queue[key], JSON.parse(payload))
          }

        } else {
          errorLog("Error message " + message)
        }
      }
    }
    const contentArray: Array<KeyType> = Array.from(this.keys());
    // @ts-ignore
    this.redis.blpop(...contentArray, 1, cb)
  }

  private createRetryHandler(rh: RetryHandlerType): RetryHandler {
    switch (rh) {
      case RetryHandlerType.BASIC:
        return new CustomRetryHandler();
      case RetryHandlerType.NONE:
        return undefined;
      default:
        return undefined;
    }
  }


}

export enum RetryHandlerType {
  NONE = "NONE",
  BASIC = "BASIC"
}

export interface RetryHandler {
  handle(channel: Queue, result: any): Promise<any>
}

export class CustomRetryHandler {

  redis: Redis
  mp: MessagePublisher

  constructor(port: number = 6379) {
    this.redis = new RedisClient(port);
    this.mp = new RedisPublishClient(port);
  }

  private saveTaskAndRemoveFromKvs = (key: string, key_retry: string, task: Task) => {
    this.redis.del(key)
    this.redis.del(key_retry)
    this.mp.publish(Queue.JS_SAVE_TASK, JSON.stringify(task))
  }

  public handle = async (channel: Queue, result: any): Promise<any> => {
    try {
      debugLog(`[retryHandler] result ${result}`)
      const resultString = JSON.stringify(result)
      const now = new Date()
      const key: string = `${channel}:${result.asset_id}:${result.run_id}`
      const key_retry: string = `retries:${key}`
      const retries = await this.redis.get(key_retry)
      if (!retries) {
        await this.redis.set(key_retry, 0)
      }

      debugLog(`[retryHandler] [key:${key}] created key `)
      const sTask: string = await this.redis.get(key);
      let task: Task = new Task()
      if (sTask) {
        task = JSON.parse(sTask);
      } else {
        debugLog(`[retryHandler] [key:${key}] creating task`)
        task.asset_id = result.asset_id
        task.run_id = result.run_id
        task.updatedAt = now
        task.createdAt = now
        await this.redis.set(key, JSON.stringify(task))
      }

      if (result.status === "OK") {
        debugLog(`[retryHandler] [key:${key}] [result.status:${result.status}]`)
        task.status = TASK_STATUS.OK
        task.detail = "Payload processed successfully"
        task.updatedAt = now
        task.key = key
        task.payload = resultString
        this.saveTaskAndRemoveFromKvs(key, key_retry, task)
        debugLog(`[retryHandler] [key:${key}] task id ${task.id}`)
        return Promise.resolve(result)
      } else {
        const m: any = await this.redis.incr(key_retry)
        debugLog(`[retryHandler] [key:${key}] [result.status:${result.status}]`)
        task.status = TASK_STATUS.ERROR
        task.detail = "Error processing payload."
        task.payload = resultString
        task.key = key
        debugLog(`[retryHandler] [key:${key}] incr #${m}`)
        task.retries = m
        if (task.retries == 3) {
          errorLog(`[retryHandler] [key:${key}] done 3 retries key ${key}`)
          this.saveTaskAndRemoveFromKvs(key, key_retry, task)
          return Promise.resolve("DONE")
        }
        debugLog(`[retryHandler] [key:${key}] Error found retrying #${task.retries} ${JSON.stringify(task)}`)
        await this.redis.set(key, JSON.stringify(task))
        if (channel != Queue.JS_DONE_CHECKER) {
          await this.mp.publish(channel.replace("JS", "PY"), resultString)
        } else {
          await this.mp.publish(channel, resultString)
        }
      }
    } catch (e: unknown) {
      errorLog(`[retryHandler] Reject ${JSON.stringify(e)}`)
      return Promise.reject(e)
    }

    debugLog(`[retryHandler] resolved`)
    return Promise.resolve(result)
  }
}

