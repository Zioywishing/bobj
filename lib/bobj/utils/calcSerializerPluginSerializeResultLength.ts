import type { SerializerPluginSerializeResultType } from "../types/serializerPlugin"

const calcValueLengthCache = new WeakMap<SerializerPluginSerializeResultType, number>()

const calcSerializerPluginSerializeResultLength = (target: SerializerPluginSerializeResultType): number => {
    if (target instanceof Uint8Array) {
        return target.length
    } else {
        if(calcValueLengthCache.has(target)) {
            return calcValueLengthCache.get(target)!
        }
        const length = target.reduce((curr, item) => curr + calcSerializerPluginSerializeResultLength(item), 0)
        calcValueLengthCache.set(target, length)
        return length
    }
}

export default calcSerializerPluginSerializeResultLength