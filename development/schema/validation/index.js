import { Coutil } from 'core-plex'
const { typedObjectLiteral } = Coutil
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
      'report': { value: function($format = "expand") {
        if($format === 'expand') {
          const report = { value: typedObjectLiteral($schema.type) }
          iterateSevance: 
          for(const $sevance of Array.prototype.concat(advance)) {
            if($sevance instanceof Validation) {
              iterateSubsevance: 
              for(const $subsevance of Array.prototype.concat($sevance.advance)) {
                if($subsevance instanceof Validation) {
                  report.value[$subsevance.key] = $subsevance.report($format)
                }
                else {
                  report.value[$subsevance.key] = report.value[$subsevance.key] || {}
                  report.value[$subsevance.key].validators = report.value[$subsevance.key].validators || {}
                  report.value[$subsevance.key].validators[$subsevance.type] = $subsevance
                }
                report.value[$subsevance.key].required = $sevance.required
                report.value[$subsevance.key].valid = $sevance.valid
              }
            }
          }
          report.valid = this.valid
          report.required = this.required
          return report
        }
        else if($format === 'impand') {
          if(!this.valid) return this.valid
          let report = typedObjectLiteral($schema.type)
          iterateSevance: 
          for(const $sevance of Array.prototype.concat(advance)) {
            if($sevance instanceof Validation) {
              iterateSubsevance: 
              for(const $subsevance of Array.prototype.concat($sevance.advance)) {
                if($subsevance instanceof Validation) {
                  report[$subsevance.key] = $subsevance.report($format)
                }
                else if(!Object.hasOwn(report, $subsevance.key)) {
                  report[$subsevance.key] = $sevance.valid
                }
              }
            }
          }
          return report
        }
      } },
    })
  }
}