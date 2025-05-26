import { typeOf, variables } from 'recourse'
import Validator from '../../validator/index.js'
const { ObjectKeys, TypeKeys } = variables
import Schema from '../../index.js'
export default class TypeValidator extends Validator {
  constructor($definition = {}, $schema) {
    super(Object.assign({}, $definition, {
      type: 'type',
      validate: ($key, $value, $source, $target) => {
        let pass
        const definition = this.definition
        let typeOfDefinitionValue = typeOf(definition.value)
        if(typeOfDefinitionValue === 'function') {
          typeOfDefinitionValue = typeOf(definition.value())
        }
        else if(definition.value instanceof Schema) {
          typeOfDefinitionValue = definition.value.type
        }
        else {
          typeOfDefinitionValue = typeOf(definition.value)
        }
        if(TypeKeys.includes(typeOfDefinitionValue)) {
          const typeOfValue = typeOf($value)
          if(typeOfValue === 'undefined') { pass = false }
          else if(typeOfDefinitionValue === 'undefined') { pass = true }
          else if(definition.value instanceof Schema) {
            const validation = definition.value.validate($value, $source)
            pass = validation
          }
          else { pass = (typeOfDefinitionValue === typeOfValue) }
        }
        else { pass = false }
        return pass
      },
    }), $schema)
  }
}

