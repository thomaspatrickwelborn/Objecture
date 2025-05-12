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
      propertyD: Number,
      propertyE: String,
    },
  },
  propertyF: [{
    propertyG: {
      propertyH: {
        propertyI: Boolean,
        propertyJ: [Number],
        propertyK: String,
      },
      propertyL: Boolean,
      propertyM: [[{
        propertyN: String,
      }]],
      propertyO: Number,
    },
  }],
  propertyP: String,
  propertyQ: null,
  propertyR: undefined,
})
// Valid: All
const objectA = {
  propertyA: {
    propertyB: {
      propertyC: true,
      propertyD: 4,
      propertyE: "Five",
    },
  },
  propertyF: [{
    propertyG: {
      propertyH: {
        propertyI: true,
        propertyJ: [10, 100, 1000],
        propertyK: "Eleven",
      },
      propertyL: false,
      propertyM: [[{
        propertyN: "Fourteen",
      }]],
      propertyO: 15,
    },
  }, {
    propertyG: {
      propertyH: {
        propertyI: false,
        propertyJ: [-10, -100, -1000],
        propertyK: "Negative Eleven",
      },
      propertyL: true,
      propertyM: [[{
        propertyN: "Negative Fourteen",
      }]],
      propertyO: -15,
    },
  }],
  propertyP: String,
  propertyQ: null,
  propertyR: undefined,
}
console.log(schema.validate(objectA))