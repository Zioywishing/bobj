import useDefaultDeserializerPluginGroup from "./plugins/deserializer/default";
import useDefaultSyncDeserializerPluginGroup from "./plugins/deserializer/default_sync";
import type { DeserializerPluginType } from "./types/deserializerPlugin";



class Deserializer {
    #pluginMap: Map<string, DeserializerPluginType<any>> = new Map();
    #pluginArray: DeserializerPluginType<any>[] = [];
    #pluginObject?: DeserializerPluginType<any>

    #cm = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    #u8i2String = (u8iArray: Uint8Array) => u8iArray.reduce((prev, cur) => {
        return prev + this.#cm[cur >> 8] + this.#cm[cur & 0xff];
    }, "")

    constructor(options?: {
        sync?: boolean;
    }) {
        if (options?.sync) {
            useDefaultSyncDeserializerPluginGroup().forEach(plugin => {
                this.registerPlugin(plugin);
            })
        } else {
            useDefaultDeserializerPluginGroup().forEach(plugin => {
                this.registerPlugin(plugin);
            })
        }
    }

    deserialize(targetArray: Uint8Array): Promise<{ [key: string]: any; } | undefined> {
        return this.#pluginObject?.deserialize({ targetArray, deserializer: this });
    }

    registerPlugin(plugin: DeserializerPluginType<any>) {
        if (plugin.filter instanceof Uint8Array) {
            this.#pluginMap.set(this.#u8i2String(plugin.filter), plugin);
            if (plugin.filter.length === 1 && plugin.filter[0] === 0) {
                this.#pluginObject = plugin;
            }
            return;
        }
        this.#pluginArray.unshift(plugin);
    }

    filterPlugin(type: Uint8Array) {
        if (this.#pluginMap.has(this.#u8i2String(type))) {
            return this.#pluginMap.get(this.#u8i2String(type))!;
        } else {
            for (const plugin of this.#pluginArray) {
                if ((plugin.filter as Function)(type)) {
                    return plugin;
                }
            }
        }
    }
}

export default Deserializer;