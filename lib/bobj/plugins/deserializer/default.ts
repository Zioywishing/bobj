import type { DeserializerPluginType } from "../../types/deserializer";
import compareU8iArr from "../../utils/compareU8iArr";
import { u8iToNumber } from "../../utils/number_u8i_converter";

const defaultDeserializerPluginGroup: DeserializerPluginType<any>[] = [
    {
        // object
        filter: (valueType) => compareU8iArr(valueType, new Uint8Array([0])) === 0,
        deserialize: (props) => {
            return props.deserializer.deserialize(props.targetArray);
        }
    },
    {
        // array 
        filter: (valueType) => compareU8iArr(valueType, new Uint8Array([1])) === 0,
        deserialize: async (props) => {
            const values = (await props.deserializer.deserialize(props.targetArray))!;
            const result = new Array(values.l).fill(0);
            for (let i = 0; i < values.l; i++) {
                result[i] = values[i]; 
            }
            return result;
        }
    }, {
        filter: (valueType) => compareU8iArr(valueType, new Uint8Array([2])) === 0,
        deserialize: (props) => {
            return props.targetArray;
        }
    },
    {
        filter: (valueType) => compareU8iArr(valueType, new Uint8Array([3])) === 0,
        deserialize: (props) => {
            return (new TextDecoder()).decode(props.targetArray);
        },
    }, {
        filter: (valueType) => compareU8iArr(valueType, new Uint8Array([4])) === 0,
        deserialize: (props) => {
            return u8iToNumber(props.targetArray)
        }
    }, {
        filter: (valueType) => compareU8iArr(valueType, new Uint8Array([5])) === 0,
        deserialize: (props) => {
            return props.targetArray[0] === 0x01;
        }
    }, {
        filter: (valueType) => compareU8iArr(valueType, new Uint8Array([6])) === 0,
        deserialize: (_) => {
            return undefined;
        }
    }, {
        filter: (valueType) => compareU8iArr(valueType, new Uint8Array([7])) === 0,
        deserialize: (_) => {
            return null;
        }
    }
];

export default defaultDeserializerPluginGroup;