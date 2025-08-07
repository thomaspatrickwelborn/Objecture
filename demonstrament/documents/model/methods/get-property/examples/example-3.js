import { Recourse, tensors, set, typeOf, variables } from '/dependencies/recourse.js'
const { Getters, Setters, Deleters } = tensors
console.log("------------------------")
console.log("Get Property | Example 3")
console.log("------------------------")
const options = {
  getters: [Getters.Object, Getters.Map],
  setters: [Setters.Object, Setters.Map],
  deleters: [Deleters.Object, Deleters.Map],
}
const object = {
  propertyA: [{
    propertyB: {
      propertyC: [{
        propertyD: {
          propertyE: new Map([[0, 5], [1, 55], [2, 555]])
        }
      }]
    }
  }]
}
const objectString = JSON.stringify(object, null, 2)
Recourse.set(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.2', "555", options)
Recourse.set(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.1', "55", options)
Recourse.set(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.0', "5", options)
const objectModifiedString = JSON.stringify(object, null, 2)
console.log("object", object)
console.log("objectString", objectString)
console.log("objectModifiedString", objectModifiedString)
console.log("pass", (
  (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.2', options) === "555") &&
  (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.1', options) === "55") &&
  (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.0', options) === "5")
))