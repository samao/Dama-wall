/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:30:51 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2017-11-08 10:30:51 
 */

const caches: Map<Symbol, any> = new Map();

export function cache(value: any): Symbol {
    let id = Symbol();
    caches.set(id, value);
    return id;
}

export function uncache(id: Symbol): boolean {
    return caches.delete(id);;
}

export function get<T>(id: Symbol): T {
    return caches.get(id)
}