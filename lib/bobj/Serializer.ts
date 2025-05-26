import type { SerializerPluginType } from "./types/serializerPlugin";
import defaultSerializerPluginGroup from "./plugins/serializer/default";
import promiseResult from "./utils/promiseResult";
import concatU8iArr from "./utils/concatU8iArr";
import calcSerializerPluginSerializeResultLength from "./utils/calcSerializerPluginSerializeResultLength";
// import iterateUint8Arrays from "./utils/iterateSerializerPluginSerializeResult";

class Serializer {
    #PluginArray: SerializerPluginType<any>[] = [];
    #PluginMap: Map<Function | string, SerializerPluginType<any>> = new Map();

    constructor() {
        defaultSerializerPluginGroup.forEach((plugin) => {
            this.registerPlugin(plugin);
        })
    }

    async serialize(targetObject: { [key: string]: any }) {
        const plugin = await this.filterPlugin(targetObject);
        if (!plugin) {
            throw new Error("Unknown value type");
        }
        const bRes = await promiseResult(plugin.serialize({
            target: targetObject,
            serializer: this,
        }))

        return bRes instanceof Uint8Array
            ? bRes
            : concatU8iArr(
                // @ts-ignore
                bRes.flat(Infinity) as Uint8Array[],
                // iterateUint8Arrays(bRes),
                calcSerializerPluginSerializeResultLength(bRes)
            )
    }

    async filterPlugin(target: any): Promise<SerializerPluginType<any> | undefined> {
        if (target instanceof Object ? this.#PluginMap.has(target.constructor) : this.#PluginMap.has(typeof target)) {
            return this.#PluginMap.get(target instanceof Object ? target.constructor : typeof target);
        }
        for (const plugin of this.#PluginArray) {
            if (plugin.filter!(target)) {
                return plugin;
            }
        }
    }

    registerPlugin(plugin: SerializerPluginType<any>) {
        plugin.Constructor && this.#PluginMap.set(plugin.Constructor, plugin);
        plugin.filter && this.#PluginArray.push(plugin);
    }
}

export default Serializer;  