console.log("------------")
console.log("Example C.4.")
console.log("------------")
import { Model, Schema } from '/dependencies/objecture.js'
const schemaA = new Schema([{
  propertyB: [{
    propertyC: {
      propertyD: { required: true, type: Boolean },
      propertyE: { required: true, type: Boolean },
    }
  }]
}], { required: true })
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

const validationC11 = schemaA.validate(modelA)
console.log("---------------")
console.log(validationC11.valid, "Validation C.11.")
validationC11.report()

console.log("---------------")
const validationC12 = schemaA.validate(modelB)
console.log(validationC12.valid, "Validation C.12.")
validationC12.report()
