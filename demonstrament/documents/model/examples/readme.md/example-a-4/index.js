console.log("------------")
console.log("Example A.4.")
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
      propertyE: {
        propertyFFF: Number
      }
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
        propertyFFF: 1
      }
    }
  }],
  propertyG: "true"
}
const object = new Model(content, schema, {
  events: {
    '** validProperty': eventLog,
    '** nonvalidProperty': eventLog,
  },
  enableEvents: true,
})
const delcontent = Object.assign({}, content)
delete delcontent.propertyG
console.log(object.toString({ space: 2, replacer: null }))
console.log("pass", object.toString({ space: 2, replacer: null }) === JSON.stringify(delcontent, null, 2))
