import type { SerializerPluginType, SerializerPluginTypeC, SerializerPluginTypeF } from "./types/serializerPlugin";
import defaultSerializerPluginGroup from "./plugins/serializer/default";
import promiseResult from "./utils/promiseResult";
import concatU8iArr from "./utils/concatU8iArr";
import calcSerializerPluginSerializeResultLength from "./utils/calcSerializerPluginSerializeResultLength";
// import iterateUint8Arrays from "./utils/iterateSerializerPluginSerializeResult";

class Serializer {
    #PluginArray: SerializerPluginTypeF<any>[] = [];
    #PluginMap: Map<Function | string, SerializerPluginTypeC<any>> = new Map();

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
        // console.log({ target, type: typeof target, isO: target instanceof Object, res: target instanceof Object ? this.#PluginMap.has(target.constructor) : this.#PluginMap.has(typeof target) });
        if (target instanceof Object ? this.#PluginMap.has(target.constructor) : this.#PluginMap.has(typeof target)) {
            // console.log(target);
            return this.#PluginMap.get(target instanceof Object? target.constructor : typeof target);
        }
        for (const plugin of this.#PluginArray) {
            if (plugin.filter(target)) {
                return plugin;
            }
        }
    }

    registerPlugin(plugin: SerializerPluginType<any>) {
        // @ts-ignore
        if (plugin.Constructor !== undefined) {
            // @ts-ignore
            this.#PluginMap.set(plugin.Constructor, plugin);
        } else {
            this.#PluginArray.push(plugin as SerializerPluginTypeF<any>);
        }
    }
}

export default Serializer;  