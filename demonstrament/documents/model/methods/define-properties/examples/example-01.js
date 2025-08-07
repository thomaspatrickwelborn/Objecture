import { Recourse } from '/dependencies/recourse.js'
const objectAST = {
  "propertyA": {
    "value": {
      "propertyB": {
        "value": "2",
        "writable": true,
        "enumerable": true,
        "configurable": true
      }
    },
    "writable": true,
    "enumerable": true,
    "configurable": true
  }
}
const object = Recourse.defineProperties({}, objectAST)
const objectString = JSON.stringify(object, null, 2)
const objectASTString = JSON.stringify(objectAST, null, 2)
console.log("---------------------------------------")
console.log("Recursive Define Properties | Example 1")
console.log("---------------------------------------")
console.log("objectASTString", objectASTString)
console.log('object', objectString)
console.log("pass", `{
  "propertyA": {
    "propertyB": "2"
  }
}` === objectString)