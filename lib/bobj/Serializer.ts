import type { SerializerPluginType } from "./types/serializer";
import defaultSerializerPluginGroup from "./plugins/serializer/default";

class Serializer {
    #PluginArray: SerializerPluginType<any>[] = [];

    constructor() {
        defaultSerializerPluginGroup.forEach((plugin) => {
            this.registerPlugin(plugin);
        })
    }

    async serialize(targetObject: { [key: string]: any }): Promise<Uint8Array | undefined> {
        for (const plugin of this.#PluginArray) {
            if (plugin.filter(targetObject)) {
                const bRes = plugin.serialize({
                    target: targetObject,
                    serializer: this,
                })
                let res: Uint8Array | undefined;
                if (bRes instanceof Promise) {
                    res = await bRes;
                } else {
                    res = bRes;
                }
                return res;
            }
        }
    }

    async filter(targetObject: any): Promise<Uint8Array | undefined> {
        for (const plugin of this.#PluginArray) {
            if (plugin.filter(targetObject)) {
                return plugin.targetType;
            }
        }
    }

    registerPlugin(middleware: SerializerPluginType<any>) {
        this.#PluginArray.unshift(middleware);
    }
}

export default Serializer;  