import * as url from 'url';
/**
* 返回 ts Promise<any>
* @param path 用户连接的ws路径
*/
export function roomParser(path: string|undefined): Promise<string>{
        return new Promise((res,rej) => {
            if(typeof path === 'undefined' || path === '/undefined'|| typeof path === 'string' && path.replace(/\//,'') === '') {
                setImmediate(rej,'please check your path');
                return;
            }
            let {pathname} = url.parse(path);
            if(pathname) {
                //检查路径
                setImmediate(res,pathname)
            }else{
                setImmediate(rej,'illegal path!!!')
            }
        })
    }