console.log("------------")
console.log("Example C.1.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
const schemaC = new Schema({
  propertyA: { propertyB: { propertyC: Number } },
  propertyD: { propertyE: Number },
  propertyF: Number
}, { required: true })

console.log("---------------")
const validationC3 = schemaC.validate({
  propertyA: { propertyB: { propertyC: 333 } },
  propertyD: { propertyE: 555 },
  propertyF: 666
})
console.log(validationC3.valid, "Validation C.3.")
validationC3.report()

console.log("---------------")
const validationC4 = schemaC.validate({
  propertyA: { propertyB: { propertyC: "333" } },
  propertyD: { propertyE: 555 },
  propertyF: 666
})
console.log(validationC4.valid, "Validation C.4.")
validationC4.report()
/*
const schemaC = new Schema({
  propertyA: { propertyB: { propertyC: Number } },
  propertyD: { propertyE: Number },
  propertyF: Number
}, { required: false })

console.log("---------------")
const validationC1 = schemaC.validate({
  propertyA: { propertyB: { propertyC: 333 } },
  propertyD: { propertyE: 555 },
  propertyF: 666
})
console.log(validationC1.valid, "Validation C.1.")
validationC1.report()

console.log("---------------")
const validationC2 = schemaC.validate({
  propertyA: { propertyB: { propertyC: "333" } },
  propertyD: { propertyE: 555 },
  propertyF: 666
})
console.log(validationC2.valid, "Validation C.2.")
validationC2.report()
console.log(, "validationC1")
const schemaA = new Schema({
  propertyA: Number,
  propertyB: Boolean,
  propertyC: String,
  propertyD: null,
}, { required: true })

const schemaB = new Schema({
  propertyA: Number,
  propertyB: Boolean,
  propertyC: String,
  propertyD: null,
}, { required: false })

// Pass
const validationA1 = schemaA.validate({
  propertyA: 0,
  propertyB: true,
  propertyC: "three",
  propertyD: null,
})
console.log("-----")
console.log(validationA1.valid, 'validationA1', validationA1)
validationA1.report()

// Fail
const validationA2 = schemaA.validate({
  propertyA: "0",
  propertyB: "true",
  propertyC: 3,
  propertyD: 555,
})
console.log("-----")
console.log(validationA2.valid, 'validationA2', validationA2)
validationA2.report()

// Pass
const validationB1 = schemaB.validate({
  propertyA: 0,
  propertyB: true,
  propertyC: "three",
  propertyD: null,
})
console.log("-----")
console.log(validationB1.valid, 'validationB1', validationB1)
validationB1.report()

// Pass
const validationB2 = schemaB.validate({
  propertyA: 0,
  propertyB: "true",
  propertyC: 3,
  propertyD: 555,
})
console.log("-----")
console.log(validationB2.valid, 'validationB2', validationB2)
validationB2.report()
*/

// const modelA = new Model({
//   propertyA: 0,
//   propertyB: true,
//   propertyC: "three",
//   propertyD: null,
// }, schema, {
//   assignObject: 'set',
// })
// console.log("modelA", modelA.valueOf())

// const modelB = new Model({
//   propertyA: "0",
//   propertyB: 1,
//   propertyC: "three",
//   propertyD: null,
// }, schema, {
//   assignObject: 'set',

// })
// console.log("modelB", modelB.valueOf())

/*
const modelC = new Model({
  propertyA: "0",
  propertyB: 1,
  propertyC: "three",
  propertyD: null,
}, new Schema({
  propertyA: Number,
  propertyB: Boolean,
  propertyC: String,
  propertyD: null,
}, { required: true }), {
  assignObject: 'set'
})
console.log("modelC", modelC.valueOf())
*/