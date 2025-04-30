
import { Coutil } from 'core-plex'
const { recursiveAssign, typedObjectLiteral } = Coutil
import Schema from '../../index.js'
import Validator from '../../validator/index.js'
export default class RequiredValidator extends Validator {
  constructor($definition, $schema) {
    super(Object.assign({}, $definition, {
      type: 'required',
      validate: ($key, $value, $source, $target) => {
        const { requiredProperties, requiredPropertiesSize, type } = $schema
        const corequiredProperties = Object.assign({}, requiredProperties)
        let corequiredPropertiesSize = requiredPropertiesSize
        const properties = Object.assign(typedObjectLiteral(type), $source, $target)
        const definition = this.definition
        let pass
        if(!requiredPropertiesSize) { pass = true }
        else {
          if(Object.hasOwn(corequiredProperties, $key)) {
            delete corequiredProperties[$key]
            corequiredPropertiesSize--
          }
          if(corequiredPropertiesSize) {
            const coschema = new Schema(corequiredProperties, {
              path: $schema.path,
              parent: $schema.parent,
            })
            const comodel = Object.assign({}, $target, $source)
            const covalidation = coschema.validate(comodel)
            pass = covalidation.valid
          }
        }
        return pass
      }
    }), $schema)
  }
}