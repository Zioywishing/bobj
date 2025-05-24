import type Binarizer from "../Binarizer";

export type BinarizerPluginType<T> = {
    binarize(props: {
        target: T,
        binarizer: Binarizer,
    }): Uint8Array | Promise<Uint8Array>;
    filter: (targetObject: any) => boolean;
    targetTypeString: string;
}