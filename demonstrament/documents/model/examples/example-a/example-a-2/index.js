console.log("--------")
console.log("pushProp")
console.log("--------")
import { Model, Schema } from '/dependencies/objecture.js'
import ComplexArrayA from '../../sets/complex-array-a/index.js'
function eventLog($event) { console.log($event.type, $event.path) }
const model = new Model(ComplexArrayA, null, {
  events: { '** pushProp': eventLog },
  assignArray: 'push',
  assignObject: 'set', 
  enableEvents: true,
})
const object = Object.create(Object.prototype, Object.getOwnPropertyDescriptors(ComplexArrayA))
const modelString = model.toString({ space: 2 })
const objectString = JSON.stringify(object, null, 2)
console.log("modelString", modelString)
console.log("objectString", objectString)
console.log(modelString === objectString)
