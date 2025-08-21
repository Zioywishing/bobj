import { Serializer, Deserializer } from "../lib/bobj";
import testObj from "./testObj";
import { generateTestObj_deep, generateTestObj_data, genBigObj } from "./generateTestObj";
// import { fastU8iArr } from "../lib/bobj";

export default async function test() {

    const serializer = new Serializer({
        sync: true,
    });

    const deserializer = new Deserializer({
        sync: true,
    });

    // const f = () => 1
    // const af = async () => 1
    // console.time("test1")
    // for (let i = 0; i < 1000000; i++) {
    //     f()
    // }
    // console.timeEnd("test1")

    // console.time("test2")
    // for (let i = 0; i < 1000000; i++) {
    //     await af()
    // }
    // console.timeEnd("test2")

    // console.time("test3")
    // for (let i = 0; i < 1000000; i++) {
    //     new Uint8Array(3).fill(1)
    // }
    // console.timeEnd("test3")

    // console.time("test4")
    // for (let i = 0; i < 1000000; i++) {
    //     new Uint8Array(10000)
    // }
    // console.timeEnd("test4")

    // const _a = new Array(10000).fill(new Uint8Array(10))


    // console.time("test5")
    // for (let i = 0; i < 100; i++) {
    //     new Blob(_a)
    // }
    // console.timeEnd("test5")

    // console.time("test6")
    // for (let i = 0; i < 100; i++) {
    //     await new Blob(_a).arrayBuffer()
    // }
    // console.timeEnd("test6")



    // console.time("test7")
    // for (let i = 0; i < 100; i++) {
    //     new Uint8Array(await new Blob(_a).arrayBuffer())
    // }
    // console.timeEnd("test7")

    // deserializer.registerPlugin(fastU8iArr)

    const testType: number = 1

    const obj = (() => {
        switch (testType) {
            case (1): {
                return generateTestObj_deep(3)
            }
            case (2): {
                return generateTestObj_data(() => new Uint8Array([1, 2, 3, 4]), 0)
            }
            case (3): {
                return genBigObj(100000)
            }
            case (4): {
                return { a: new Array(17).fill(1) }
            }
            default: {
                return testObj
            }
        }
    })()

    console.log(obj)

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