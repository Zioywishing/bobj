import defaultDeserializerPluginGroup from "./plugins/deserializer/default";
import type { DeserializerPluginType } from "./types/deserializerPlugin";
import decodeBobjItem from "./utils/decodeBobjItem";

const cm = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"]

const u8i2String = (u8iArray: Uint8Array) => u8iArray.reduce((prev, cur) => {
    return prev + cm[cur >> 8] + cm[cur & 0xff];
}, "")



class Deserializer {
    #pluginMap: Map<string, DeserializerPluginType<any>> = new Map();
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
            if (this.#pluginMap.has(u8i2String(bobjItem.valueType))) {
                const valueObj = this.#pluginMap.get(u8i2String(bobjItem.valueType))!.deserialize({ targetArray: bobjItem.value, deserializer: this });
                result[bobjItem.key] = valueObj instanceof Promise ? await valueObj : valueObj;
            } else {
                for (const plugin of this.#pluginArray) {
                    if ((plugin.filter as Function)(bobjItem.valueType)) {
                        const valueObj = plugin.deserialize({ targetArray: bobjItem.value, deserializer: this });
                        result[bobjItem.key] = valueObj instanceof Promise ? await valueObj : valueObj;
                    }
                }
            }
            p += bobjItem.totalLength;
        }
        return result;
    }

    registerPlugin(plugin: DeserializerPluginType<any>) {
        if (plugin.filter instanceof Uint8Array) {
            this.#pluginMap.set(u8i2String(plugin.filter), plugin);
            return;
        }
        this.#pluginArray.unshift(plugin);
    }
}

export default Deserializer;