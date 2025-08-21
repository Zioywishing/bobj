export function generateTestObj_deep(deep: number): Object {
    if (deep === 0) {
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
            f: generateTestObj_deep(deep - 1),
        }],
        g: new Uint8Array([1, 2, 3, 4, 5]),
        h: generateTestObj_deep(deep - 1),
    }
}

export function generateTestObj_data(data: () => any, deep: number = 0): Object {
    return deep > 0 ? { _: generateTestObj_data(data, deep - 1) } : {
        a: data()
    }
}

export const genBigObj = (size: number) => new Array(size).fill(0).reduce((acc, _, i) => ({ ...acc, [i]: i }), {})