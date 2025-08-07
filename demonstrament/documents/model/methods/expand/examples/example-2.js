import { Recourse } from '/dependencies/recourse.js'
const object = {
  propertyA: 1
}
const objectAST = Recourse.expand(object, 'source.value')
console.log("-----------------------")
console.log("Expand Tree | Example 2")
console.log("-----------------------")
const objectString = JSON.stringify(object, null, 2)
const objectASTString = JSON.stringify(objectAST, null, 2)
console.log("object", objectString)
console.log("objectAST", objectASTString)
console.log("pass", `{
  "propertyA": {
    "source": {
      "value": 1
    }
  }
}` === objectASTString)