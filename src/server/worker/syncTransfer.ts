import * as cluster from "cluster";

/**
 * 同步worker之间消息
 * @param message 消息
 * @param worker 消息来源
 */
export const syncTransfer = (message: any, worker?: cluster.Worker) => {
    for(let k of Reflect.ownKeys(cluster.workers)) {
        let toWorker = cluster.workers[<string>k];
        if(toWorker){
            if(!worker || toWorker.id !== worker.id) {
                toWorker.send(message);
            }
        }
    }
}