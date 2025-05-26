import { typedObjectLiteral } from 'recourse'
import Verification from '../verification/index.js'
const Messages = {
  'true': ($validation) => `${$validation.valid}`,
  'false': ($validation) => `${$validation.valid}`,
}
function report($format = "expand", $prevalidation) {
  const prevalidation = $prevalidation || this
  const schema = prevalidation.schema
  const validations = [].concat(
    prevalidation.advance, prevalidation.deadvance, prevalidation.unadvance
  )
  if($format === "expand") {
    const _report = typedObjectLiteral(schema.type)
    iterateValidations: 
    for(const $validation of validations) {
      const verifications = [].concat(
        $validation.advance, $validation.deadvance, $validation.unadvance
      )
      _report[$validation.key] = {}
      iterateVerifications: 
      for(const $verification of verifications) {
        _report[$validation.key][$verification.type] = {}
        if($verification.validation) {
          _report[$validation.key][$verification.type] = this.report($format, $verification.validation)
        }
        else {
          _report[$validation.key][$verification.type] = $verification
        }
      }
    }
    return _report
  }
  if($format === "impand") {
    if(prevalidation.valid === false) { return false }
    const _report = typedObjectLiteral(schema.type)
    iterateValidations: 
    for(const $validation of validations) {
      const verifications = [].concat(
        $validation.advance, $validation.deadvance, $validation.unadvance
      )
      let reportValue
      iterateVerifications: 
      for(const $verification of verifications) {
        if($verification.type === 'type') {
          if($verification.validation && $validation.valid) {
            reportValue = this.report($format, $verification.validation)
          }
          break iterateVerifications
        }
      }
      if(!reportValue) { reportValue = $validation.valid }
      _report[$validation.key] = reportValue
    }
    return _report
  }
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
      'schema': { value: $schema },
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
        set valid($valid) { Object.defineProperty(this, 'valid', { value: $valid }) }
      },
      'report': { configurable: true, get() {
        const _report = report.bind(this)
        Object.defineProperty(this, 'report', { value: _report })
        return _report
      } },
    })
  }
}

