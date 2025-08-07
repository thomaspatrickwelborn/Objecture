import { Recourse, tensors, set, typeOf, variables } from '/dependencies/recourse.js'
const { Getters, Setters, Deleters } = tensors
console.log("-------------------------")
console.log("Assign Concat | Example 1")
console.log("-------------------------")
const options = {}
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
const objectString = JSON.stringify(object, null, 2)
Recourse.assignConcat(object, {
  propertyA: [{
    propertyB: {
      propertyC: [{
        propertyD: {
          propertyE: ["5555", 55555, "555555"]
        }
      }]
    }
  }]
})
const objectModifiedString = JSON.stringify(object, null, 2)
console.log("object", objectString)
console.log("objectModified", objectModifiedString)
console.log("pass", (
  (Recourse.get(object, 'propertyA.1.propertyB.propertyC.0.propertyD.propertyE.2') === "555555") &&
  (Recourse.get(object, 'propertyA.1.propertyB.propertyC.0.propertyD.propertyE.1') === 55555) &&
  (Recourse.get(object, 'propertyA.1.propertyB.propertyC.0.propertyD.propertyE.0') === "5555") &&
  (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.2') === 555) &&
  (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.1') === 55) &&
  (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.0') === 5)
))