import type { SerializerPluginType } from "./types/serializerPlugin";
import defaultSerializerPluginGroup from "./plugins/serializer/default";
import promiseResult from "./utils/promiseResult";
import concatU8iArr from "./utils/concatU8iArr";
import calcSerializerPluginSerializeResultLength from "./utils/calcSerializerPluginSerializeResultLength";

class Serializer {
    #PluginArray: SerializerPluginType<any>[] = [];

    constructor() {
        defaultSerializerPluginGroup.forEach((plugin) => {
            this.registerPlugin(plugin);
        })
    }

    async serialize(targetObject: { [key: string]: any }) {
        for (const plugin of this.#PluginArray) {
            if (plugin.filter(targetObject)) {
                const bRes = await promiseResult(plugin.serialize({
                    target: targetObject,
                    serializer: this,
                }))
                return bRes instanceof Uint8Array
                    ? bRes
                    : concatU8iArr(
                        // @ts-ignore
                        bRes.flat(Infinity) as Uint8Array[],
                        calcSerializerPluginSerializeResultLength(bRes)
                    )
            }
        }
    }

    async filterPlugin(targetObject: any): Promise<SerializerPluginType<any> | undefined> {
        for (const plugin of this.#PluginArray) {
            if (plugin.filter(targetObject)) {
                return plugin;
            }
        }
    }

    registerPlugin(middleware: SerializerPluginType<any>) {
        this.#PluginArray.unshift(middleware);
    }
}

export default Serializer;  