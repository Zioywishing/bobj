import Debinarizer from "./bobj/Debinarizer";
import { Binarizer } from "./bobj/index";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    obj 2 uint8array
  </div>
`


async function test() {
  
  const binarizer = new Binarizer();

  const obj = {
    a: 1,
    b: "2",
    c: new Uint8Array([1, 2, 3]),
    d: [{
      e: 4,
      f: "5",
      g: new Uint8Array([4, 5, 6]),
    }, false, [1, 2, undefined, null, 5, "6", new Uint8Array([7, 8, 9])]]
  }

  const uint8array = (await binarizer.binarize(obj))!;
  console.log(uint8array);

  const debinarizer = new Debinarizer();

  const res = await debinarizer.debinarize(uint8array);

  console.log(res);
}

test();