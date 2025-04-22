console.log("------------")
console.log("Example A.1.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
const object = new Model({
  propertyA: "TRUE",
  propertyB: true,
  propertyC: 503,
}, {
  propertyA: Boolean,
  propertyB: Number,
  propertyC: String,
})
console.log(object.toString({ space: 2, replacer: null }))
/*
const object = new Model({
  propertyA: true,
  propertyB: 1,
  propertyC: "TRUE",
  propertyD: null
}, {
  propertyA: Boolean,
  propertyB: Number,
  propertyC: String,
  propertyD: null
})
console.log(object.toString({ space: 2, replacer: null }))
*/

/*
const object = new Model({
  propertyA: true,
  propertyB: 1,
  propertyC: "TRUE",
  propertyD: null
})
console.log("object.set", object.valueOf())
object.assign({
  propertyA: false,
  propertyB: 0,
  propertyC: "FALSE",
  propertyD: null
})
console.log(object.valueOf())
*/