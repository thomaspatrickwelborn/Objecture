import { Recourse } from '/dependencies/recourse.js'
const object = {
  propertyA: 1
}
console.log("-----------------------")
console.log("Impand Tree | Example 2")
console.log("-----------------------")
const objectAST = Recourse.expand(object, 'source.value')
const objectImpand = Recourse.impand(objectAST, 'source.value')
const objectString = JSON.stringify(object, null, 2)
const objectASTString = JSON.stringify(objectAST, null, 2)
const objectImpandString = JSON.stringify(objectImpand, null, 2)
console.log("object", objectString)
console.log("objectAST", objectASTString)
console.log("objectImpand", objectImpandString)
console.log("pass", `{
  "propertyA": 1
}` === objectImpandString)