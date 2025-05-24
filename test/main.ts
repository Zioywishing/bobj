import test from "./test"

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    obj 2 uint8array
  </div>
`

test()