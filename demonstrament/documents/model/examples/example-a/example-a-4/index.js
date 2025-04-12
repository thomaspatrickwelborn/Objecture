console.log("----------------")
console.log("defineProperties")
console.log("----------------")
import { Model, Schema } from '/dependencies/objecture.js'
import ComplexObjectA from '../../sets/complex-object-a/index.js'
import ComplexObjectB from '../../sets/complex-object-b/index.js'
function eventLog($event) { console.log($event.type, $event.path) }
const model = new Model(ComplexObjectB, null, {
  events: { '** defineProperty': eventLog },
  enableEvents: true,
  assignArray: 'defineProperties',
  assignObject: 'defineProperties',
})
console.log("ComplexObjectA", ComplexObjectA)
const object = Object.create(Object.prototype, Object.getOwnPropertyDescriptors(ComplexObjectA))
const modelString = model.toString({ space: 2 })
const objectString = JSON.stringify(object, null, 2)
console.log("modelString", modelString)
console.log("objectString", objectString)
console.log(modelString === objectString)
