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
      propertyF: Number,
      propertyE: {
        propertyFFF: Number
      }
    }
  }],
  propertyG: String
}
const content = {
  propertyA: {
    propertyB: {
      propertyC: true
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: 1,
      propertyE: {
        propertyFFF: 1
      }
    }
  }],
  propertyG: true
}
const object = new Model(content, schema)
delete content.propertyG
console.log(object.toString({ space: 2, replacer: null }))
console.log("pass", object.toString() === JSON.stringify(content))
