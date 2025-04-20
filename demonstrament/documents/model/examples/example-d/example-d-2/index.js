console.log("------------")
console.log("Example D.2.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
const object = new Model({
  propertyA: {
    propertyB: {
      propertyC: true,
      propertyD: false,
    }
  },
  propertyE: [{
    propertyF: 1,
    propertyG: 0
  }],
  propertyH: {
    propertyI: "1",
    propertyJ: null
  }
}, null, {
  events: {
    'set': function($event) {
      console.log($event.type, $event.value)
    }
  },
  enableEvents: true,
})