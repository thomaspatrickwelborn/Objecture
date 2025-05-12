console.log(`
----------------
defineProperties
----------------
Example 1.
`)
import { Model, Schema } from '/dependencies/objecture.js'
function eventLog($event) { console.log($event.type, $event.path) }
const schema = new Schema({
  propertyA: { type: {
    propertyB: { type: {
      propertyC: { type: Boolean }
    } }
  } },
  propertyD: { type: [{ type: {
    propertyE: { type: {
      propertyF: { type: Number },
      propertyE: { type: {
        propertyFFF: { type: Number }
      } }
    } }
  } }] },
  propertyG: { type: String },
  propertyH: { type: null },
  propertyI: { type: undefined },
})
const object = {
  propertyA: { enumerable: true, writable: true, value: {
    propertyB: { enumerable: true, writable: true, value: {
      propertyC: { enumerable: true, writable: true, value: true }
    } }
  } },
  propertyD: { enumerable: true, value: [{ enumerable: true, value: {
    propertyE: { enumerable: true, value: {
      propertyF: { enumerable: true, value: 1, writable: true },
      propertyE: { enumerable: true, value: {
        propertyFFF: { enumerable: true, value: 1 }
      } }
    } }
  } }] },
  propertyG: { writable: true, enumerable: true, value: "true" },
  propertyH: { writable: true, enumerable: true, value: null },
  propertyI: { writable: true, enumerable: true, value: "one" },
}
const model = new Model(object, schema, {
  assignArray: 'defineProperties',
  assignObject: 'defineProperties',
})
console.log(model.toString({ replacer: null, space: 2 }))
