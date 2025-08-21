import test from "./test"

const main = async () => {

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      b
    </div>
  `

  test()

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      f
    </div>
  `
}
// console.time('start')
// for(let i = 0; i < 10000; i++) {
//     new Uint8Array(3)
// }
// console.timeEnd('start')
main()