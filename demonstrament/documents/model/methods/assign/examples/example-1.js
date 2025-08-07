import { Recourse } from '/dependencies/recourse.js'
import { Model } from '/dependencies/objecture.js'
console.log("------------------")
console.log("Assign | Example 1")
console.log("------------------")
const options = {}
const object = {}
const objectAssignment = {
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
const model = new Model(object)
model.assign({
  propertyA: [{
    propertyB: {
      propertyC: [{
        propertyD: {
          propertyE: ["5", 55, "555"]
        }
      }]
    }
  }]
})
const modelString = JSON.stringify(object, null, 2)
console.log("object", model.parse())
// const objectModifiedString = JSON.stringify(object, null, 2)
// console.log("object", objectString)
// console.log("objectModified", objectModifiedString)
// console.log(`Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.2')`, Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.2'))
// console.log("pass", (
//   (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.2') === "555") &&
//   (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.1') === 55) &&
//   (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE.0') === "5")
// ))
