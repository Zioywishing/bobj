import type { DeserializerPluginType } from "../../types/deserializerPlugin";
import { u8iToNumber } from "../../utils/number_u8i_converter";

const defaultDeserializerPluginGroup: DeserializerPluginType<any>[] = [
    {
        // object
        filter: new Uint8Array([0]),
        deserialize: (props) => {
            return props.deserializer.deserialize(props.targetArray);
        }
    },
    {
        // array 
        filter: new Uint8Array([1]),
        deserialize: async (props) => {
            const values = (await props.deserializer.deserialize(props.targetArray))!;
            const result = new Array(values.l).fill(0);
            for (let i = 0; i < values.l; i++) {
                result[i] = values[i]; 
            }
            return result;
        }
    }, {
        filter: new Uint8Array([2]),
        deserialize: (props) => {
            return props.targetArray;
        }
    },
    {
        filter: new Uint8Array([3]),
        deserialize: (props) => {
            return (new TextDecoder()).decode(props.targetArray);
        },
    }, {
        filter: new Uint8Array([4]),
        deserialize: (props) => {
            return u8iToNumber(props.targetArray)
        }
    }, {
        filter: new Uint8Array([5]),
        deserialize: (props) => {
            return props.targetArray[0] === 0x01;
        }
    }, {
        filter: new Uint8Array([6]),
        deserialize: (_) => {
            return undefined;
        }
    }, {
        filter: new Uint8Array([7]),
        deserialize: (_) => {
            return null;
        }
    }
];

export default defaultDeserializerPluginGroup;