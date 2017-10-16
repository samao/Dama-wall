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