import { log, error } from "./log";

function failure(res:IRespond, reason: string): void {
    error(reason);
    res.json({ok:false, reason});
}

function success(res:IRespond, data?:any): void {
    res.json({ok:true, data});
}

export {failure, success}