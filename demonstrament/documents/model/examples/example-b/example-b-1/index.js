import { Model, Schema } from '/dependencies/objecture.js'
import complexObjectA from '../../sets/complex-object-a/index.js'
import complexObjectSchemaA from '../../sets/complex-object-a/schema.js'

const schema = new Schema(complexObjectSchemaA)
console.log(schema.validate(complexObjectA))