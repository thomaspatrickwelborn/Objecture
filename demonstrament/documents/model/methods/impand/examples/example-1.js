import { Recourse } from '/dependencies/recourse.js'
console.log("-----------------------")
console.log("Impand Tree | Example 1")
console.log("-----------------------")
const object = {
  propertyA: 1
}
const objectAST = Recourse.expand(object, 'value')
const objectImpand = Recourse.impand(objectAST, 'value')
const objectString = JSON.stringify(object, null, 2)
const objectASTString = JSON.stringify(objectAST, null, 2)
const objectImpandString = JSON.stringify(objectImpand, null, 2)
console.log("object", objectString)
console.log("objectAST", objectASTString)
console.log("objectImpand", objectImpandString)
console.log("pass", `{
  "propertyA": 1
}` === objectImpandString)