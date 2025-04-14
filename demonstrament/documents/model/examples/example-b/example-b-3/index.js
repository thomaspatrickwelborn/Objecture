console.log("----------------------------------------------------")
console.log("Example B.3. | Invalid Object-Type Schema Validation")
console.log("----------------------------------------------------")
import { Model, Schema } from '/dependencies/objecture.js'
import {
  ModelAProperties, ModelBProperties, 
  ModelCProperties, ModelDProperties, 
  SchemaProperties, 
} from '../../sets/complex-object-d/index.js'
const schema = new Schema(SchemaProperties)

const modelAPropertyValidation = schema.validate(ModelAProperties)
console.log("Model A Validation")
console.log(modelAPropertyValidation.valid, ModelAProperties, modelAPropertyValidation)

const modelBPropertyValidation = schema.validate(ModelBProperties)
console.log("Model B Validation")
console.log(modelBPropertyValidation.valid, ModelBProperties, modelBPropertyValidation)

const modelCPropertyValidation = schema.validate(ModelCProperties)
console.log("Model C Validation")
console.log(modelCPropertyValidation.valid, ModelCProperties, modelCPropertyValidation)

const modelDPropertyValidation = schema.validate(ModelDProperties)
console.log("Model D Validation")
console.log(modelDPropertyValidation.valid, ModelDProperties, modelDPropertyValidation)

/*
const modelEPropertyValidation = schema.validate(ModelEProperties)
console.log("Model E Validation")
console.log(modelEPropertyValidation.valid, ModelEProperties, modelEPropertyValidation)
*/