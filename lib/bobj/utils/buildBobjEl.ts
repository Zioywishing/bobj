// import cachedFunction from "./cachedFunction";
import int2bytes from "./int2bytes";

const buildBobjEl = (props: {
    key: string,
    valueType: string,
    value: Uint8Array,
    textEncoder?: TextEncoder,
}): Uint8Array => {
    const { key, valueType, value, textEncoder = new TextEncoder() } = props;
    const keyBytes = textEncoder.encode(key);
    // const valueTypeBytes = cachedFunction(_ => textEncoder.encode(_))([valueType]);
    const valueTypeBytes = textEncoder.encode(valueType);
    const valueLengthBytes = int2bytes(value.length);
    const result = new Uint8Array([
        keyBytes.length,
        valueTypeBytes.length,
        valueLengthBytes.length,
        ...keyBytes,
        ...valueTypeBytes,
        ...valueLengthBytes,
        ...value
    ]);
    return result;
}


export default buildBobjEl;