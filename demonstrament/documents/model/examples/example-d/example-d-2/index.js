console.log("------------")
console.log("Example D.2.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'

const object = new Model({
  propertyA: true,
  propertyB: 1,
  propertyC: "TRUE",
  propertyD: null
}, null, {
  events: { 'setProperty': eventLog }
})
