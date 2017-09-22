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
