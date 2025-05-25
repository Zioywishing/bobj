import { Serializer, Deserializer } from "../lib/bobj";
import testObj from "./testObj";
import { generateTestObj_deep, generateTestObj_data } from "./generateTestObj";

export default async function test() {

    const serializer = new Serializer();

    const deserializer = new Deserializer();

    const testType: number = 2

    const obj = (() => {
        switch (testType) {
            case (1): {
                return generateTestObj_deep(10)
            }
            case (2): {
                return generateTestObj_data(() => new Uint8Array(100 << 20), 100)
            }
            case (3): {
                return {
                    1: {
                        1: 1
                    }
                }
            }
            default: {
                return testObj
            }
        }
    })()

    console.log({
        testData: obj
    })

    console.time("serializer")

    const uint8array = (await serializer.serialize(obj))!;

    console.timeEnd("serializer")

    console.log(uint8array)

    console.time("deserializer")

    const res = await deserializer.deserialize(uint8array);

    console.timeEnd("deserializer")

    console.log(uint8array);

    console.log(res);

    return res;
}