console.log(`
----------------
PropertyDefinitions
----------------
Example 2.
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