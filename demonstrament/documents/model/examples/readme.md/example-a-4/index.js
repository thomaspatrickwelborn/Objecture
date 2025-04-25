console.log("------------")
console.log("Example A.4.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
function eventLog($event) {
  console.log($event.type, $event.path, JSON.stringify($event.value, null, 2))
}
const schema = new Schema({
  propertyA: {
    propertyB: {
      propertyC: Boolean
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: Number,
      propertyE: {
        propertyFFF: Number
      }
    }
  }],
  propertyG: Boolean
})
const object = new Model({
  propertyA: {
    propertyB: {
      propertyC: true
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: 1,
      propertyE: {
        propertyFFF: 1
      }
    }
  }],
  propertyG: "true"
}, schema, {
  events: {
    '** valid': eventLog,
    '** validProperty': eventLog,
    '** nonvalid': eventLog,
    '** nonvalidProperty': eventLog,
  },
  enableEvents: true,
})
console.log(object.toString({ space: 2, replacer: null }))
