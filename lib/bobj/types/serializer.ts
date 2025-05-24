import type Serializer from "../Serializer";

export type SerializerPluginType<T> = {
    serialize(props: {
        target: T,
        serializer: Serializer,
    }): Uint8Array | Promise<Uint8Array>;
    filter: (targetObject: any) => boolean;
    targetType: Uint8Array;
}