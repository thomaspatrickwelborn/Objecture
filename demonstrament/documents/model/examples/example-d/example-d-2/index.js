console.log("------------")
console.log("Example D.2.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
function eventLog($event) {
  console.log($event.type, $event.value)
}
const object = new Model({})
object.addEvents({ 'setProperty': eventLog, 'set': eventLog }, true)
object.set({
  propertyA: true,
  propertyB: 1,
})