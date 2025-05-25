import { Serializer, Deserializer } from "../lib/bobj";
import testObj from "./testObj";
import { generateTestObj_deep, generateTestObj_length } from "./generateTestObj";

export default async function test() {

    const serializer = new Serializer();

    const deserializer = new Deserializer();

    const testType: number = 2

    const obj = (() => {
        switch (testType) {
            case (1): {
                return generateTestObj_deep(12)
            }
            case (2): {
                return generateTestObj_length(1 << 20, 5)
            }
            default: {
                return testObj
            }
        }
    })()

    console.time("serializer")

    const uint8array = (await serializer.serialize(obj))!;

    console.timeEnd("serializer")

    console.time("deserializer")

    const res = await deserializer.deserialize(uint8array);

    console.timeEnd("deserializer")

    console.log(uint8array);

    console.log(res);

    return res;
}