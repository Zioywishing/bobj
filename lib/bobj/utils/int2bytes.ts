const int2bytes = (number: number, len?: number) => {
    len = len || 1;
    const bytes = [];
    while (number > 0 || len > 0) {
        bytes.unshift(number & 0xff);
        number = number >> 8;
        len--;
    }
    return new Uint8Array(bytes);
}

export default int2bytes;