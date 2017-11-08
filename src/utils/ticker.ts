/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:31:12 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2017-11-08 10:31:12 
 */

/**
 * 计时器内部存储结构
 */
interface Ihandle {
    id: Symbol;
    delay: number;
    fn: Function;
    arg?: any[]|undefined;
    times?: number;
    time: number;
}

let running: boolean = false;
let pause: boolean = false;
let id: NodeJS.Timer;

const handleMap: Map<Symbol,Ihandle> = new Map();

const call = (fn: Function, delay: number, arg?: any[]|undefined, times?: number) => {
    let id = Symbol();
    let handle = {id, fn, delay, arg, times, time: Date.now()};
    handleMap.set(id, handle);
    runTicker();
    return id;
}

/**
 * 移除回调计时器
 * @param idOrfn 回调或者回调id 传入id时删除单个，传入函数时删除全部函数
 */
const remove = (idOrfn:Function|Symbol) => {
    if(typeof idOrfn === 'symbol') {
        handleMap.delete(idOrfn);
    }else{
        let entries = handleMap.entries();
        for(let [id, handle] of entries) {
            if(handle.fn === idOrfn) {
                handleMap.delete(id);
            }
        }
    }
    running && handleMap.size === 0 && clearInterval(id);
}

const runTicker = () => {
    if(!running) {
        running = true;
        id = setInterval(update, 50)
    }
}

/**
 * 刷新计时器，执行计时回调
 */
const update = () => {
    if(pause) return;

    let now = Date.now();
    let clearMap: Symbol[] = [];

    for(const [id,handle] of handleMap) {
        if(now >= (handle.time + handle.delay)) {
            try{
                handle.fn.apply(null,handle.arg);
            }catch{}
            handle.time += handle.delay;
            if(handle.times) {
                handle.times -= 1;
                if(handle.times <= 0) {
                    clearMap.push(id);
                }
            }
        }
    }
    //清除执行完毕的任务
    for(let id of clearMap) {
        handleMap.delete(id);
    }
}

export {call,remove};