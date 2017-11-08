/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:31:05 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2017-11-08 10:31:05 
 */

import { log as utilLog} from "util";

const log = (...rest: any[]) => {
    utilLog(`[LOG] ${rest.join()}`);
}
const debug = (...rest: any[]) => {
    utilLog(`[DEBUG] ${rest.join()}`);
}
const error = (...rest: any[]) => {
    utilLog(`[ERROR] ${rest.join()}`);
}

export {log, debug, error};
