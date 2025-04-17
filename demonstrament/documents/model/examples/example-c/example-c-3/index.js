console.log("------------")
console.log("Example C.3.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
const schemaA = new Schema([{
  propertyB: [{
    propertyC: {
      propertyD: { required: true, type: Boolean },
      propertyE: { required: true, type: Boolean },
    }
  }]
}], {})

const modelA = [{
  propertyB: [{
    propertyC: {
      propertyD: true,
      propertyE: true,
    }
  }, {
    propertyC: {
      propertyD: false,
      propertyE: false,
    }
  }]
}, {
  propertyB: [{
    propertyC: {
      propertyD: false,
      propertyE: false,
    }
  }, {
    propertyC: {
      propertyD: true,
      propertyE: true,
    }
  }]
}]

const modelB = [{
  propertyB: [{
    propertyC: {
      propertyE: true,
    }
  }, {
    propertyC: {
      propertyD: false,
    }
  }]
}]

const validationC9 = schemaA.validate(modelA)
console.log("---------------")
console.log(validationC9.valid, "Validation C.9.", validationC9)
validationC9.report()

console.log("---------------")
const validationC10 = schemaA.validate(modelB)
console.log(validationC10.valid, "Validation C.10.", validationC10)
validationC10.report()
