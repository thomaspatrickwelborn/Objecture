const Messages = {
  'true': ($validation) => `${$validation.valid}`,
  'false': ($validation) => `${$validation.valid}`,
}
export default class Validation extends EventTarget {
  constructor($settings = {}) {
    super()
    const settings = Object.assign({ messages: Messages }, $settings)
    let valid, properties
    const advance = []
    const deadvance = []
    const unadvance = []
    Object.defineProperties(this, {
      // get type() { return settings.type }
      'definition': { value: settings.definition },
      'path': { value: settings.path },
      'key': { value: settings.key },
      'value': { value: settings.value },
      'properties': { value: settings.properties },
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
    })
  }
}