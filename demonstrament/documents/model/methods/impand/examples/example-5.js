import { Recourse } from '/dependencies/recourse.js'
console.log("-----------------------")
console.log("Impand Tree | Example 5")
console.log("-----------------------")
const object = {
  propertyA: [
    { propertyC: 3 },
    { propertyC: 33 },
    { propertyC: 333 },
  ]
}
const objectAST = Recourse.expand(object, 'value')
const objectString = JSON.stringify(object, null, 2)
const objectASTString = JSON.stringify(objectAST, null, 2)
const objectImpand = Recourse.impand(objectAST, 'value')
const objectImpandString = JSON.stringify(objectImpand, null, 2)
console.log("object", objectString)
console.log("objectAST", objectASTString)
console.log("objectImpand", objectImpandString)
console.log("pass", objectString === objectImpandString)
