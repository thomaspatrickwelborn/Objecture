import * as Recourse from '/dependencies/recourse.js'
console.log("--------------------")
console.log("Value Of | Example 4")
console.log("--------------------")
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
object.propertyA[0].propertyB.propertyF = object.propertyA[0].propertyB
object.propertyA[0].propertyB.propertyG = object.propertyA[0]
object.propertyA[0].propertyB.propertyH = object
const objectValueOf = Recourse.valueOf(object)
const objectString = Recourse.toString(object, { space: 2, replacer: null })
console.log('object', object)
console.log('objectValueOf', objectValueOf)
console.log('objectString', objectString)
console.log("pass", objectString === `{
  "propertyA": [
    {
      "propertyB": {
        "propertyC": [
          {
            "propertyD": {
              "propertyE": [
                5,
                55,
                555
              ]
            }
          }
        ]
      }
    }
  ]
}`)