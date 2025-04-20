console.log("------------")
console.log("Example D.1.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
const contentA = {
  propertyA: true,
  propertyB: { propertyC: false },
  propertyD: [
    { propertyE: true, propertyF: false },
    { propertyE: false, },
  ],
}
const contentB = {
  propertyA: true,
  propertyB: { propertyC: false },
  propertyD: [
    { propertyE: true,  },
    { propertyE: false, },
  ],
}
const schema = new Schema({
  propertyA: { type: Boolean },
  propertyB: { propertyC: { type: Boolean } },
  propertyD: [{
    propertyE: { required: true, type: Boolean },
    propertyF: { required: true, type: Boolean }
  }],
}, { required: true })
const contentAValidation = schema.validate(contentA)
contentAValidation.report()
// const modelA = new Model(contentA, schema, { assignArray: 'set', assignObject: 'set' })
// console.log(modelA.valueOf())
const modelB = new Model(contentB, schema, { assignObject: 'set' })
console.log(modelB.valueOf())
