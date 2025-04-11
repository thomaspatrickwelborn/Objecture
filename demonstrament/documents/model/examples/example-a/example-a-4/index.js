import { Model, Schema } from '/dependencies/objecture.js'
import ComplexArrayB from '../../sets/complex-array-b/index.js'
function eventLog($event) { console.log($event.type, $event.path) }
const model = new Model(ComplexArrayB, null, {
  events: { '** defineProperty': eventLog },
  enableEvents: true,
  assignArray: 'defineProperties',
  assignObject: 'defineProperties',
})
console.log(model.valueOf())