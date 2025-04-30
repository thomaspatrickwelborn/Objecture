console.log("------------")
console.log("Example A.1.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
const content = {
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
  propertyG: "TRUE"
}
const object = new Model(content)
console.log("=====")
console.log(object.toString({ space: 2, replacer: null }))
console.log("pass", object.toString() === JSON.stringify(content))
