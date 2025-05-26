import type { SerializerPluginSerializeResultType } from "../types/serializerPlugin";

export default function* iterateUint8Arrays(
    result: SerializerPluginSerializeResultType
): Generator<Uint8Array> {
    if (result instanceof Uint8Array) {
        yield result;
        return;
    } else {
        for (const item of result) {
            yield* iterateUint8Arrays(item);
        }
    }
}