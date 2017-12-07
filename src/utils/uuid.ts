import * as crypto from 'crypto';

const hex: string[] = [];

for(let i = 0; i < 256; ++i) {
    hex.push((0x100 + i).toString(16).substr(1));
}

function toUUID(bytes: string[]): string {
    return `${bytes.slice(0,4).join('')}-${bytes.slice(4,6).join('')}-${bytes.slice(6,8).join('')}-${bytes.slice(8,10).join('')}-${bytes.slice(10,16).join('')}`
}

export default function generateUUID(): string {
    const sha = crypto.createHash('sha1').update(crypto.randomBytes(16)).digest();
    const uuidChars: string[] = Array.from({length: sha.byteLength});
    sha.forEach((byte,index) => {
        uuidChars[index] = hex[byte]
    })
    return toUUID(uuidChars);
}