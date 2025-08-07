import { Recourse } from '/dependencies/recourse.js'
const objectAST = {
  "propertyA": {
    "value": {
      "propertyB": {
        "value": 2,
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
}
const object = Recourse.defineProperties({}, objectAST, {
  typeCoercion: true
})
const objectString = JSON.stringify(object, null, 2)
const objectASTString = JSON.stringify(objectAST, null, 2)
console.log("---------------------------------------")
console.log("Recursive Define Properties | Example 2")
console.log("---------------------------------------")
console.log("objectASTString", objectASTString)
console.log('object', objectString)
console.log("pass", `{
  "propertyA": {
    "propertyB": "2"
  }
}` === objectString)
