import {
  recursiveGetOwnPropertyDescriptors,
  recursiveGetOwnPropertyDescriptor,
  recursiveDefineProperties,
  recursiveDefineProperty,
} from '/dependencies/recourse.js'
const objectASource = {
  propertyA: {
    propertyB: {
      propertyC: 333
    },
    propertyD: "4444"
  },
  propertyE: [
    { propertyG: 7777777 },
    { propertyG: 7777777 },
    { propertyG: 7777777 },
  ],
}
const objectASourcePropertyDescriptors = recursiveGetOwnPropertyDescriptors(objectASource)
console.log("objectASourcePropertyDescriptors", objectASourcePropertyDescriptors)
const objectASourceRedefine = recursiveDefineProperties({}, objectASourcePropertyDescriptors)
console.log("objectASourceRedefine", objectASourceRedefine)
// import { Model } from '/dependencies/objecture.js'
// const model = new Model({
//   propertyA: {
//     propertyB: {
//       propertyC: 333
//     },
//     propertyD: "4444"
//   },
//   propertyE: [
//     { propertyG: 7777777 },
//     { propertyG: 7777777 },
//     { propertyG: 7777777 },
//   ],
// }, null, {
//   localStorage: true, autoload: true
// })
// console.log(model)
// model.save()