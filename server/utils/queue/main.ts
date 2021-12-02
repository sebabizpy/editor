import { RedisConsumerClient } from "./consumer.client";
import debug from "debug";
import { RedisPublishClient } from "./publish.client";
import Queue  from "./queues";
const debugLog: debug.IDebugger = debug("app:main-client");

async function consume(payload: string): Promise<string> {
    debugLog("consumed " + payload)
    return Promise.resolve("ok")
}

function main() {
    /* let cc = new RedisConsumerClient(null)
    cc.addListener<string, string>(Queue.PY_CONVERAGE, consume);
    cc.start() */


    let pc = new RedisPublishClient(null)
    let m = { key: 'QueueEnum.FACTS', times: -1, price: 3, buyer_id: 4, time: 1632011827.102916 }
    pc.publish(Queue.PY_COVERAGE, JSON.stringify(m))

}

main();
