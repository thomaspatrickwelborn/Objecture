export default class ValidatorEvent extends CustomEvent {
  constructor($type, $settings, $model) {
    super($type)
    Object.defineProperties(this, {
      'key': { configurable: true, get () {
        const key = $settings.key
        Object.defineProperty(this, 'key', { value: key })
        return key
      } },
      'path': { configurable: true, get () {
        const path = $settings.path
        Object.defineProperty(this, 'path', { value: path })
        return path
      } },
      'value': { configurable: true, get () {
        const value = $settings.value
        Object.defineProperty(this, 'value', { value: value, })
        return value
      } },
      'valid': { configurable: true, get () {
        const valid = $settings.valid
        Object.defineProperty(this, 'valid', { value: valid })
        return valid
      } },

    })
  }
}