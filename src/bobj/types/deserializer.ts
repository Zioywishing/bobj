import type Deserializer from "../Deserializer";

export type DeserializerPluginType<T> = {
    debinarize(props: {
        targetArray: Uint8Array,
        deserializer: Deserializer
    }): T | Promise<T>;
    filter: (valueType: string) => boolean;
}