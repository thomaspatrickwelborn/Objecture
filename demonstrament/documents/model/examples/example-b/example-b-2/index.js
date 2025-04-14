console.log("-------------------------------------------")
console.log("Example B.2. | Array-Type Schema Validation")
console.log("-------------------------------------------")
import { Model, Schema } from '/dependencies/objecture.js'
import { ModelProperties, SchemaProperties } from '../../sets/complex-array-c/index.js'
const schema = new Schema(SchemaProperties)
const modelPropertyValidation = schema.validate(ModelProperties)
const { valid, advanced, deadvanced, unadvanced } = modelPropertyValidation
console.log(...[valid, ModelProperties])
