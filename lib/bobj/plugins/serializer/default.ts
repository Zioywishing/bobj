import type Serializer from "../../Serializer";
import type { SerializerPluginSerializeResultType, SerializerPluginType } from "../../types/serializerPlugin";
import calcSerializerPluginSerializeResultLength from "../../utils/calcSerializerPluginSerializeResultLength";
import int2bytes from "../../utils/int2bytes";
// import buildBobjEl from "../../utils/buildBobjEl";
import useDefaultSerializerPluginGroupBase from "./default_base";
// import promiseResult from "../../utils/promiseResult";

const useDefaultSerializerPluginGroup: () => SerializerPluginType<any>[] = () => {
    const textEncoder = new TextEncoder();
    // const cachedMap = new Map<string | number, Uint8Array>();

    const buildBobjEl = (props: {
        keyBytes: Uint8Array,
        valueType: Uint8Array,
        value: SerializerPluginSerializeResultType,
        textEncoder?: TextEncoder,
    }) => {
        const { keyBytes, valueType, value } = props;
        const valueLengthBytes = int2bytes(calcSerializerPluginSerializeResultLength(value));
        // let u1 = cachedMap.get(keyBytes.length << 24 + valueType.length << 16 + valueLengthBytes.length);
        // if (!u1) {
        // u1 = new Uint8Array([keyBytes.length, valueType.length, valueLengthBytes.length]);
        //     cachedMap.set(keyBytes.length << 24 + valueType.length << 16 + valueLengthBytes.length, u1);
        // }
        // return [u1, keyBytes, valueType, valueLengthBytes, value]
        return [new Uint8Array([keyBytes.length, valueType.length, valueLengthBytes.length]), keyBytes, valueType, valueLengthBytes, value]
    }
    return [
        {
            Constructor: Object,
            targetType: new Uint8Array([0]),
            async serialize(props: {
                target: { [x: string]: any; },
                serializer: Serializer,
            }) {
                const resultBuffer: SerializerPluginSerializeResultType[] = []
                for (const key in props.target) {
                    const keyBytes = textEncoder.encode(key);
                    const value = props.target[key];
                    const plugin = props.serializer.filterPlugin(value)!
                    const valueType = plugin.targetType;
                    if (!valueType) {
                        throw new Error("Unknown value type");
                    }
                    const vr = plugin.serialize({ target: value, serializer: props.serializer });
                    const valueBytes = await vr ?? new Uint8Array(0);
                    resultBuffer.push(buildBobjEl({ keyBytes, valueType, value: valueBytes, textEncoder }));
                }
                return resultBuffer;
            }
        }, {
            Constructor: Array,
            targetType: new Uint8Array([1]),
            /**
             * Array encoding:
             * - 1 byte: ArrayLengthByteLength
             * - N bytes: ArrayLength
             * Then for each item:
             * - 1 byte: ItemByteLengthByteLength
             * - M bytes: ItemByteLength
             * - 1 byte: ValueTypeLength
             * - 1 byte: ValueLengthByteLength
             * - ValueType bytes
             * - ValueLength bytes
             * - Value bytes
             */
            async serialize(props: { target: any[]; serializer: Serializer; }) {
                const arrLenBytes = int2bytes(props.target.length);
                const resultBuffer: SerializerPluginSerializeResultType[] = [new Uint8Array([arrLenBytes.length]), arrLenBytes];
                for (const item of props.target) {
                    const plugin = props.serializer.filterPlugin(item)!
                    const valueType = plugin.targetType;
                    if (!valueType) {
                        throw new Error("Unknown value type");
                    }
                    const value = await plugin.serialize({ target: item, serializer: props.serializer }) ?? new Uint8Array(0);
                    const valueLengthBytes = int2bytes(calcSerializerPluginSerializeResultLength(value));
                    const itemPayload: SerializerPluginSerializeResultType[] = [new Uint8Array([valueType.length, valueLengthBytes.length]), valueType, valueLengthBytes, value];
                    const itemPayloadLength = calcSerializerPluginSerializeResultLength(itemPayload);
                    const itemLenBytes = int2bytes(itemPayloadLength);
                    resultBuffer.push(new Uint8Array([itemLenBytes.length]), itemLenBytes, itemPayload);
                }
                return resultBuffer;
            }
        }, {
            Constructor: "string",
            targetType: new Uint8Array([3]),
            serialize(props: { target: string }) {
                return textEncoder.encode(props.target);
            }
        },
        ...useDefaultSerializerPluginGroupBase(),
    ]
}

export default useDefaultSerializerPluginGroup;