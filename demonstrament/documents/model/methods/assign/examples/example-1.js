import { Recourse } from '/dependencies/recourse.js'
import { Model } from '/dependencies/objecture.js'
// throw Model
console.log("------------------")
console.log("Assign | Example 1")
console.log("------------------")
const options = {
  propertyAssignments: {
    object: 'assign', array: 'assign', map: 'assign', 
  },
  methods: { object: { toString: { space: 2, replacer: null } }}
}
const object = {
  propertyA: [{
    propertyB: {
      propertyC: [{
        propertyD: {
          propertyE: [5, 55, 555]
        }
      }]
    }
  }]
}
const objectAssignment = {
  propertyA: [{
    propertyB: {
      propertyC: [{
        propertyD: {
          propertyE: ["5", 55, "555"]
        }
      }]
    }
  }]
}
const model = new Model(object, null, options)
model.assign(objectAssignment)
const modelObject = model.valueOf()
const modelString = model.toString()
console.log("object", object)
console.log("model", model)
console.log("modelObject", modelObject)
console.log("modelString", modelString)
console.log("object", object)
console.log("pass", (
  (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.2') === "555") &&
  (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.1') === 55) &&
  (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.0') === "5")
))
