console.log(`
--------------------
Property Definitions
--------------------
Example 3.
 - Property Definition Format: Expand
 - Type: All Valid
`)
import { propertyDirectory } from '/dependencies/recourse.js'
import { Model, Schema } from '/dependencies/objecture.js'
function eventLog($event) { console.log($event.type, $event.path) }
const schema = new Schema({
  propertyA: { type: {
    propertyB: { type: {
      propertyC: { type: Boolean },
      propertyD: { type: Number },
      propertyE: { type: String },
    } },
  } },
  propertyF: { type: [{
    propertyG: { type: {
      propertyH: { type: {
        propertyI: { type: Boolean },
        propertyJ: { type: [{ type: Number }] },
        propertyK: { type: String },
      } },
      propertyL: { type: Boolean },
      propertyM: { type: [{ type: [{ type: {
        propertyN: { type: String },
      } }] }] },
      propertyO: { type: Number },
    } },
  }] },
  propertyP: { type: String },
  propertyQ: { type: null },
  propertyR: { type: undefined },
})
const object = {
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
  propertyP: "Sixteen",
  propertyQ: null,
  propertyR: 18,
}
const validation = schema.validate(object)
const report = validation.report("impand")
const reportDirectory = Object.fromEntries(propertyDirectory(report, { values: true }))
console.log('validation', validation)
console.log('report', report)
console.log('reportDirectory', reportDirectory)
console.log("pass", (
  reportDirectory["propertyA.propertyB.propertyC"] === true &&
  reportDirectory["propertyA.propertyB.propertyD"] === true &&
  reportDirectory["propertyA.propertyB.propertyE"] === true &&
  reportDirectory["propertyF.0.propertyG.propertyH.propertyI"] === true &&
  reportDirectory["propertyF.0.propertyG.propertyH.propertyJ.0"] === true &&
  reportDirectory["propertyF.0.propertyG.propertyH.propertyJ.1"] === true &&
  reportDirectory["propertyF.0.propertyG.propertyH.propertyJ.2"] === true &&
  reportDirectory["propertyF.0.propertyG.propertyH.propertyK"] === true &&
  reportDirectory["propertyF.0.propertyG.propertyL"] === true &&
  reportDirectory["propertyF.0.propertyG.propertyM.0.0.propertyN"] === true &&
  reportDirectory["propertyF.0.propertyG.propertyO"] === true &&
  reportDirectory["propertyF.1.propertyG.propertyH.propertyI"] === true &&
  reportDirectory["propertyF.1.propertyG.propertyH.propertyJ.0"] === true &&
  reportDirectory["propertyF.1.propertyG.propertyH.propertyJ.1"] === true &&
  reportDirectory["propertyF.1.propertyG.propertyH.propertyJ.2"] === true &&
  reportDirectory["propertyF.1.propertyG.propertyH.propertyK"] === true &&
  reportDirectory["propertyF.1.propertyG.propertyL"] === true &&
  reportDirectory["propertyF.1.propertyG.propertyM.0.0.propertyN"] === true &&
  reportDirectory["propertyF.1.propertyG.propertyO"] === true &&
  reportDirectory["propertyP"] === true &&
  reportDirectory["propertyQ"] === true &&
  reportDirectory["propertyR"] === true
))
