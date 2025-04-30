console.log(`
------------------------------
Schema Validators Example A.4.
------------------------------
 - Expanded Schema Property Definition Tree
   - Type, Required Validators (Some Required)
 - Mixed Valid, Nonvalid Array Values
 - No Options
`)
import { Model, Schema } from '/dependencies/objecture.js'
const schema = new Schema({
  propertyA: {
    propertyB: {
      propertyC: { type: String, required: true }, 
      propertyCC: Number,
    },
    propertyBB: Number
  },
  propertyD: [{
    propertyE: {
      propertyE: {
        propertyFFF: Boolean
      },
      propertyF: { required: true, type: Boolean }
    }
  }],
  propertyG: Number
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
  }, {
    propertyE: {
      propertyE: {
        propertyFFF: true 
      },
    },
  }],
  propertyG: 0, 
  propertyGG: false, 
}
const model = new Model(object, schema)
const validation = schema.validate(object)
const impandReport = validation.report('impand')
const expandReport = validation.report()
console.log("model", model.valueOf())
console.log("schema", schema)
console.log("object", object)
console.log("validation", validation)
console.log("expandReport", expandReport)
console.log("impandReport", JSON.stringify(impandReport, null, 2))
console.log("valid", (
  impandReport.propertyA.propertyB === false &&
  impandReport.propertyA.propertyBB === true &&
  impandReport.propertyD[0].propertyE.propertyE.propertyFFF === true &&
  impandReport.propertyD[0].propertyE.propertyF === true &&
  impandReport.propertyD[1] === false &&
  impandReport.propertyG === true &&
  impandReport.propertyGG === false

))