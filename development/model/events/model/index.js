export default class ModelEvent extends CustomEvent {
  constructor($type, $settings, $model) {
    super($type, $settings)
    Object.defineProperties(this, {
      'model': { get () { return $model } },
      'key': { configurable: true, get () {
        const key = (this.path) ? this.path.split('.').pop() : null
        Object.defineProperty(this, 'key', { value: key })
        return key
      } },
      'change': { configurable: true, get () {
        const change = $settings.change
        Object.defineProperty(this, 'change', { value: change })
        return change
      } },
      'value': { configurable: true, get () {
        const value = $settings.value
        Object.defineProperty(this, 'value', { value: value })
        return value
      } },
      'path': { configurable: true, get () {
        const path = $settings.path
        Object.defineProperty(this, 'path', { value: path })
        return path
      } },
      'detail': { configurable: true, get () {
        const detail = $settings.detail
        Object.defineProperty(this, 'detail', { value: detail })
        return detail
      } },
    })
  }
}