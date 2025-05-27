import type { SerializerPluginSerializeResultType, SerializerPluginType } from "./types/serializerPlugin";
// import useDefaultSerializerPluginGroup from "./plugins/serializer/default";
import promiseResult from "./utils/promiseResult";
import { concatU8iArrSync } from "./utils/concatU8iArr";
import calcSerializerPluginSerializeResultLength from "./utils/calcSerializerPluginSerializeResultLength";
import useDefaultSyncSerializerPluginGroup from "./plugins/serializer/default_sync";

class Serializer {
    #PluginArray: SerializerPluginType<any>[] = [];
    #PluginMap: Map<Function | string, SerializerPluginType<any>> = new Map();

    serialize: (targetObject: { [key: string]: any }) => Promise<Uint8Array> | Uint8Array;

    constructor(options?: {
        sync: boolean
    }) {
        if (options?.sync === true) {
            useDefaultSyncSerializerPluginGroup().forEach((plugin) => {
                this.registerPlugin(plugin);
            })
            this.serialize = (targetObject: { [key: string]: any }) => {
                const plugin = this.filterPlugin(targetObject);
                if (!plugin) {
                    throw new Error("Unknown value type");
                }

                const bRes = plugin.serialize({
                    target: targetObject,
                    serializer: this,
                }) as SerializerPluginSerializeResultType

                const res = bRes instanceof Uint8Array
                    ? bRes
                    : concatU8iArrSync(
                        // @ts-ignore
                        bRes.flat(Infinity) as Uint8Array[],
                        calcSerializerPluginSerializeResultLength(bRes)
                    )
                return res;
            }
        } else {
            useDefaultSyncSerializerPluginGroup().forEach((plugin) => {
                this.registerPlugin(plugin);
            })
            this.serialize = async (targetObject: { [key: string]: any }) => {
                const plugin = this.filterPlugin(targetObject);
                if (!plugin) {
                    throw new Error("Unknown value type");
                }

                const bRes = await promiseResult(plugin.serialize({
                    target: targetObject,
                    serializer: this,
                }))

                const res = bRes instanceof Uint8Array
                    ? bRes
                    : concatU8iArrSync(
                        // @ts-ignore
                        bRes.flat(Infinity) as Uint8Array[],
                        calcSerializerPluginSerializeResultLength(bRes)
                    )
                return res;
            }
        }
    }

    filterPlugin(target: any): SerializerPluginType<any> | undefined {
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