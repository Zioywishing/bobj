import type Serializer from "../../Serializer";
import type { SerializerPluginSerializeResultType, SerializerPluginType } from "../../types/serializerPlugin";
import buildBobjEl from "../../utils/buildBobjEl";
import { numberToU8i } from "../../utils/number_u8i_converter";
import promiseResult from "../../utils/promiseResult";

const defaultSerializerPluginGroup: SerializerPluginType<any>[] = [
    {
        filter: (targetObject: any) => {
            return targetObject instanceof Object
        },
        targetType: new Uint8Array([0]),
        async serialize(props: {
            target: { [x: string]: any; },
            serializer: Serializer,
        }) {
            const stringEncoder = new TextEncoder();
            const resultBuffer: SerializerPluginSerializeResultType[] = []
            for (const key in props.target) {
                const value = props.target[key];
                const plugin = (await props.serializer.filterPlugin(value))!
                const valueType = plugin.targetType;
                if (!valueType) {
                    throw new Error("Unknown value type");
                }
                const valueBytes = await promiseResult(plugin.serialize({ target: value, serializer: props.serializer })) ?? new Uint8Array(0);
                resultBuffer.push(buildBobjEl({ key, valueType, value: valueBytes, textEncoder: stringEncoder }));
            }
            return resultBuffer;
        }
    }, {
        filter: (targetObject: any) => {
            return targetObject instanceof Array;
        },
        targetType: new Uint8Array([1]),
        async serialize(props: { target: any[]; serializer: Serializer; }) {
            const newTarget: { [key: string]: any } = {
                ...props.target,
                l: props.target.length,
            }
            return (await props.serializer.serialize(newTarget))!;
        }
    }, {
        filter: (targetObject: any) => {
            return targetObject instanceof Uint8Array;
        },
        targetType: new Uint8Array([2]),
        serialize(props: { target: Uint8Array; serializer: Serializer; }) {
            return props.target;
        }
    }, {
        filter(_) {
            return typeof _ === "string";
        },
        targetType: new Uint8Array([3]),
        serialize(props: { target: string; textEncoder?: TextEncoder; }) {
            const textEncoder = props.textEncoder || new TextEncoder();
            return textEncoder.encode(props.target);
        }
    }, {
        filter(_) {
            return typeof _ === "number";
        },
        targetType: new Uint8Array([4]),
        serialize(props: { target: number; }) {
            return numberToU8i(props.target);
        }
    }, {
        filter(_) {
            return typeof _ === "boolean";
        },
        targetType: new Uint8Array([5]),
        serialize(props: { target: boolean; }) {
            return new Uint8Array([props.target ? 1 : 0]);
        }
    }, {
        filter(_) {
            return typeof _ === "undefined";
        },
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

export default defaultSerializerPluginGroup;