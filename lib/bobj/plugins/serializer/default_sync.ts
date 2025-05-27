import type Serializer from "../../Serializer";
import type { SerializerPluginSerializeResultType, SerializerPluginType } from "../../types/serializerPlugin";
import calcSerializerPluginSerializeResultLength from "../../utils/calcSerializerPluginSerializeResultLength";
import int2bytes from "../../utils/int2bytes";
import { numberToU8i } from "../../utils/number_u8i_converter";

const useDefaultSyncSerializerPluginGroup: () => SerializerPluginType<any>[] = () => {
    const textEncoder = new TextEncoder();
    const cachedMap = new Map<string | number, Uint8Array>();

    const buildBobjEl = (props: {
        keyBytes: Uint8Array,
        valueType: Uint8Array,
        value: SerializerPluginSerializeResultType,
        textEncoder?: TextEncoder,
    }) => {
        const { keyBytes, valueType, value } = props;
        const valueLengthBytes = int2bytes(calcSerializerPluginSerializeResultLength(value));
        let u1 = cachedMap.get(keyBytes.length << 16 + valueType.length << 8 + valueLengthBytes.length);
        if (!u1) {
            u1 = new Uint8Array([keyBytes.length, valueType.length, valueLengthBytes.length]);
            cachedMap.set(keyBytes.length << 16 + valueType.length << 8 + valueLengthBytes.length, u1);
        }
        return [u1, keyBytes, valueType, valueLengthBytes, value]
    }
    return [
        {
            // filter: (targetObject: any) => {
            //     return targetObject instanceof Object
            // },
            Constructor: Object,
            targetType: new Uint8Array([0]),
            serialize(props: {
                target: { [x: string]: any; },
                serializer: Serializer,
            }) {
                const resultBuffer: SerializerPluginSerializeResultType[] = []
                for (const key in props.target) {
                    const keyBytes = textEncoder.encode(key);
                    // let keyBytes = cachedMap.get(key);
                    // if (!keyBytes) {
                    //     keyBytes = textEncoder.encode(key);
                    //     cachedMap.set(key, keyBytes);
                    // }
                    const value = props.target[key];
                    const plugin = props.serializer.filterPlugin(value)!
                    const valueType = plugin.targetType;
                    if (!valueType) {
                        throw new Error("Unknown value type");
                    }
                    const valueBytes = plugin.serialize({ target: value, serializer: props.serializer }) as SerializerPluginSerializeResultType ?? new Uint8Array(0);
                    resultBuffer.push(buildBobjEl({ keyBytes, valueType, value: valueBytes, textEncoder }));
                }
                return resultBuffer;
            }
        }, {
            // filter: (targetObject: any) => {
            //     return targetObject instanceof Array;
            // },
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
            // filter: (targetObject: any) => {
            //     return targetObject instanceof Uint8Array;
            // },
            Constructor: Uint8Array,
            targetType: new Uint8Array([2]),
            serialize(props: { target: Uint8Array; serializer: Serializer; }) {
                return props.target;
            }
        }, {
            // filter(_) {
            //     return typeof _ === "string";
            // },
            Constructor: "string",
            targetType: new Uint8Array([3]),
            serialize(props: { target: string }) {
                return textEncoder.encode(props.target);
            }
        }, {
            // filter(_) {
            //     return typeof _ === "number";
            // },
            Constructor: "number",
            targetType: new Uint8Array([4]),
            serialize(props: { target: number; }) {
                return numberToU8i(props.target);
            }
        }, {
            // filter(_) {
            //     return typeof _ === "boolean";
            // },
            Constructor: "boolean",
            targetType: new Uint8Array([5]),
            serialize(props: { target: boolean; }) {
                return new Uint8Array([props.target ? 1 : 0]);
            }
        }, {
            // filter(_) {
            //     return typeof _ === "undefined";
            // },
            Constructor: "undefined",
            targetType: new Uint8Array([6]),
            serialize() {
                return new Uint8Array(0);
            }
        }, {
            filter(_) {
                return _ === null;
            },
            targetType: new Uint8Array([7]),
            serialize() {
                return new Uint8Array(0);
            }
        }
    ]
}

export default useDefaultSyncSerializerPluginGroup;