import type { DeserializerPluginType } from "../../types/deserializer";
import { u8iToNumber } from "../../utils/number_u8i_converter";

const defaultDeserializerPluginGroup: DeserializerPluginType<any>[] = [
    {
        filter: (valueType) => valueType === "Object",
        deserialize: (props) => {
            return props.deserializer.deserialize(props.targetArray);
        }
    },
    {
        filter: (valueType) => valueType === "Array",
        deserialize: async (props) => {
            const values = (await props.deserializer.deserialize(props.targetArray))!;
            const result = new Array(values.l).fill(0);
            for (let i = 0; i < values.l; i++) {
                result[i] = values[i]; 
            }
            return result;
        }
    }, {
        filter: (valueType) => valueType === "Uint8Array",
        deserialize: (props) => {
            return props.targetArray;
        }
    },
    {
        filter: (valueType) => valueType === "String",
        deserialize: (props) => {
            const textDecoder = new TextDecoder();
            return textDecoder.decode(props.targetArray);
        },
    }, {
        filter: (valueType) => valueType === "Number",
        deserialize: (props) => {
            const res = u8iToNumber(props.targetArray)
            return res
        }
    }, {
        filter: (valueType) => valueType === "Boolean",
        deserialize: (props) => {
            const res = props.targetArray[0] === 0x01 ? true : false;
            return res;
        }
    }, {
        filter: (valueType) => valueType === "Null",
        deserialize: (_) => {
            return null;
        }
    }, {
        filter: (valueType) => valueType === "Undefined",
        deserialize: (_) => {
            return undefined;
        }
    }
];

export default defaultDeserializerPluginGroup;