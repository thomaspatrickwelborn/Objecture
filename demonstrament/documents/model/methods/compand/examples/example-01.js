import { Recourse } from '/dependencies/recourse.js' 
console.log("------------------------")
console.log("Compand Tree | Example 1")
console.log("------------------------")
const object = [{
  propertyA: {
    propertyB: {
      propertyC: [{
        propertyD: {
          propertyE: 555555555
        }
      }, {
        propertyD: {
          propertyF: [{
            propertyG: 777
          }, {
            propertyG: 777777
          }, {
            propertyG: 777777777
          }],
        }
      }]
    }
  }
}]
const objectCompand = Recourse.compand(object, {
  values: false, nonenumerable: false, maxDepth: 11
})
const objectString = JSON.stringify(object, null, 2)
const objectCompandString = JSON.stringify(objectCompand, null, 2)
console.log("objectString", objectString)
console.log("objectCompand", objectCompandString)
console.log("pass", `[
  "0",
  "0.propertyA",
  "0.propertyA.propertyB",
  "0.propertyA.propertyB.propertyC",
  "0.propertyA.propertyB.propertyC.0",
  "0.propertyA.propertyB.propertyC.0.propertyD",
  "0.propertyA.propertyB.propertyC.0.propertyD.propertyE",
  "0.propertyA.propertyB.propertyC.1",
  "0.propertyA.propertyB.propertyC.1.propertyD",
  "0.propertyA.propertyB.propertyC.1.propertyD.propertyF",
  "0.propertyA.propertyB.propertyC.1.propertyD.propertyF.0",
  "0.propertyA.propertyB.propertyC.1.propertyD.propertyF.0.propertyG",
  "0.propertyA.propertyB.propertyC.1.propertyD.propertyF.1",
  "0.propertyA.propertyB.propertyC.1.propertyD.propertyF.1.propertyG",
  "0.propertyA.propertyB.propertyC.1.propertyD.propertyF.2",
  "0.propertyA.propertyB.propertyC.1.propertyD.propertyF.2.propertyG"
]` === objectCompandString)