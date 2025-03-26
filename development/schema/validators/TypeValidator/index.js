import { Coutil } from 'core-plex'
const {
  typeOf, variables
} = Coutil
import Validator from '../../validator/index.js'
const { PrimitiveKeys, PrimitiveValues } = variables
export default class TypeValidator extends Validator {
  constructor($definition = {}, $schema) {
    super(Object.assign($definition, {
      type: 'type',
      validate: ($key, $value) => {
        const definition = this.definition
        let pass
        let typeOfDefinitionValue = typeOf(definition.value)
        typeOfDefinitionValue = (typeOfDefinitionValue === 'function')
          ? typeOf(definition.value())
          : typeOfDefinitionValue
        const typeOfContentValue = typeOf($value)
        if(typeOfContentValue === 'undefined') { pass = false }
        else if(typeOfDefinitionValue === 'undefined') { pass = true }
        else { pass = (typeOfDefinitionValue === typeOfContentValue) }
        return pass
      },
    }), $schema)
  }
}