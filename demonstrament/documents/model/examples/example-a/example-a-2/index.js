import { Model, Schema } from '/dependencies/objecture.js'
import ComplexObjectA from '../../sets/complex-object-a/index.js'
function eventLog($event) { console.log($event.type, $event.path) }
const model = new Model(ComplexObjectA, null, {
  events: { '** pushProp': eventLog },
  assignArray: 'push',
  assignObject: 'set', 
  enableEvents: true,
})
const object = Object.create(Object.prototype, Object.getOwnPropertyDescriptors(ComplexObjectA))
const modelString = model.toString({ space: 2 })
const objectString = JSON.stringify(object, (
  key, value
) => typeof value === 'bigint' ? value.toString() : value, 2)
console.log(modelString, objectString)
console.log(modelString === objectString)
