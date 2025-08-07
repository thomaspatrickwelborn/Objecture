import { Recourse } from '/dependencies/recourse.js'
const { defineProperties, getOwnPropertyDescriptors } = Recourse
const object = {
  propertyA: {
    propertyB: 2,
  }
}
const objectString = JSON.stringify(object, null, 2)
object.propertyA.propertyC = object.propertyA
object.propertyD = object
const objectPDAST = getOwnPropertyDescriptors(object, {
  path: true,
  type: true,
})
const objectPDASTString = JSON.stringify(objectPDAST, null, 2)
const objectDefinedProperties = defineProperties({}, objectPDAST, {
  typeCoercion: true, 
})
const objectDefinedPropertiesString = JSON.stringify(objectDefinedProperties, null, 2)
console.log("---------------------------------------------------")
console.log("Recourse | Define Properties | Example 4")
console.log("---------------------------------------------------")
console.log("objectPDASTString", objectPDASTString)
console.log('objectDefinedPropertiesString', objectDefinedPropertiesString)
console.log("pass", objectDefinedPropertiesString === objectString)



