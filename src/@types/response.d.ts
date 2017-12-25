/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:25:51 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2017-12-25 15:38:45
 */

declare interface IRespond {
    locals:any;
    statusCode:number;
    end(msg?: string): any;
    json(data: {ok: boolean, [index: string]: any}): any;
    sendFile(path: string): any;
    setHeader(key: string, value: string): any;
    sendStatus(code: number): IRespond;
}

declare interface IRequest {
    params:any;
    body:any;
}