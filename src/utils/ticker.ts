
/**
 * 计时器内部存储结构
 */
interface Ihandle {
    id: number;
    delay: number;
    fn: Function;
    arg?: any[]|undefined;
    times?: number;
    time: number;
}

let running: boolean = false;
let pause: boolean = false;
let id: NodeJS.Timer;

const handleMap: Ihandle[] = [];

const call = (fn: Function, delay: number, arg?: any[]|undefined, times?: number) => {
    let id = handleMap.length;
    let handle = {id,fn,delay,arg,times, time: Date.now()};
    handleMap.push(handle);
    runTicker();
    return id;
}

/**
 * 移除回调计时器
 * @param idOrfn 回调或者回调id 传入id时删除单个，传入函数时删除全部函数
 */
const remove = (idOrfn:Function|number) => {
    if(typeof idOrfn === 'number') {
        handleMap.splice(idOrfn, 1);
    }else{
        let entries = handleMap.entries();
        for(let [, handle] of entries) {
            if(handle.fn === idOrfn) {
                handleMap.splice(handleMap.indexOf(handle), 1);
            }
        }
    }
    running && clearInterval(id);
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
    let clearMap: Ihandle[] = [];

    for(const handle of handleMap) {
        if(now >= (handle.time + handle.delay)) {
            try{
                handle.fn.apply(null,handle.arg);
            }catch{}
            handle.time += handle.delay;
            if(handle.times) {
                handle.times -= 1;
                if(handle.times <= 0) {
                    clearMap.push(handle);
                }
            }
        }
    }
    //清除执行完毕的任务
    for(let handle of clearMap) {
        handleMap.splice(handleMap.indexOf(handle), 1);
    }
}

export {call,remove};