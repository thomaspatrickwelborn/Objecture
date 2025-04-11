import { Model, Schema } from '/dependencies/objecture.js'
import ComplexObjectB from '../../sets/complex-object-b/index.js'
function eventLog($event) { console.log($event.type, $event.path) }
const model = new Model(ComplexObjectB, null, {
  events: { '** defineProperty': eventLog },
  enableEvents: true,
  assignArray: 'defineProperties',
  assignObject: 'defineProperties',
})
console.log(model.valueOf())