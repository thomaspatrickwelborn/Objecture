console.log(`
--------------------
Property Definitions
--------------------
Example 2.
 - Property Definition Format: Impand
 - Type: Some Valid
`)
import { compandTree } from '/dependencies/recourse.js'
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
        propertyJ: [Number], // NONVALID
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
      propertyC: true,
      propertyD: 4,
      propertyE: "Five",
    },
  },
  propertyF: [{
    propertyG: {
      propertyH: {
        propertyI: true,
        propertyJ: [10, "100", 1000], // [VALID, NONVALID, VALID]
        propertyK: "Eleven",
      },
      propertyL: false,
      propertyM: [[{
        propertyN: "Fourteen",
      }, { // NONVALID
        propertyN: 14, 
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
      propertyO: "-15", // NONVALID
    },
  }],
  propertyP: 16, // NONVALID
  propertyQ: null,
  propertyR: "Eighteen",
}
const validation = schema.validate(object)
const report = validation.report("impand")
const reportDirectory = Object.fromEntries(compandTree(report, { values: true }))
console.log('validation', validation)
console.log('report', report)
console.log('reportDirectory', reportDirectory)
console.log("pass", (
  reportDirectory["propertyA.propertyB.propertyC"] === true  &&
  reportDirectory["propertyA.propertyB.propertyD"] === true  &&
  reportDirectory["propertyA.propertyB.propertyE"] === true  &&
  reportDirectory["propertyF.0.propertyG.propertyH.propertyI"] === true  &&
  reportDirectory["propertyF.0.propertyG.propertyH.propertyJ.0"] === true  &&
  reportDirectory["propertyF.0.propertyG.propertyH.propertyJ.1" ]=== false  &&
  reportDirectory["propertyF.0.propertyG.propertyH.propertyJ.2"] === true  &&
  reportDirectory["propertyF.0.propertyG.propertyH.propertyK"] === true  &&
  reportDirectory["propertyF.0.propertyG.propertyL"] === true  &&
  reportDirectory["propertyF.0.propertyG.propertyM.0.0.propertyN"] === true  &&
  reportDirectory["propertyF.0.propertyG.propertyM.0.1" ]=== false  &&
  reportDirectory["propertyF.0.propertyG.propertyO"] === true  &&
  reportDirectory["propertyF.1.propertyG.propertyH.propertyI"] === true  &&
  reportDirectory["propertyF.1.propertyG.propertyH.propertyJ.0"] === true  &&
  reportDirectory["propertyF.1.propertyG.propertyH.propertyJ.1"] === true  &&
  reportDirectory["propertyF.1.propertyG.propertyH.propertyJ.2"] === true  &&
  reportDirectory["propertyF.1.propertyG.propertyH.propertyK"] === true  &&
  reportDirectory["propertyF.1.propertyG.propertyL"] === true  &&
  reportDirectory["propertyF.1.propertyG.propertyM.0.0.propertyN"] === true  &&
  reportDirectory["propertyF.1.propertyG.propertyO" ]=== false  &&
  reportDirectory["propertyQ"] === true  &&
  reportDirectory["propertyR"] === true  &&
  reportDirectory["propertyP"] === false
))
