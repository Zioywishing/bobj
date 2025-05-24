export default function bytes2int(bytes: Uint8Array): number {
    let result = 0;
    for (let i = 0; i < bytes.length; i++) {
        result = (result << 8) + bytes[i]
    }
    return result;
}