import type Serializer from "../../Serializer";
import type { SerializerPluginType } from "../../types/serializer";
import buildBobjEl from "../../utils/buildBobjEl";
import { numberToU8i } from "../../utils/number_u8i_converter";

const defaultSerializerPluginGroup: SerializerPluginType<any>[] = [
    {
        filter: (_targetObject: any) => {
            return true
        },
        targetTypeString: "Object",
        async serialize(props: {
            target: { [x: string]: any; },
            serializer: Serializer,
        }) {
            const stringEncoder = new TextEncoder();
            let result = new Uint8Array(0);
            for (const key in props.target) {
                const value = props.target[key];
                const valueType = await props.serializer.filter(value) || "Unknown";
                const valueBytes = valueType !== "unknown" ? await props.serializer.serialize(value) || new Uint8Array(0) : new Uint8Array(0);
                result = new Uint8Array([...result, ...buildBobjEl({ key, valueType, value: valueBytes, textEncoder: stringEncoder })]);
            }
            return result;
        }
    }, {
        filter: (targetObject: any) => {
            return targetObject instanceof Array;
        },
        targetTypeString: "Array",
        async serialize(props: { target: any[]; serializer: Serializer; }) {
            const stringEncoder = new TextEncoder();
            let result = new Uint8Array(0);
            const newTarget: { [key: string]: any } = {
                ...props.target,
                l: props.target.length,
            }
            for (const key in newTarget) {
                const value = newTarget[key];
                const valueType = await props.serializer.filter(value) || "Unknown";
                const valueBytes = valueType !== "unknown" ? await props.serializer.serialize(value) || new Uint8Array(0) : new Uint8Array(0);
                result = new Uint8Array([...result, ...buildBobjEl({ key, valueType, value: valueBytes, textEncoder: stringEncoder })]);
            }
            return result;
        }
    }, {
        filter: (targetObject: any) => {
            return targetObject instanceof Uint8Array;
        },
        targetTypeString: "Uint8Array",
        serialize(props: { target: Uint8Array; serializer: Serializer; }) {
            return props.target;
        }
    }, {
        filter(_) {
            return typeof _ === "string";
        },
        targetTypeString: "String",
        serialize(props: { target: string; textEncoder?: TextEncoder; }) {
            const textEncoder = props.textEncoder || new TextEncoder();
            return textEncoder.encode(props.target);
        }
    }, {
        filter(_) {
            return typeof _ === "number";
        },
        targetTypeString: "Number",
        serialize(props: { target: number; }) {
            return numberToU8i(props.target);
        }
    }, {
        filter(_) {
            return typeof _ === "boolean";
        },
        targetTypeString: "Boolean",
        serialize(props: { target: boolean; }) {
            return new Uint8Array([props.target ? 1 : 0]);
        }
    }, {
        filter(_) {
            return typeof _ === "undefined";
        },
        targetTypeString: "Undefined",
        serialize() {
            return new Uint8Array(0);
        }
    }, {
        filter(_) {
            return _ === null;
        },
        targetTypeString: "Null",
        serialize() {
            return new Uint8Array(0);
        }
    }
]

export default defaultSerializerPluginGroup;