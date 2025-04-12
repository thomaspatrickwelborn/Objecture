console.log("------")
console.log("assign")
console.log("------")
import { Model, Schema } from '/dependencies/objecture.js'
import ComplexObjectA from '../../sets/complex-object-a/index.js'
function eventLog($event) { console.log($event.type, $event.path) }
const model = new Model(ComplexObjectA, null, {
  events: { '** assignSourceProperty': eventLog },
  assignObject: 'assign',
  assignArray: 'assign',
  enableEvents: true,
})
const object = Object.create(Object.prototype, Object.getOwnPropertyDescriptors(ComplexObjectA))
const modelString = model.toString({ space: 2 })
const objectString = JSON.stringify(object, null, 2)
console.log("modelString", modelString)
console.log("objectString", objectString)
console.log(modelString === objectString)
