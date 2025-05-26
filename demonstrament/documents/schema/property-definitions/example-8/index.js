console.log(`
--------------------
Property Definitions
--------------------
Example 8.
 - Property Definition Format: Impand
 - Type: All Terminal Objects Empty
`)
import { propertyDirectory, typeOf } from '/dependencies/recourse.js'
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
const object = {
  propertyA: {
    propertyB: {},
  },
  propertyF: [{
    propertyG: {
      propertyH: {
        propertyJ: [],
      },
      propertyM: [[{}]],
    },
  }, {
    propertyG: {
      propertyH: {
        propertyJ: [],
      },
      propertyM: [[{}]],
    },
  }],
}
const validation = schema.validate(object)
const report = validation.report("impand")
const reportDirectory = Object.fromEntries(propertyDirectory(report, { values: true }))
console.log('validation', validation)
console.log('report', report)
console.log('reportDirectory', reportDirectory)
console.log("pass", (
  typeOf(reportDirectory["propertyA"]) === 'object' &&
  typeOf(reportDirectory["propertyA.propertyB"]) === 'object' &&
  typeOf(reportDirectory["propertyF"]) === 'array' &&
  typeOf(reportDirectory["propertyF.0"]) === 'object' &&
  typeOf(reportDirectory["propertyF.0.propertyG"]) === 'object' &&
  typeOf(reportDirectory["propertyF.0.propertyG.propertyH"]) === 'object' &&
  typeOf(reportDirectory["propertyF.0.propertyG.propertyH.propertyJ"]) === 'array' &&
  typeOf(reportDirectory["propertyF.0.propertyG.propertyM"]) === 'array' &&
  typeOf(reportDirectory["propertyF.0.propertyG.propertyM.0"]) === 'array' &&
  typeOf(reportDirectory["propertyF.0.propertyG.propertyM.0.0"]) === 'object' &&
  typeOf(reportDirectory["propertyF.1"]) === 'object' &&
  typeOf(reportDirectory["propertyF.1.propertyG"]) === 'object' &&
  typeOf(reportDirectory["propertyF.1.propertyG.propertyH"]) === 'object' &&
  typeOf(reportDirectory["propertyF.1.propertyG.propertyH.propertyJ"]) === 'array' &&
  typeOf(reportDirectory["propertyF.1.propertyG.propertyM"]) === 'array' &&
  typeOf(reportDirectory["propertyF.1.propertyG.propertyM.0"]) === 'array' &&
  typeOf(reportDirectory["propertyF.1.propertyG.propertyM.0.0"]) === 'object'
))
