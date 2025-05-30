import type Deserializer from "../../Deserializer";
import type { DeserializerPluginType } from "../../types/deserializerPlugin";
import decodeBobjItem from "../../utils/decodeBobjItem";
import useDefaultBaseDeserializerPluginGroup from "./default_base";

const useDefaultDeserializerPluginGroup: () => DeserializerPluginType<any>[] = () => {

    const textDecoder = new TextDecoder();

    const desObj = async (props: {
        targetArray: Uint8Array;
        deserializer: Deserializer;
    }) => {
        const result: { [key: string]: any } = {}
        let p = 0;
        while (p < props.targetArray.length) {
            const targetArraySlice = props.targetArray.subarray(p);
            const bobjItem = decodeBobjItem({ targetArray: targetArraySlice, textDecoder });
            const plugin = props.deserializer.filterPlugin(bobjItem.valueType);
            if (plugin) {
                const valueObj = plugin.deserialize({ targetArray: bobjItem.value, deserializer: props.deserializer });
                result[bobjItem.key] = valueObj instanceof Promise ? await valueObj : valueObj;
            } else {
                throw new Error("not found deserializer plugin")
            }
            p += bobjItem.totalLength;
        }
        return result;
    }
    return [
        {
            // object
            filter: new Uint8Array([0]),
            deserialize: desObj,
        },
        {
            // array 
            filter: new Uint8Array([1]),
            deserialize: async (props) => {
                const values = (await desObj(props))!;
                const result = new Array(values.l).fill(0);
                for (let i = 0; i < values.l; i++) {
                    result[i] = values[i];
                }
                return result;
            }
        },
        {
            filter: new Uint8Array([3]),
            deserialize: (props) => {
                return textDecoder.decode(props.targetArray);
            },
        },
        ...useDefaultBaseDeserializerPluginGroup(),
    ]
};

export default useDefaultDeserializerPluginGroup;