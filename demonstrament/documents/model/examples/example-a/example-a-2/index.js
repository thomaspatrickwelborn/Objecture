console.log("--------")
console.log("pushProp")
console.log("--------")
function recursiveSlice($object) {
  if(!$object) return $object
  const object = (Array.isArray($object)) ? $object.slice() : Object.create(Object.prototype, Object.getOwnPropertyDescriptors($object))
  for(const [$propertyKey, $propertyValue] of Object.entries(object)) {
    if(typeof $propertyValue === 'object') {
      object[$propertyKey] = recursiveSlice($propertyValue)
    }
    else { object[$propertyKey] = $propertyValue }
  }
  return object
}
import { Model, Schema } from '/dependencies/objecture.js'
import ComplexArrayA from '../../../sets/complex-array-a/index.js'
function eventLog($event) { console.log($event.type, $event.path) }
const model = new Model(ComplexArrayA, null, {
  events: { '** pushProp': eventLog },
  assignArray: 'push',
  assignObject: 'set', 
  enableEvents: true,
})
const array = recursiveSlice(ComplexArrayA)
const modelString = model.toString({ space: 2 })
const arrayString = JSON.stringify(array, null, 2)
console.log("modelString", modelString)
console.log("arrayString", arrayString)
console.log(modelString === arrayString)
