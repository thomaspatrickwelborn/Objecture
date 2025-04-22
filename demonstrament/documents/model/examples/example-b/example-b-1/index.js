console.log("--------------------------------------------")
console.log("Example B.1. | Object-Type Schema Validation")
console.log("--------------------------------------------")
import { Model, Schema } from '/dependencies/objecture.js'
import { ModelProperties, SchemaProperties } from '../../../sets/complex-object-c/index.js'
const schema = new Schema(SchemaProperties, {
  required: true
})
const modelPropertyValidation = schema.validate(ModelProperties)
console.log(modelPropertyValidation.report())
