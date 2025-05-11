console.log("----------------")
console.log("defineProperties")
console.log("----------------")
import { Model } from '/dependencies/objecture.js'
import ComplexObjectB from '../../sets/complex-object-b/index.js'
function eventLog($event) { console.log($event.type, $event.path) }
const model = new Model(ComplexObjectB, null, {
  assignObject: 'defineProperties',
  assignArray: 'defineProperties',
})
console.log(model.valueOf())