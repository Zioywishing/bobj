import type { SerializerPluginSerializeResultType } from "../types/serializerPlugin";
import calcSerializerPluginSerializeResultLength from "./calcSerializerPluginSerializeResultLength";
import int2bytes from "./int2bytes";

const buildBobjEl = (props: {
    key: string,
    valueType: Uint8Array,
    value: SerializerPluginSerializeResultType,
    textEncoder?: TextEncoder,
}) => {
    const { key, valueType, value, textEncoder = new TextEncoder() } = props;
    const keyBytes = textEncoder.encode(key);
    const valueLengthBytes = int2bytes(calcSerializerPluginSerializeResultLength(value));
    return [new Uint8Array([
        keyBytes.length,
        valueType.length,
        valueLengthBytes.length,
    ]), keyBytes, valueType, valueLengthBytes, value]
}


export default buildBobjEl;