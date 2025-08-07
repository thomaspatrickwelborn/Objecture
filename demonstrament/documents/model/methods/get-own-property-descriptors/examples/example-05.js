import { Recourse } from '/dependencies/recourse.js'
const { freeze, getOwnPropertyDescriptors } = Recourse
const object = {
  propertyA: {
    propertyB: 2,
  }
}
object.propertyA.propertyC = object.propertyA
const objectPDAST = getOwnPropertyDescriptors(object, {
  path: true,
  type: true,
  // returnValue: 'entries'
})
const objectString = JSON.stringify(objectPDAST, null, 2)
const objectPDASTString = JSON.stringify(objectPDAST, null, 2)
console.log("---------------------------------------------------")
console.log("Recourse | Get Own Property Descriptors | Example 5")
console.log("---------------------------------------------------")
console.log('object', object)
console.log("objectPDASTString", objectPDASTString)
console.log("pass", `{
  "propertyA": {
    "value": {
      "propertyB": {
        "value": 2,
        "writable": true,
        "enumerable": true,
        "configurable": true,
        "path": "propertyA.propertyB",
        "type": "number"
      }
    },
    "writable": true,
    "enumerable": true,
    "configurable": true,
    "path": "propertyA",
    "type": "object"
  }
}` === objectPDASTString)