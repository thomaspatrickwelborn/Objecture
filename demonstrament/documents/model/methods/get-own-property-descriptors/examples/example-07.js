import { Recourse } from '/dependencies/recourse.js'
const { freeze, getOwnPropertyDescriptors } = Recourse
const object = {
  propertyA: {},
}
object.propertyA.root = object // NO
object.propertyA.parent = object.propertyA // No
object.propertyB = object
const objectPDAST = getOwnPropertyDescriptors(object, {
  path: true,
  type: true,
  maxDepth: 5,
})
const objectPDASTString = JSON.stringify(objectPDAST, null, 2)
console.log("---------------------------------------------------")
console.log("Recourse | Get Own Property Descriptors | Example 7")
console.log("---------------------------------------------------")
console.log('object', object)
console.log("objectPDASTString", objectPDASTString)
console.log("pass", `{
  "propertyA": {
    "value": {},
    "writable": true,
    "enumerable": true,
    "configurable": true,
    "path": "propertyA",
    "type": "object"
  }
}` === objectPDASTString)