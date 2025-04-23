console.log("------------")
console.log("Example A.4.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
function eventLog($event) {
  console.log($event.type, $event.path, JSON.stringify($event.value, null, 2))
}
const schema = {
  propertyA: {
    propertyB: {
      propertyC: Boolean
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: Number
    }
  }],
  propertyG: String
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
  propertyG: true
}, schema, {
  events: {
    '** nonvalidProperty': eventLog,
  },
  enableEvents: true,
})