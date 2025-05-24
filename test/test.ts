import { Serializer, Deserializer } from "../lib/bobj";
import testObj from "./testObj";

export default async function test() {

    const serializer = new Serializer();

    const deserializer = new Deserializer();

    const obj = testObj

    const uint8array = (await serializer.serialize(obj))!;

    console.log(uint8array);

    const res = await deserializer.deserialize(uint8array);

    console.log(res); 

    return res;
}