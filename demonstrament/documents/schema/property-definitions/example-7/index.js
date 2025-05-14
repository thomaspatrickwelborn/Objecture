console.log(`
--------------------
Property Definitions
--------------------
Example 7.
 - Property Definition Format: Impand
 - Type: All Primitives Nonvalid
`)
import { Coutil } from '/dependencies/core-plex.js'
import { Model, Schema } from '/dependencies/objecture.js'
const { propertyDirectory } = Coutil
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
const object = {
  propertyA: {
    propertyB: {
      propertyC: "true",
      propertyD: "Four",
      propertyE: 5,
    },
  },
  propertyF: [{
    propertyG: {
      propertyH: {
        propertyI: "true",
        propertyJ: ["Ten", "One Hundred", "One Thousand"],
        propertyK: 11,
      },
      propertyL: "false",
      propertyM: [[{
        propertyN: 14,
      }]],
      propertyO: "Fifteen",
    },
  }, {
    propertyG: {
      propertyH: {
        propertyI: "false",
        propertyJ: ["Negative Ten", "Negative One Hundred", "Negative One Thousand"],
        propertyK: -11,
      },
      propertyL: "true",
      propertyM: [[{
        propertyN: -14,
      }]],
      propertyO: "Negative Fifteen",
    },
  }],
  propertyP: 16,
  propertyQ: "null",
}
const validation = schema.validate(object)
const report = validation.report("impand")
const reportDirectory = Object.fromEntries(propertyDirectory(report, { values: true }))
console.log('validation', validation)
console.log('report', report)
console.log('reportDirectory', reportDirectory)
console.log("pass", (
  report === false
))
