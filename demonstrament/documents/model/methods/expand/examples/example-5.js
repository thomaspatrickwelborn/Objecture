import { Recourse } from '/dependencies/recourse.js'
const object = {
  propertyA: [
    { propertyC: 3 },
    { propertyC: 33 },
    { propertyC: 333 },
  ]
}
const objectAST = Recourse.expand(object, 'value')
console.log("-----------------------")
console.log("Expand Tree | Example 5")
console.log("-----------------------")
const objectString = JSON.stringify(object, null, 2)
const objectASTString = JSON.stringify(objectAST, null, 2)
console.log("object", objectString)
console.log("objectAST", objectASTString)
console.log("pass", `{
  "propertyA": {
    "value": [
      {
        "value": {
          "propertyC": {
            "value": 3
          }
        }
      },
      {
        "value": {
          "propertyC": {
            "value": 33
          }
        }
      },
      {
        "value": {
          "propertyC": {
            "value": 333
          }
        }
      }
    ]
  }
}` === objectASTString)