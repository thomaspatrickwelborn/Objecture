import { Recourse, tensors, set, typeOf, variables } from '/dependencies/recourse.js'
const { Getters, Setters, Deleters } = tensors
console.log("------------------------")
console.log("Get Property | Example 1")
console.log("------------------------")
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
const propertyE0 = Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.0')
const propertyE1 = Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.1')
const propertyE2 = Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.2')
console.log("object", objectString)
console.log(`Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.2')\n${propertyE2}`)
console.log(`Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.1')\n${propertyE1}`)
console.log(`Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.0')\n${propertyE0}`)
console.log("pass", (
  (propertyE0 === 5) &&
  (propertyE1 === 55) &&
  (propertyE2 === 555)
))