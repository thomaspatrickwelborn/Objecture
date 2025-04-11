import { Model, Schema } from '/dependencies/objecture.js'
import ComplexObjectA from '../../sets/complex-object-a/index.js'
function eventLog($event) { console.log($event.type, $event.path) }
const model = new Model(ComplexObjectA, null, {
  events: { '** pushProp': eventLog },
  assignArray: 'push',
  enableEvents: true,
})