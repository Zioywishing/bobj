import type { SerializerPluginSerializeResultType } from "../types/serializerPlugin";
import int2bytes from "./int2bytes";

const calcValueLengthCache = new WeakMap<SerializerPluginSerializeResultType, number>()

const calcValueLength = (target: SerializerPluginSerializeResultType): number => {
    if (target instanceof Uint8Array) {
        return target.length
    } else {
        if(calcValueLengthCache.has(target)) {
            return calcValueLengthCache.get(target)!
        }
        const length = target.reduce((curr, item) => curr + calcValueLength(item), 0)
        calcValueLengthCache.set(target, length)
        return length
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