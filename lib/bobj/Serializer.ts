import type { SerializerPluginSerializeResultType, SerializerPluginType } from "./types/serializerPlugin";
// import useDefaultSerializerPluginGroup from "./plugins/serializer/default";
import { concatU8iArrSync } from "./utils/concatU8iArr";
import calcSerializerPluginSerializeResultLength from "./utils/calcSerializerPluginSerializeResultLength";
import useDefaultSyncSerializerPluginGroup from "./plugins/serializer/default_sync";
import useDefaultSerializerPluginGroup from "./plugins/serializer/default";

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
            useDefaultSerializerPluginGroup().forEach((plugin) => {
                this.registerPlugin(plugin);
            })
            this.serialize = async (targetObject: { [key: string]: any }) => {
                const plugin = this.filterPlugin(targetObject);
                if (!plugin) {
                    throw new Error("Unknown value type");
                }

                const bResP = plugin.serialize({
                    target: targetObject,
                    serializer: this,
                })
                const bRes = bResP instanceof Promise ? await bResP : bResP;

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
        if (this.#PluginMap.has(target instanceof Object ? target.constructor : typeof target)) {
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
        plugin.filter && this.#PluginArray.unshift(plugin);
    }
}

export default Serializer;  