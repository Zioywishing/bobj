import defaultDebinarizerPluginGroup from "./plugins/debinarizer/default";
import type { DebinarizerPluginType } from "./types/debinarizer";
import decodeBobjItem from "./utils/decodeBobjItem";


class Debinarizer {
    #pluginArray: DebinarizerPluginType<any>[] = [];
    #textDecoder: TextDecoder = new TextDecoder();

    constructor() {
        defaultDebinarizerPluginGroup.forEach(plugin => {
            this.registerPlugin(plugin);
        })
     }

    async debinarize(targetArray: Uint8Array): Promise<{ [key: string]: any; } | undefined> {
        const result: { [key: string]: any } = {}
        let p = 0;
        while (p < targetArray.length) {
            const targetArraySlice = targetArray.slice(p);
            const bobjItem = decodeBobjItem({ targetArray: targetArraySlice, textDecoder: this.#textDecoder });
            for (const plugin of this.#pluginArray) {
                if (plugin.filter(bobjItem.valueType)) {
                    const valueObj = plugin.debinarize({ targetArray: bobjItem.value, debinarizer: this });
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

    registerPlugin<T>(plugin: DebinarizerPluginType<T>) {
        this.#pluginArray.unshift(plugin); 
    }
}

export default Debinarizer;