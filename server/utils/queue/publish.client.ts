import RedisClient, { Redis } from "ioredis";
import debug from "debug";
const debugLog: debug.IDebugger = debug("app:consumer-client");
export type SubscriberFunction<P = any, RES = void> = (channel: string, payload?: P) => Promise<RES>;

export interface MessagePublisher {
  publish(channel: string, payload: string): Promise<number>;
}

export class RedisPublishClient implements MessagePublisher {
  redisPublisher: Redis;

  constructor(port: number | null) {
    this.redisPublisher = new RedisClient(port ? port : 6379);
  }

  async publish(channel: string, payload: string): Promise<number> {
    debugLog(`[publish] Pushing ${channel} `)
    return await this.redisPublisher.rpush(channel, payload)
  }
}