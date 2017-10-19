import { log, error } from "./log";

//请求成功类型别名
type SuccessType = {ok: true, data: any};
//请求失败类型别名
type FailType = {ok: false, reason: string};

/**
 * 判断是否请求成功
 * @param data 接口返回数据
 */
function isSuccessType(data: SuccessType | FailType): data is SuccessType {
    return (<FailType>data).reason === undefined && data.ok;
}

/**
 * 接口请求失败响应
 * @param res 
 * @param reason 失败原因
 */
function failure(res:IRespond, reason: string): void {
    error(reason);
    res.json({ok:false, reason});
}
/**
 * 接口请求成功
 * @param res 
 * @param data 成功返回数据
 */
function success(res:IRespond, data?:any): void {
    res.json({ok:true, data});
}

export {failure, success, SuccessType, FailType, isSuccessType}