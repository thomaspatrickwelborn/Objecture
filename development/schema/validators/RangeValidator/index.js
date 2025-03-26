import Validator from '../../validator/index.js'
export default class RangeValidator extends Validator {
  constructor($definition = {}, $schema) {
    super(Object.assign($definition, {
      type: 'range',
      validate: ($key, $value) => {
        const definition = this.definition
        let pass
        if(typeof $value !== 'number') { pass = false }
        else {
          const { min, max } = definition
          let validMin, validMax
          if(min !== undefined) { validMin = ($value >= min.value) }
          else { validMin = true }
          if(max !== undefined) { validMax = ($value <= max.value) }
          else { validMax = true }
          if(validMin && validMax) { pass = true }
          else { pass = false}
        }
        return pass
      }
    }), $schema)
  }
}