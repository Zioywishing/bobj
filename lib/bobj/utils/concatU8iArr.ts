export function concatU8iArrSync(u8iArrBuffer: Uint8Array[] | Generator<Uint8Array>, length: number) {
    const totalLength = length // ?? u8iArrBuffer.reduce((curr, item) => curr + item.length, 0)
    const result = new Uint8Array(totalLength)
    let p = 0;
    for (const u8iarr of u8iArrBuffer) {
        result.set(u8iarr, p)
        p += u8iarr.length
    }
    return result
}

export default async function concatU8iArr(u8iArrBuffer: Uint8Array[], length: number) {
    return Blob ? new Uint8Array(await (new Blob(u8iArrBuffer)).arrayBuffer()) : concatU8iArrSync(u8iArrBuffer, length)
    // return concatU8iArrSync(u8iArrBuffer, length)
}