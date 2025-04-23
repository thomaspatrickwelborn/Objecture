console.log("------------")
console.log("Example A.2.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
const schema = {
  propertyA: {
    propertyB: {
      propertyC: Boolean
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: Number
    }
  }],
  propertyG: String
}
const object = new Model({
  propertyA: {
    propertyB: {
      propertyC: true
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: 1
    }
  }],
  propertyG: true
}, schema)
console.log(object.toString({ space: 2, replacer: null }))