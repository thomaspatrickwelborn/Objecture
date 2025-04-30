console.log(`
------------------------------
Schema Validators Example A.2.
------------------------------
 - Expanded Schema Property Definition Tree
   - Type, Required Validators (Some Required)
 - No Options
`)
import { Schema } from '/dependencies/objecture.js'
const schema = new Schema({
  propertyA: {
    propertyB: {
      propertyC: { type: String, required: true }, 
      propertyCC: { type: Number, required: false },
    },
    propertyBB: { type: Number, required: false }
  },
  propertyD: [{
    propertyE: {
      propertyE: {
        propertyFFF: { required: false, type: Boolean }
      },
      propertyF: { required: true, type: Boolean }
    }
  }],
  propertyG: { type: Number }
})
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
console.log("validation", validation)
console.log("expandReport", expandReport)
console.log("impandReport", JSON.stringify(impandReport, null, 2))
console.log("valid", (
  impandReport.propertyA.propertyB === false &&
  impandReport.propertyA.propertyBB === true &&
  impandReport.propertyD[0].propertyE.propertyE.propertyFFF === true &&
  impandReport.propertyD[0].propertyE.propertyF === true &&
  impandReport.propertyG === true &&
  impandReport.propertyGG === false
))