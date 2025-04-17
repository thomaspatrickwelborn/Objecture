console.log("------------")
console.log("Example C.2.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
/*
const schemaA = new Schema({
  propertyA: { propertyB: { propertyC: Number } },
  propertyD: { propertyE: Number },
  propertyF: Number
}, { required: true })

console.log("---------------")
const validationC5 = schemaA.validate({
  propertyA: { propertyB: { propertyC: 333 } },
  propertyD: { propertyE: 555 },
  propertyF: 666
})
console.log(validationC5.valid, "Validation C.5.")
validationC5.report()

console.log("---------------")
const validationC6 = schemaA.validate({
  propertyA: { propertyB: { propertyC: "333" } },
  propertyD: { propertyE: 555 },
  propertyF: 666
})
console.log(validationC6.valid, "Validation C.6.")
validationC6.report()
*/
const schemaB = new Schema({
  propertyA: { propertyB: { propertyC: Number } },
  propertyD: { propertyE: Number },
  propertyF: Number
}, { required: true })

console.log("---------------")
const validationC7 = schemaB.validate({
  propertyA: { propertyB: { propertyC: 333 } },
  propertyD: { propertyE: 555 },
  propertyF: 666
})
console.log(validationC7.valid, "Validation C.7.")
validationC7.report()

console.log("---------------")
const validationC8 = schemaB.validate({
  propertyA: { propertyB: { propertyC: "333" } },
  propertyD: { propertyE: 555 },
  propertyF: 666
})
console.log(validationC8.valid, "Validation C.8.")
validationC8.report()