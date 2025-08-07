import { Recourse } from '/dependencies/recourse.js'
const { getOwnPropertyDescriptors } = Recourse
const object = {
  propertyA: {
    propertyB: "2"
  }
}
const objectPDAST = getOwnPropertyDescriptors(object, {
  type: true
})
const objectString = JSON.stringify(object, null, 2)
const objectPDASTString = JSON.stringify(objectPDAST, null, 2)
console.log("---------------------------------------------------")
console.log("Recourse | Get Own Property Descriptors | Example 2")
console.log("---------------------------------------------------")
console.log('object', objectString)
console.log("objectPDASTString", objectPDASTString)
console.log("pass", `{
  "propertyA": {
    "value": {
      "propertyB": {
        "value": "2",
        "writable": true,
        "enumerable": true,
        "configurable": true,
        "type": "string"
      }
    },
    "writable": true,
    "enumerable": true,
    "configurable": true,
    "type": "object"
  }
}` === objectPDASTString)