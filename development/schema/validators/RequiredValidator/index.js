import { Coutil } from 'core-plex'
const { recursiveAssign, typedObjectLiteral } = Coutil
import Schema from '../../index.js'
import Validator from '../../validator/index.js'
export default class RequiredValidator extends Validator {
  constructor($definition, $schema) {
    super(Object.assign($definition, {
      type: 'required',
      validate: ($key, $value, $source, $target) => {
        const definition = this.definition
        let pass
        const { requiredProperties, requiredPropertiesSize, type } = this.schema
        if(requiredPropertiesSize === 0/* || definition.value === false*/) { pass = true }
        else if(type === 'object') {
          const corequiredContextProperties = typedObjectLiteral(type)
          const corequiredContentProperties = typedObjectLiteral(type)
          iterateRequiredProperties: 
          for(const [
            $requiredPropertyName, $requiredProperty
          ] of Object.entries(requiredProperties)) {
            const requiredProperty = recursiveAssign({}, $requiredProperty)
            // ?:START
            requiredProperty.required.value = false
            // ?:STOP
            if($requiredPropertyName === $key) { continue iterateRequiredProperties }
            const sourcePropertyDescriptor = Object.getOwnPropertyDescriptor($source, $requiredPropertyName)
            if(sourcePropertyDescriptor !== undefined) {
              corequiredContextProperties[$requiredPropertyName] = requiredProperty
              corequiredContentProperties[$requiredPropertyName] = sourcePropertyDescriptor.value
            }
            else if($target) {
              const targetPropertyDescriptor = Object.getOwnPropertyDescriptor($target, $requiredPropertyName)
              if(targetPropertyDescriptor !== undefined) { continue iterateRequiredProperties }
              else { corequiredContextProperties[$requiredPropertyName] = requiredProperty }
            }
            else {
              corequiredContextProperties[$requiredPropertyName] = requiredProperty
            }
          }
          const corequiredContextPropertiesSize = Object.keys(corequiredContextProperties).length
          const corequiredContentPropertiesSize = Object.keys(corequiredContentProperties).length
          if(corequiredContextPropertiesSize === 0 && corequiredContentPropertiesSize === 0) { pass = true }
          else if(corequiredContextPropertiesSize !== corequiredContentPropertiesSize) { pass = false }
          else {
            const coschema = new Schema(corequiredContextProperties, Object.assign({}, this.schema.options, {
              required: false 
            }))
            const validations = []
            for(const [
              $corequiredContextPropertyName, $corequiredContextProperty
            ] of Object.entries(corequiredContentProperties)) {
              const corequiredContentPropertyName = $corequiredContextPropertyName
              const corequiredContentProperty = corequiredContentProperties[corequiredContentPropertyName]
              const coschemaPropertyValidation = coschema.validateProperty(
                $corequiredContextPropertyName, corequiredContentProperty,
                $source, $target
              )
              validations.push(coschemaPropertyValidation)
            }
            const nonvalidValidation = (validations.find(($validation) => $validation.valid === false))
            if(nonvalidValidation) { pass = false }
            else { pass = true }
          }
        }
        else if(type === 'array') {
          pass = true
        }
        return pass
      }
    }), $schema)
  }
}