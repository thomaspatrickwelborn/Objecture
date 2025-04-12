console.log("-----------")
console.log("fillIndex")
console.log("-----------")
import { Model, Schema } from '/dependencies/objecture.js'
function eventLog($event) { console.log($event.type, $event.path) }
const array = new Model([], null, {
  events: { '** fillIndex': eventLog },
  enableEvents: true,
})
array.length = 3
console.log(array)