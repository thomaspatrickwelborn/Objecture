console.log("-----------")
console.log("unshiftProp")
console.log("-----------")
function recursiveReverse($object) {
  if(!$object) return $object
  const object = (Array.isArray($object)) ? $object.slice().reverse() : Object.create(Object.prototype, Object.getOwnPropertyDescriptors($object))
  for(const [$propertyKey, $propertyValue] of Object.entries(object)) {
    if(typeof $propertyValue === 'object') {
      object[$propertyKey] = recursiveReverse($propertyValue)
    }
    else { object[$propertyKey] = $propertyValue }
  }
  return object
}
import { Model, Schema } from '/dependencies/objecture.js'
import ComplexArrayA from '../../sets/complex-array-a/index.js'
function eventLog($event) { console.log($event.type, $event.path) }
const model = new Model(ComplexArrayA, null, {
  events: { '** unshiftProp': eventLog },
  assignArray: 'unshift',
  assignObject: 'set', 
  enableEvents: true,
})
const array = recursiveReverse(ComplexArrayA)
array.reverse()
const modelString = model.toString({ space: 2 })
const arrayString = JSON.stringify(array, null, 2)
console.log("modelString", modelString)
console.log("arrayString", arrayString)
console.log(modelString === arrayString)
