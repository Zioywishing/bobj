import defaultDeserializerPluginGroup from "./plugins/deserializer/default";
import type { DeserializerPluginType } from "./types/deserializer";
import decodeBobjItem from "./utils/decodeBobjItem";


class Deserializer {
    #pluginArray: DeserializerPluginType<any>[] = [];
    #textDecoder: TextDecoder = new TextDecoder();

    constructor() {
        defaultDeserializerPluginGroup.forEach(plugin => {
            this.registerPlugin(plugin);
        })
     }

    async deserialize(targetArray: Uint8Array): Promise<{ [key: string]: any; } | undefined> {
        const result: { [key: string]: any } = {}
        let p = 0;
        while (p < targetArray.length) {
            const targetArraySlice = targetArray.subarray(p);
            const bobjItem = decodeBobjItem({ targetArray: targetArraySlice, textDecoder: this.#textDecoder });
            for (const plugin of this.#pluginArray) {
                if (plugin.filter(bobjItem.valueType)) {
                    const valueObj = plugin.deserialize({ targetArray: bobjItem.value, deserializer: this });
                    if (valueObj instanceof Promise) {
                        result[bobjItem.key] = await valueObj; 
                    } else {
                        result[bobjItem.key] = valueObj;
                    }
                }
            }
            p += bobjItem.totalLength;
        }
        return result;
    }

    registerPlugin<T>(plugin: DeserializerPluginType<T>) {
        this.#pluginArray.unshift(plugin); 
    }
}

export default Deserializer;