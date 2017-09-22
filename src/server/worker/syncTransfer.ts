import * as cluster from "cluster";

/**
 * 同步worker之间消息
 * @param worker 消息来源
 * @param message 消息
 */
export const syncTransfer = (worker: cluster.Worker, message: any) => {
    for(let k of Reflect.ownKeys(cluster.workers)) {
        let toWorker = cluster.workers[<string>k];
        if(toWorker && toWorker.id !== worker.id){
            toWorker.send(message);
        }
    }
}