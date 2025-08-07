import { Recourse, tensors, set, typeOf, variables } from '/dependencies/recourse.js'
const { Getters, Setters, Deleters } = tensors
console.log("---------------------------")
console.log("Delete Property | Example 1")
console.log("---------------------------")
const options = {
  // getters: [Getters.Object, Getters.Map],
  // setters: [Setters.Object, Setters.Map],
  // deleters: [Deleters.Object, Deleters.map],
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
const objectString = JSON.stringify(object, null, 2)
Recourse.delete(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.2')
Recourse.delete(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.1')
Recourse.delete(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.0')
const objectModifiedString = JSON.stringify(object, null, 2)
console.log("object", objectString)
console.log("objectModified", objectModifiedString)
console.log("pass", (
  (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.2') === undefined) &&
  (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.1') === undefined) &&
  (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.0') === undefined)
))