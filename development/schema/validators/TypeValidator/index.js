import { Coutil } from 'core-plex'
const { typeOf, variables } = Coutil
import Validator from '../../validator/index.js'
const { PrimitiveKeys, ObjectKeys } = variables
export default class TypeValidator extends Validator {
  constructor($definition = {}, $schema) {
    super(Object.assign($definition, {
      type: 'type',
      validate: ($key, $value) => {
        let pass
        const definition = this.definition
        const typeOfDefinitionValue = (typeOf(definition.value) === 'function')
          ? typeOf(definition.value())
          : typeOf(definition.value)
        if(PrimitiveKeys.concat(ObjectKeys).includes(typeOfDefinitionValue)) {
          const typeOfModelValue = typeOf($value)
          if(typeOfModelValue === 'undefined') { pass = false }
          else if(typeOfDefinitionValue === 'undefined') { pass = true }
          else { pass = (typeOfDefinitionValue === typeOfModelValue) }
        }
        else { pass = false }
        return pass
      },
    }), $schema)
  }
}