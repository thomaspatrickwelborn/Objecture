console.log(`
--------------------
Property Definitions
--------------------
Example 6.
 - Property Definition Format: Expand
 - Type: All Valid
 - Required: Some Required
`)
import { Coutil } from '/dependencies/core-plex.js'
import { Model, Schema } from '/dependencies/objecture.js'
const { propertyDirectory } = Coutil
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
        propertyJ: { required: true, type: [{ type: Number }] },
        propertyK: { type: String },
      } },
      propertyL: { type: Boolean },
      propertyM: { type: [{ type: [{ type: {
        propertyN: { type: String },
      } }] }] },
      propertyO: { required: true, type: Number },
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
      propertyH: { // NONVALID
        propertyI: true,
        propertyJ: ["10", "100", "1000"], // NONVALID
        propertyK: "Eleven",
      },
      propertyL: false,
      propertyM: [[{
        propertyN: "Fourteen",
      }, { 
        propertyN: 14, 
      }]],
      propertyO: 15,
    },
  }, { // NONVALID
    propertyG: { // NONVALID
      propertyH: {
        propertyI: false,
        propertyJ: [-10, -100, -1000],
        propertyK: "Negative Eleven",
      },
      propertyL: true,
      propertyM: [[{
        propertyN: "Negative Fourteen",
      }]],
      propertyO: "-15", // NONVALID
    },
  }],
  propertyP: 16, 
  propertyQ: null,
  propertyR: "Eighteen",
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
  reportDirectory["propertyF.0.propertyG.propertyL"] === true &&
  reportDirectory["propertyF.0.propertyG.propertyM.0.0.propertyN"] === true &&
  reportDirectory["propertyF.0.propertyG.propertyM.0.1"] === false &&
  reportDirectory["propertyF.0.propertyG.propertyO"] === true &&
  reportDirectory["propertyF.0.propertyG.propertyH"] === false &&
  reportDirectory["propertyF.1"] === false &&
  reportDirectory["propertyQ"] === true &&
  reportDirectory["propertyR"] === true &&
  reportDirectory["propertyP"] === false
))
