console.log("----------------")
console.log("defineProperties")
console.log("----------------")
import { Model } from '/dependencies/objecture.js'
import ComplexObjectB from '../../sets/complex-object-b/index.js'
function eventLog($event) { console.log($event.type, $event.path) }
// console.log(ComplexObjectB)
// console.log(new Model(ComplexObjectB, null, {
//   assignObject: 'defineProperties',
//   assignArray: 'defineProperties', 
// }).valueOf())
const object = new Model({
  propertyA: { writable: true, enumerable: true, value: {
    propertyB: { writable: true, enumerable: true, value: {
      propertyC: { writable: true, enumerable: true, value: true }
    } }
  } },
  propertyD: { enumerable: true, value: [{ enumerable: true, value: {
    propertyE: { enumerable: true, value: {
      propertyF: { writable: true, enumerable: true, value: 1 },
      propertyE: { enumerable: true, value: {
        propertyFFF: { enumerable: true, value: 1 }
      } }
    } }
  } }] },
  propertyG: { writable: true, enumerable: true, value: "true" }
}, null, {
  assignArray: 'defineProperties',
  assignObject: 'defineProperties',
})
console.log(object.toString({ replacer: null, space: 2 }))