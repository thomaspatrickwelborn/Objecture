import * as Recourse from '/dependencies/recourse.js'
console.log("--------------------")
console.log("Value Of | Example 1")
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