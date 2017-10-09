declare interface IRespond {
    end(msg: string): any;
    json(data: {ok: boolean, [index: string]: any}): any
}