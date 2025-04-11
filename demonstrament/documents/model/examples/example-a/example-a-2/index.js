import { Model, Schema } from '/dependencies/objecture.js'
import ComplexArrayA from '../../sets/complex-array-a/index.js'
function eventLog($event) { console.log($event.type, $event.path) }
const model = new Model(ComplexArrayA, null, {
  events: { '** pushProp': eventLog },
  assignArray: 'push',
  enableEvents: true,
})