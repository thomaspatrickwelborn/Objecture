console.log("------------")
console.log("Example A.5.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
function eventLog($event) {
  console.log($event.type, $event.path)
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
      propertyE: { required: true, type: {
        propertyFFF: Number,
        propertyGGG: Boolean,
      } },
      propertyFF: { required: true, type: Boolean },
    }
  }],
  propertyG: Boolean
})
const content = {
  propertyA: {
    propertyB: {
      propertyC: true
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: 1,
      propertyE: {
        propertyFFF: "1",
        propertyGGG: "true",
      },
      propertyFF: true,
    }
  }, {
    propertyE: {
      propertyF: 1,
      propertyE: {
        propertyFFF: 1,
        propertyGGG: true,
      },
      propertyFF: true,
    }
  }],
  propertyG: true
}
const object = new Model(content, schema, {
  events: {
    '** validProperty': eventLog,
    '** nonvalidProperty': eventLog,
  },
  enableEvents: true,
})
console.log(object.toString({ space: 2, replacer: null }))
