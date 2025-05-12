console.log(`
--------------------
Property Definitions
--------------------
Example 1.
 - Impand Property Definitions
`)
import { Model, Schema } from '/dependencies/objecture.js'
function eventLog($event) { console.log($event.type, $event.path) }
const schema = new Schema({
  propertyA: {
    propertyB: {
      propertyC: Boolean,
    },
  },
  propertyD: [{
    propertyE: {
      propertyF: Number,
      propertyE: {
        propertyFFF: Number,
      },
    },
  }],
  propertyG: String,
  propertyH: null,
  propertyI: undefined,
})