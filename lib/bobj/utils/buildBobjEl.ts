import concatU8iArr from "./concatU8iArr";
import int2bytes from "./int2bytes";

const buildBobjEl = (props: {
    key: string,
    valueType: Uint8Array,
    value: Uint8Array,
    textEncoder?: TextEncoder,
}): Uint8Array => {
    const { key, valueType, value, textEncoder = new TextEncoder() } = props;
    const keyBytes = textEncoder.encode(key);
    const valueLengthBytes = int2bytes(value.length);
    return concatU8iArr(new Uint8Array([
        keyBytes.length,
        valueType.length,
        valueLengthBytes.length,
    ]), keyBytes, valueType, valueLengthBytes, value);
}


export default buildBobjEl;