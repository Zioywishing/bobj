import Deserializer from "./bobj/Deserializer";
import { Serializer } from "./bobj/index";
import testObj from "./testObj";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    obj 2 uint8array
  </div>
`


async function test() {

  const serializer = new Serializer();

  const deserializer = new Deserializer();

  const obj = testObj

  const uint8array = (await serializer.serialize(obj))!;

  console.log(uint8array);

  const res = await deserializer.deserialize(uint8array);

  console.log(res);
}

test();