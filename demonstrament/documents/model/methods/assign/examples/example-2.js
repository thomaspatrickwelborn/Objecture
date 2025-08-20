import { Recourse } from '/dependencies/recourse.js'
import { Model } from '/dependencies/objecture.js'
console.log("------------------")
console.log("Assign | Example 2")
console.log("------------------")
const options = {
  propertyAssignments: { array: 'assign',  map: 'assign' },
  methods: { object: { toString: { space: 2, replacer: null } } },
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
const model = new Model(object, null, options)
const originalObjectString = Recourse.toString(object, options.methods.object.toString)
const originalModelString = model.toString()
console.log("originalObjectString", originalObjectString)
console.log("originalModelString", originalModelString)
// console.log(model.valueOf())
// console.log(model.toString())
// model.assign({
//   propertyA: [{
//     propertyB: {
//       propertyC: [{
//         propertyD: {
//           propertyE: { "0": "5", "1": 55, "2": "555" }
//         }
//       }]
//     }
//   }]
// })
// model.assign({
//   propertyA: [{
//     propertyB: {
//       propertyC: [{
//         propertyD: {
//           propertyE: { "0": "5", "1": 55, "2": "555" },
//           propertyF: new Map([["0", 5], ["1", "55"], ["2", 555], ["3", "5555"]]),
//         }
//       }]
//     }
//   }]
// }, {
//   propertyA: [{
//     propertyB: {
//       propertyC: [{
//         propertyD: {
//           propertyF: { "0": 5, "1": "55", "2": 555, "3": "5555" }
//         }
//       }]
//     }
//   }]
// })
// const objectModifiedString = Recourse.toString(object, { space: 2, replacer: null })
// console.log("object", object)
// console.log("model", model)

// console.log("objectString", objectString)
// console.log("objectModifiedString", objectModifiedString)
// console.log("pass", (
//   (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE."2"') === "555") &&
//   (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE."1"') === 55) &&
//   (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyE."0"') === "5") &&
//   (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyF."3"') === "5555") &&
//   (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyF."2"') === 555) &&
//   (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyF."1"') === "55") &&
//   (Recourse.get(object, 'propertyA.0.propertyB.propertyC.0.propertyD.propertyF."0"') === 5)
// ))