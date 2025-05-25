import type { SerializerPluginSerializeResultType } from "../types/serializerPlugin";
import int2bytes from "./int2bytes";

const calcValueLength = (target: SerializerPluginSerializeResultType): number => {
    if (target instanceof Uint8Array) {
        return target.length
    } else {
        return target.reduce((curr, item) => curr + calcValueLength(item), 0)
    }
}

const buildBobjEl = (props: {
    key: string,
    valueType: Uint8Array,
    value: SerializerPluginSerializeResultType,
    textEncoder?: TextEncoder,
}) => {
    const { key, valueType, value, textEncoder = new TextEncoder() } = props;
    const keyBytes = textEncoder.encode(key);
    const valueLengthBytes = int2bytes(calcValueLength(value));
    return [new Uint8Array([
        keyBytes.length,
        valueType.length,
        valueLengthBytes.length,
    ]), keyBytes, valueType, valueLengthBytes, value]
}


export default buildBobjEl;