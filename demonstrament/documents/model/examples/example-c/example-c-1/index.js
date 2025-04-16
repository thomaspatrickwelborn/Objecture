console.log("------------")
console.log("Example C.1.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'

const modelA = new Model({
  propertyA: 0,
  propertyB: true,
  propertyC: "three",
  propertyD: null,
}, new Schema({
  propertyA: Number,
  propertyB: Boolean,
  propertyC: String,
  propertyD: null,
}, {
  required: true,
}), {
  assignObject: 'set'
})
console.log("modelA", modelA.valueOf())

const modelB = new Model({
  propertyA: "0",
  propertyB: 1,
  propertyC: "three",
  propertyD: null,
}, new Schema({
  propertyA: Number,
  propertyB: Boolean,
  propertyC: String,
  propertyD: null,
}, {
  required: false,
}), {
  assignObject: 'set'
})
console.log("modelB", modelB.valueOf())

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