const TAGS: {
    [index:string]: string;
} = {
    '<': '&lt;',
    '>': '&gt;'
}

export function hasTag(str: string): boolean {
    return Array.from(str).some(e => TAGS[e] !== undefined)
}

export default function htmlParser(str: string): string {
    return str.replace(/[\<|\>]/ig, e => TAGS[e]);
}
