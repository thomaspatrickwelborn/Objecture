import { Recourse } from '/dependencies/recourse.js'
const { getOwnPropertyDescriptors } = Recourse
const object = {
  propertyA: [
    { propertyC: 3 },
    { propertyC: 33 },
    { propertyC: 333 },
  ]
}
const objectPDAST = getOwnPropertyDescriptors(object, {
  path: true,
  type: true
})
const objectString = JSON.stringify(object, null, 2)
const objectPDASTString = JSON.stringify(objectPDAST, null, 2)
console.log("---------------------------------------------------")
console.log("Recourse | Get Own Property Descriptors | Example 4")
console.log("---------------------------------------------------")
console.log('object', objectString)
console.log("objectPDASTString", objectPDASTString)
console.log("pass", `{
  "propertyA": {
    "value": {
      "0": {
        "value": {
          "propertyC": {
            "value": 3,
            "writable": true,
            "enumerable": true,
            "configurable": true,
            "path": "propertyA.0.propertyC",
            "type": "number"
          }
        },
        "writable": true,
        "enumerable": true,
        "configurable": true,
        "path": "propertyA.0",
        "type": "object"
      },
      "1": {
        "value": {
          "propertyC": {
            "value": 33,
            "writable": true,
            "enumerable": true,
            "configurable": true,
            "path": "propertyA.1.propertyC",
            "type": "number"
          }
        },
        "writable": true,
        "enumerable": true,
        "configurable": true,
        "path": "propertyA.1",
        "type": "object"
      },
      "2": {
        "value": {
          "propertyC": {
            "value": 333,
            "writable": true,
            "enumerable": true,
            "configurable": true,
            "path": "propertyA.2.propertyC",
            "type": "number"
          }
        },
        "writable": true,
        "enumerable": true,
        "configurable": true,
        "path": "propertyA.2",
        "type": "object"
      }
    },
    "writable": true,
    "enumerable": true,
    "configurable": true,
    "path": "propertyA",
    "type": "array"
  }
}` === objectPDASTString)