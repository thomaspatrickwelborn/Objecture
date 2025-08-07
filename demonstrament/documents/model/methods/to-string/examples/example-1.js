import * as Recourse from '/dependencies/recourse.js'
console.log("---------------------")
console.log("To String | Example 1")
console.log("---------------------")
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
const objectString = Recourse.toString(object, { space: 2, replacer: null })
console.log("object", object)
console.log("objectString", objectString)
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