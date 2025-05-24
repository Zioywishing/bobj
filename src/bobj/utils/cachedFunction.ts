export default function cachedFunction<Argus extends any[], Return>(func: (...argu: Argus) => Return): (argus: Argus, key?: any) => Return {
    const cache = new Map<any, any>();
    return function (argus, key) {
        key = key || argus[0];
        // console.log(`key: ${key}`);
        if (cache.has(key)) {
            // console.log(`cached: ${key}`);
            return cache.get(key);
        } else {
            const result = func(...argus);
            cache.set(key, result);
            return result;
         }
    };
}