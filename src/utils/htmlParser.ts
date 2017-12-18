const CHAR_S_INDEX: {
    [index:string]: string;
} = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
}

const ALPHA_INDEX: {
    [index:string]: string;
} = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
}

function encode(str: string): string {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, s => CHAR_S_INDEX[s]||s);
}

function decode(str: string): string {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
}

function hasTag(str: string): boolean {
    return Array.from(str).some(e => CHAR_S_INDEX[e] !== undefined)
}

export {encode, decode, hasTag}
