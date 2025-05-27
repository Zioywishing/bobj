import type { SerializerPluginSerializeResultType } from "../types/serializerPlugin";
import calcSerializerPluginSerializeResultLength from "./calcSerializerPluginSerializeResultLength";
import int2bytes from "./int2bytes";

const buildBobjEl = (props: {
    keyBytes: Uint8Array,
    valueType: Uint8Array,
    value: SerializerPluginSerializeResultType,
    textEncoder?: TextEncoder,
}) => {
    const { keyBytes, valueType, value } = props;
    const valueLengthBytes = int2bytes(calcSerializerPluginSerializeResultLength(value));
    return [new Uint8Array([
        keyBytes.length,
        valueType.length,
        valueLengthBytes.length,
    ]), keyBytes, valueType, valueLengthBytes, value]
}


export default buildBobjEl;