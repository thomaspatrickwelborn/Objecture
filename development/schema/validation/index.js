import Verification from '../verification/index.js'
const Messages = {
  'true': ($validation) => `${$validation.valid}`,
  'false': ($validation) => `${$validation.valid}`,
}
export default class Validation extends EventTarget {
  constructor($settings = {}, $schema) {
    super()
    const settings = Object.assign({ messages: Messages }, $settings)
    let valid
    const advance = []
    const deadvance = []
    const unadvance = []
    Object.defineProperties(this, {
      'verificationType': { value: settings.verificationType },
      'required': { value: settings.required },
      'definition': { value: settings.definition },
      'key': { value: settings.key },
      'value': { value: settings.value },
      'advance': { value: advance },
      'deadvance': { value: deadvance },
      'unadvance': { value: unadvance },
      'valid': {
        writable: true,
        get valid() { return valid },
        set valid($valid) {
          Object.defineProperty(this, 'valid', { value: $valid })
        }
      },
      'report': { value: function() {
        const report = {}
        iterateConsevance: 
        for(const [$consevanceName, $consevance] of Object.entries({
          advance, deadvance, unadvance
        })) {
          iterateSevance: 
          for(const $sevance of $consevance) {
            const { type, key, value } = $sevance
            if($sevance instanceof Verification) {
              console.log($sevance.pass, $sevance.key, $sevance.value, `(${$sevance.type})`)
            }
            else if($sevance instanceof Validation) {
              $sevance.report()
              console.log(/*$sevance.verificationType, $sevance.required, */$sevance.valid, $sevance.key, $sevance.value)
            }
          }
        }
        return report
      } },
    })
  }
}