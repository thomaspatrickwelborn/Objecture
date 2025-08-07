import { Recourse } from '/dependencies/recourse.js'
const { getOwnPropertyDescriptors } = Recourse
const object = {
  propertyA: {
    propertyB: {
      propertyC: {
        propertyD: {
          propertyE: {
            propertyF: {
              propertyG: {
                propertyH: 8
              }
            }
          }
        }
      }
    }
  },
}
object.propertyA.root = object // NO
object.propertyA.parent = object.propertyA // No
const objectPDAST = getOwnPropertyDescriptors(object, {
  path: true,
  type: true,
  maxDepth: 5,
})
const objectPDASTString = JSON.stringify(objectPDAST, null, 2)
console.log("---------------------------------------------------")
console.log("Recourse | Get Own Property Descriptors | Example 8")
console.log("---------------------------------------------------")
console.log('object', object)
console.log("objectPDASTString", objectPDASTString)
console.log("pass", `{
  "propertyA": {
    "value": {
      "propertyB": {
        "value": {
          "propertyC": {
            "value": {
              "propertyD": {
                "value": {
                  "propertyE": {
                    "value": {},
                    "writable": true,
                    "enumerable": true,
                    "configurable": true,
                    "path": "propertyA.propertyB.propertyC.propertyD.propertyE",
                    "type": "object"
                  }
                },
                "writable": true,
                "enumerable": true,
                "configurable": true,
                "path": "propertyA.propertyB.propertyC.propertyD",
                "type": "object"
              }
            },
            "writable": true,
            "enumerable": true,
            "configurable": true,
            "path": "propertyA.propertyB.propertyC",
            "type": "object"
          }
        },
        "writable": true,
        "enumerable": true,
        "configurable": true,
        "path": "propertyA.propertyB",
        "type": "object"
      }
    },
    "writable": true,
    "enumerable": true,
    "configurable": true,
    "path": "propertyA",
    "type": "object"
  }
}` === objectPDASTString)