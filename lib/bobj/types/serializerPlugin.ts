import type Serializer from "../Serializer";

export type SerializerPluginSerializeResultType = Uint8Array | (Uint8Array | SerializerPluginSerializeResultType)[]

export type SerializerPluginType<T> = {
    serialize(props: {
        target: T,
        serializer: Serializer,
    }): SerializerPluginSerializeResultType | Promise<SerializerPluginSerializeResultType>;
    Constructor?: Function | string;
    filter?: (targetObject: any) => boolean;
    targetType: Uint8Array;
}