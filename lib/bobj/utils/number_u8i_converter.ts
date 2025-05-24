function numberToU8i(num: number) {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setFloat64(0, num, true);
    return new Uint8Array(Array.from(new Uint8Array(buffer)));
}

function u8iToNumber(u8iArray: Uint8Array) {
    const buffer = new ArrayBuffer(8);
    const uint8View = new Uint8Array(buffer);
    for (let i = 0; i < 8; i++) {
        uint8View[i] = u8iArray[i] || 0;
    }
    const view = new DataView(buffer);
    return view.getFloat64(0, true);
}

export { numberToU8i, u8iToNumber };