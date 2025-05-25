export function generateTestObj(layer: number): Object {
    if (layer === 0) {
        return {};
    }
    return {
        a: 1,
        b: "2",
        c: true,
        d: null,
        e: undefined,
        f: [1, "2", {
            a: 1,
            b: "2",
            c: true,
            d: null,
            e: undefined,
            f: generateTestObj(layer - 1),
        }],
        g: new Uint8Array(3).fill(1),
        h: generateTestObj(layer - 1),
    }
}