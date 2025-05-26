import type Serializer from "../Serializer";

export type SerializerPluginSerializeResultType = Uint8Array | (Uint8Array | SerializerPluginSerializeResultType)[]

export type SerializerPluginTypeF<T> = {
    serialize(props: {
        target: T,
        serializer: Serializer,
    }): SerializerPluginSerializeResultType | Promise<SerializerPluginSerializeResultType>;
    filter: (targetObject: any) => boolean;
    targetType: Uint8Array;
} 

export type SerializerPluginTypeC<T> = {
    serialize(props: {
        target: T,
        serializer: Serializer,
    }): SerializerPluginSerializeResultType | Promise<SerializerPluginSerializeResultType>;
    Constructor: Function | string;
    targetType: Uint8Array;
}

export type SerializerPluginType<T> = SerializerPluginTypeF<T> | SerializerPluginTypeC<T>;