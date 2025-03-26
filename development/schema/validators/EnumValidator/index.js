import Validator from '../../validator/index.js'
export default class EnumValidator extends Validator {
  constructor($definition = {}, $schema) {
    super(Object.assign($definition, {
      type: 'enum',
      validate: ($key, $value) => {
        const definition = this.definition
        let pass
        if(![
          'string', 'number', 'boolean'
        ].includes(typeof $value)) { pass = false}
        else {
          const enumeration = definition.value
          pass = enumeration.includes($value)
        }
        return pass
      },
    }), $schema)
  }
}