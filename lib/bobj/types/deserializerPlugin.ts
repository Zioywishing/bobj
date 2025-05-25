import type Deserializer from "../Deserializer";

export type DeserializerPluginType<T> = {
    deserialize(props: {
        targetArray: Uint8Array,
        deserializer: Deserializer
    }): T | Promise<T>;
    filter: Uint8Array | ((valueType: Uint8Array) => boolean);
}