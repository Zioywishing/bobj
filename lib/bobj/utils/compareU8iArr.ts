export default function compareU8iArr(a: Uint8Array, b: Uint8Array): -1 | 0 | 1 {
    if (a.length !== b.length) {
        return a.length - b.length > 0 ? 1 : -1;
    } else {
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return a[i] - b[i] > 0 ? 1 : -1;
            }
        }
        return 0;
    }

}