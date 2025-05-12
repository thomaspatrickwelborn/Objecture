console.log(`
--------------------
Property Definitions
--------------------
Example 1.
 - Impand Property Definitions
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
  propertyP: "Sixteen",
  propertyQ: null,
  propertyR: 18,
}
const objectB = {
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
      }, {
        propertyN: 14, // NONVALID
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

// console.log(propertyDirectoryValues(objectB))
console.log(propertyDirectory(objectB))
console.log(Object.fromEntries(propertyDirectory(objectB, { values: true })))
// console.log(propertyDirectory(objectB, { values: true }))
// console.log(Object.fromEntries(propertyDirectory(objectB, { values: true })))
/*
const objectAValidation = schema.validate(objectA)
const objectAValidationReport = objectAValidation.report("impand")
console.log("objectAValidationReport", objectAValidationReport)

const objectBValidation = schema.validate(objectB)
const objectBValidationReport = objectBValidation.report("impand")
console.log("objectBValidationReport", objectBValidationReport)
*/