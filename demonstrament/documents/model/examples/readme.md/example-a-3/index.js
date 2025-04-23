console.log("------------")
console.log("Example A.3.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
function eventLog($event) {
  console.log($event.type, $event.path, JSON.stringify($event.value, null, 2))
}
const object = new Model({
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
}, null, {
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
