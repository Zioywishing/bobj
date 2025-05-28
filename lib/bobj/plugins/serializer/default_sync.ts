import type Serializer from "../../Serializer";
import type { SerializerPluginSerializeResultType, SerializerPluginType } from "../../types/serializerPlugin";
import calcSerializerPluginSerializeResultLength from "../../utils/calcSerializerPluginSerializeResultLength";
import int2bytes from "../../utils/int2bytes";
import useDefaultSerializerPluginGroupBase from "./default_base";

const useDefaultSyncSerializerPluginGroup: () => SerializerPluginType<any>[] = () => {
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
            serialize(props: {
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
                    const valueBytes = plugin.serialize({ target: value, serializer: props.serializer }) as SerializerPluginSerializeResultType ?? new Uint8Array(0);
                    resultBuffer.push(buildBobjEl({ keyBytes, valueType, value: valueBytes, textEncoder }));
                }
                console.log(resultBuffer)
                return resultBuffer;
            }
        }, {
            Constructor: Array,
            targetType: new Uint8Array([1]),
            serialize(props: { target: any[]; serializer: Serializer; }) {
                const newTarget: { [key: string]: any } = {
                    ...props.target,
                    l: props.target.length,
                }
                return (props.serializer.filterPlugin(newTarget)!.serialize({ target: newTarget, serializer: props.serializer }))!;
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

export default useDefaultSyncSerializerPluginGroup;