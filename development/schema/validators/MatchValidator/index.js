import Validator from '../../validator/index.js'
export default class MatchValidator extends Validator {
  constructor($settings = {}, $schema) {
    super(Object.assign($settings, {
      type: 'match',
      validate: ($key, $value) => {
        const definition = this.settings
        let pass
        if(![
          'string', 'number', 'boolean'
        ].includes(typeof $value)) { pass = false}
        else {
          const match = definition
          const valueMatch = (match.value.exec($value) !== null)
        }
        return pass ? true : false
      },
    }), $schema)
  }
}