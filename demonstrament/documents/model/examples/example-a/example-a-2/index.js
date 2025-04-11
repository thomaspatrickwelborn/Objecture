import { Model, Schema } from '/dependencies/objecture.js'
import ComplexArrayA from '../../sets/complex-array-a/index.js'
console.log(ComplexArrayA)
function eventLog($event) { console.log($event.type, $event.path) }
const model = new Model(ComplexArrayA, null, {
  events: {
    '** pushProp': eventLog,
  },
  enableEvents: true,
  // assignObject: 'set',
  assignArray: 'push',
})