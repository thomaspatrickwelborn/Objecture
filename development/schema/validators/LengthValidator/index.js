import Validator from '../../validator/index.js'
export default class LengthValidator extends Validator {
  constructor($definition = {}, $schema) {
    super(Object.assign($definition, {
      type: 'length',
      validate: ($key, $value) => {
        const definition = this.definition
        let pass
        if(typeof $value !== 'string') { pass = false }
        else {
          const { min, max } = definition
          let validMin, validMax
          if(min !== undefined) {
            validMin = ($value.length >= min.value)
          }
          else { validMin = true }
          if(max !== undefined) {
            validMax = ($value.length <= max.value)
          }
          else { validMax = true }
          if(validMin && validMax) { pass = true }          
          else { pass = false}
        }
        return pass
      },
    }), $schema)
  }
}