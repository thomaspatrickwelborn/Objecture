console.log("------------")
console.log("Example A.3.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
function eventLog($event) {
  console.log($event.type, $event.path, JSON.stringify($event.value, null, 2))
}
const content = {
  propertyA: {
    propertyB: {
      propertyC: true
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: 1
    }
  }],
  propertyG: "TRUE"
}
const object = new Model(content, null, {
  events: {
    'propertyA.propertyB setProperty': eventLog,
    'propertyA setProperty': eventLog,
    'setProperty': eventLog,
    'propertyD pushProp': eventLog,
    'propertyD.[0-9] set': eventLog,
    '** set': eventLog,
  },
  enableEvents: true
})
console.log(object.toString({ space: 2, replacer: null }))
console.log("pass", object.toString() === JSON.stringify(content))
