import { Coutil } from '/dependencies/core-plex.js'
const { expandTree } = Coutil
// import { ModelProperties, SchemaProperties } from '../../sets/complex-object-c/index.js'
// console.log(expandTree(SchemaProperties, 'type.value'))

import { Model, Schema } from '/dependencies/objecture.js'
import { ModelProperties, SchemaProperties } from '../../sets/complex-object-c/index.js'
const schema = new Schema(SchemaProperties)
console.log(schema)
// console.log(schema.context)
console.log(schema.validate(ModelProperties))
