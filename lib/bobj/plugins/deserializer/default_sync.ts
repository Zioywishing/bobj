import type Deserializer from "../../Deserializer";
import type { DeserializerPluginType } from "../../types/deserializerPlugin";
import decodeBobjItem from "../../utils/decodeBobjItem";
import bytes2int from "../../utils/bytes2int";
import useDefaultBaseDeserializerPluginGroup from "./default_base";

const useDefaultSyncDeserializerPluginGroup: () => DeserializerPluginType<any>[] = () => {

    const textDecoder = new TextDecoder();

    const desObj = (props: {
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
                result[bobjItem.key] = valueObj;
            } else {
                console.error("not found deserializer plugin", bobjItem.valueType);
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
            deserialize: (props) => {
                const arr = props.targetArray;
                let p = 0;
                const arrLenLen = arr[p]; p += 1;
                const arrLen = bytes2int(arr.subarray(p, p + arrLenLen)); p += arrLenLen;
                const result = new Array(arrLen);
                for (let i = 0; i < arrLen; i++) {
                    const itemLenLen = arr[p]; p += 1;
                    const itemLen = bytes2int(arr.subarray(p, p + itemLenLen)); p += itemLenLen;
                    const valueTypeLen = arr[p]; p += 1;
                    const valueLenLen = arr[p]; p += 1;
                    const valueType = arr.subarray(p, p + valueTypeLen); p += valueTypeLen;
                    const valueLen = bytes2int(arr.subarray(p, p + valueLenLen)); p += valueLenLen;
                    const valueBytes = arr.subarray(p, p + valueLen); p += valueLen;
                    const plugin = props.deserializer.filterPlugin(valueType);
                    if (!plugin) {
                        throw new Error("not found deserializer plugin");
                    }
                    const valueObj = plugin.deserialize({ targetArray: valueBytes, deserializer: props.deserializer });
                    result[i] = valueObj;
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

export default useDefaultSyncDeserializerPluginGroup;