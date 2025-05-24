import type Debinarizer from "../Debinarizer";

export type DebinarizerPluginType<T> = {
    debinarize(props: {
        targetArray: Uint8Array,
        debinarizer: Debinarizer
    }): T | Promise<T>;
    filter: (valueType: string) => boolean;
}