import type { BinarizerPluginType } from "./types/binarizer";
import defaultBinarizerPluginGroup from "./plugins/binarizer/default";

class Binarizer {
    #PluginArray: BinarizerPluginType<any>[] = [];

    constructor() {
        defaultBinarizerPluginGroup.forEach((plugin) => {
            this.registerPlugin(plugin);
        })
    }

    async binarize(targetObject: { [key: string]: any }): Promise<Uint8Array | undefined> {
        for (const plugin of this.#PluginArray) {
            if (plugin.filter(targetObject)) {
                const bRes = plugin.binarize({
                    target: targetObject,
                    binarizer: this,
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

    async filter(targetObject: any): Promise<string | undefined> {
        for (const plugin of this.#PluginArray) {
            if (plugin.filter(targetObject)) {
                return plugin.targetTypeString;
            }
        }
    }

    registerPlugin(middleware: BinarizerPluginType<any>) {
        this.#PluginArray.unshift(middleware);
    }
}

export default Binarizer;  