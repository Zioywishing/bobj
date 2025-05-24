import type { DebinarizerPluginType } from "../../types/debinarizer";
import { u8iToNumber } from "../../utils/number_u8i_converter";

const defaultDebinarizerPluginGroup: DebinarizerPluginType<any>[] = [
    {
        filter: (valueType) => valueType === "Object",
        debinarize: (props) => {
            return props.debinarizer.debinarize(props.targetArray);
        }
    },
    {
        filter: (valueType) => valueType === "Array",
        debinarize: async (props) => {
            const values = (await props.debinarizer.debinarize(props.targetArray))!;
            const result = new Array(values.l).fill(0);
            for (let i = 0; i < values.l; i++) {
                result[i] = values[i]; 
            }
            return result;
        }
    }, {
        filter: (valueType) => valueType === "Uint8Array",
        debinarize: (props) => {
            return props.targetArray;
        }
    },
    {
        filter: (valueType) => valueType === "String",
        debinarize: (props) => {
            const textDecoder = new TextDecoder();
            return textDecoder.decode(props.targetArray);
        },
    }, {
        filter: (valueType) => valueType === "Number",
        debinarize: (props) => {
            const res = u8iToNumber(props.targetArray)
            return res
        }
    }, {
        filter: (valueType) => valueType === "Boolean",
        debinarize: (props) => {
            const res = props.targetArray[0] === 0x01 ? true : false;
            return res;
        }
    }, {
        filter: (valueType) => valueType === "Null",
        debinarize: (_) => {
            return null;
        }
    }, {
        filter: (valueType) => valueType === "Undefined",
        debinarize: (_) => {
            return undefined;
        }
    }
];

export default defaultDebinarizerPluginGroup;