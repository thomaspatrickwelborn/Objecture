console.log(`
------------------------------
Schema Validators Example A.3.
------------------------------
 - Impanded Schema Property Definition Tree
   - Type Validator
 - $options.required: true
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
}, { required: true })
const object = {
  propertyA: {
    propertyB: {
      propertyCC: -33
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
const impandReport = validation.report('impand')
const expandReport = validation.report()
console.log("schema", schema)
console.log("object", object)
console.log("validation", validation)
console.log("expandReport", expandReport)
console.log("impandReport", JSON.stringify(impandReport, null, 2))
console.log("valid", (
  impandReport.propertyA.propertyB.propertyCC === true &&
  impandReport.propertyA.propertyBB === true &&
  impandReport.propertyD[0].propertyE.propertyE.propertyFFF === true &&
  impandReport.propertyD[0].propertyE.propertyF === true &&
  impandReport.propertyG === true &&
  impandReport.propertyGG === false
))