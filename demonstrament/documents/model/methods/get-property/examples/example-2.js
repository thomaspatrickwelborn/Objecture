import { Recourse, tensors, set, typeOf, variables } from '/dependencies/recourse.js'
const { Getters, Setters, Deleters } = tensors
console.log("------------------------")
console.log("Get Property | Example 2")
console.log("------------------------")
const options = {
  // getters: [Getters.Object, Getters.Map],
  // setters: [Setters.Object, Setters.Map],
  // deleters: [Deleters.Object, Deleters.Map],
  // returnValue: 'target'
}
const object = {
  propertyA: [{
    propertyB: {
      propertyC: [{
        propertyD: {
          propertyE: new Map([["0", 5], ["1", 55], ["2", 555]])
        }
      }]
    }
  }]
}
const objectString = JSON.stringify(object, null, 2)
const propertyE = Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE')
const propertyE0 = Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE["0"]', options)
const propertyE1 = Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE["1"]', options)
const propertyE2 = Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE["2"]', options)
console.log("object", objectString)
console.log("pass", (
  (propertyE0 === 5) &&
  (propertyE1 === 55) &&
  (propertyE2 === 555)
))