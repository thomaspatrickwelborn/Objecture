export default class ValidatorEvent extends CustomEvent {
  constructor($type, $settings, $model) {
    super($type)
    Object.defineProperties(this, {
      'key': { configurable: true, enumerable: true, get () {
        const key = $settings.key
        Object.defineProperty(this, 'key', { enumerable: true, value: key })
        return key
      } },
      'path': { configurable: true, enumerable: true, get () {
        const path = $settings.path
        Object.defineProperty(this, 'path', { enumerable: true, value: path })
        return path
      } },
      'value': { configurable: true, enumerable: true, get () {
        const value = $settings.value
        Object.defineProperty(this, 'value', { enumerable: true, value: value, })
        return value
      } },
      'valid': { configurable: true, enumerable: true, get () {
        const valid = $settings.valid
        Object.defineProperty(this, 'valid', { enumerable: true, value: valid })
        return valid
      } },

    })
  }
}