// import cachedFunction from "./cachedFunction";
import int2bytes from "./int2bytes";

const buildBobjEl = (props: {
    key: string,
    valueType: Uint8Array,
    value: Uint8Array,
    textEncoder?: TextEncoder,
}): Uint8Array => {
    const { key, valueType, value, textEncoder = new TextEncoder() } = props;
    const keyBytes = textEncoder.encode(key);
    // const valueTypeBytes = cachedFunction(_ => textEncoder.encode(_))([valueType]);
    const valueLengthBytes = int2bytes(value.length);
    const result = new Uint8Array([
        keyBytes.length,
        valueType.length,
        valueLengthBytes.length,
        ...keyBytes,
        ...valueType,
        ...valueLengthBytes,
        ...value
    ]);
    return result;
}


export default buildBobjEl;