import { Serializer, Deserializer } from "../lib/bobj";
import testObj from "./testObj";
import { generateTestObj } from "./generateTestObj";

export default async function test() {

    const serializer = new Serializer();

    const deserializer = new Deserializer();

    const obj = 0 ? testObj : generateTestObj(12);

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