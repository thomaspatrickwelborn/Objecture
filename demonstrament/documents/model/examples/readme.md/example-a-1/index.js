console.log("------------")
console.log("Example A.1.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
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
  propertyG: "TRUE"
})
console.log(object.valueOf())
