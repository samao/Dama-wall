/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:31:05 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2017-11-08 10:31:05 
 */
function print(str: string) {
	const date = new Date();
	console.log(
		`${date.toLocaleDateString()} ${date.toLocaleTimeString()} - ${str}`
	);
}

const log = (...rest: any[]) => {
	print(`[LOG] ${rest.join()}`);
};
const debug = (...rest: any[]) => {
	print(`[DEBUG] ${rest.join()}`);
};
const error = (...rest: any[]) => {
	print(`[ERROR] ${rest.join()}`);
};

export { log, debug, error };
