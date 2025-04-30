console.log(`
------------------------------
Schema Validators Example A.1.
------------------------------
 - Impanded Schema Property Definition Tree
   - Type Validators
 - No Options
`)
import { Schema } from '/dependencies/objecture.js'
const schema = new Schema({
  propertyA: {
    propertyB: {
      propertyC: String,
      propertyCC: Number,
    },
    propertyBB: Number,
  },
  propertyD: [{
    propertyE: {
      propertyE: {
        propertyFFF: Boolean
      },
      propertyF: Boolean
    }
  }],
  propertyG: Number
})
const object = {
  propertyA: {
    propertyB: {
      propertyC: "true",
      propertyCC: -33,
    },
    propertyBB: 33,
  },
  propertyD: [{
    propertyE: {
      propertyE: {
        propertyFFF: false
      },
      propertyF: true
    }
  }],
  propertyG: 0, 
  propertyGG: false,
}
const validation = schema.validate(object)
const expandReport = validation.report()
const impandReport = validation.report('impand')
console.log("schema", schema)
console.log("object", object)
console.log("validation", validation)
console.log("expandReport", expandReport)
console.log("impandReport", JSON.stringify(impandReport, null, 2))
console.log("valid", (
  impandReport.propertyA.propertyB.propertyC === true &&
  impandReport.propertyA.propertyB.propertyCC === true &&
  impandReport.propertyA.propertyBB === true &&
  impandReport.propertyD[0].propertyE.propertyE.propertyFFF === true &&
  impandReport.propertyD[0].propertyE.propertyF === true &&
  impandReport.propertyG === true &&
  impandReport.propertyGG === false
))