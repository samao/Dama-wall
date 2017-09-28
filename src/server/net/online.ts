import * as cluster from 'cluster';

//每个workers上用户连接按线程，路径分组
const onlineMap: Map<cluster.Worker, Map<string, number>> = new Map();

function getWorkerMap(worker: cluster.Worker): Map<string, number> {
    let workerMap = onlineMap.get(worker) || new Map();
    onlineMap.set(worker, workerMap);

    return workerMap;
}

function size(pathname: string): number {
    let total = 0;
    for(let [,map] of onlineMap) {
        for(let [path, num] of map)
            if(pathname === path) (total += num);
    }
    return total;
}

export function increaseOne(worker: cluster.Worker, pathname: string): number {
    let workerMap = getWorkerMap(worker);
    let total = workerMap.get(pathname) || 0;
    workerMap.set(pathname, ++total);
    return size(pathname);
}
export function reduceOne(worker: cluster.Worker, pathname: string): number {
    let workerMap = getWorkerMap(worker);
    let total = workerMap.get(pathname) || 1;
    workerMap.set(pathname, --total);
    return size(pathname);
}

export function reduceAll(worker: cluster.Worker): {pathname: string, total: number}[] {
    let workerMap = getWorkerMap(worker);
    onlineMap.delete(worker);
    
    let reduceData:{pathname: string, total: number}[] = [];
    for(let [pathname,total] of workerMap) {
        reduceData.push({pathname,total});
    }
    return reduceData;
}