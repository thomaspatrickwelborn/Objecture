console.log("-----------")
console.log("fillIndex")
console.log("-----------")
import { Model, Schema } from '/dependencies/objecture.js'
import ComplexObjectA from '../../sets/complex-object-a/index.js'
const object = Object.create(Object.prototype, Object.getOwnPropertyDescriptors(ComplexObjectA)) 
function eventLog($event) { console.log($event.type, $event.path) }
const array = new Model([], null, {
  events: { '** fillIndex': eventLog },
  enableEvents: true,
})
array.length = 3
array.fill(object)
console.log(array)